import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonError) {
        data = null;
      }

      if (res.ok && !(data && data.error)) {
        setEmail('');
        setMessage((data && data.message) || 'Thanks for subscribing!');
      } else {
        setMessage((data && data.error) || 'Subscription failed.');
      }
    } catch (err) {
      setMessage('Subscription failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#001f3f' }}>
        Stay on top of which team has the CFB Belt: Sign up for our newsletter!
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email"
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>
      {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
    </div>
  );
}
