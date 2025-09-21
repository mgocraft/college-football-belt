export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const AUDIENCE_ID = process.env.MAILCHIMP_LIST_ID;
  const DATACENTER = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!API_KEY || !AUDIENCE_ID || !DATACENTER) {
    return res.status(200).json({
      error:
        'Newsletter signup is temporarily unavailable while configuration is finalized. Please try again soon.',
    });
  }

  const data = {
    email_address: email,
    status: 'subscribed',
  };

  try {
    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apiKey ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status >= 400) {
      let errorMessage = 'There was an error subscribing to the newsletter.';
      try {
        const bodyText = await response.text();
        if (bodyText) {
          try {
            const parsed = JSON.parse(bodyText);
            errorMessage =
              parsed?.detail ||
              parsed?.title ||
              parsed?.errors?.[0]?.message ||
              parsed?.error ||
              errorMessage;
          } catch (parseError) {
            errorMessage = bodyText;
          }
        }
      } catch (readError) {
        // Ignore body parsing issues and fall back to the default message.
      }

      if (response.status >= 500) {
        console.error('Mailchimp subscribe error:', errorMessage);
        return res.status(200).json({
          error:
            'Newsletter signup is temporarily unavailable. Please try again later.',
        });
      }

      return res.status(400).json({ error: errorMessage });
    }

    return res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    console.error('Failed to submit email to Mailchimp', err);
    return res.status(200).json({
      error:
        'Newsletter signup is temporarily unavailable. Please try again later.',
    });
  }
}
