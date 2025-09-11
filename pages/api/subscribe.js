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
      return res.status(400).json({ error: 'There was an error subscribing to the newsletter.' });
    }

    return res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error' });
  }
}
