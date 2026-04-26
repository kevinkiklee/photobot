'use client';

import { useState } from 'react';

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/csrf');
    const { csrfToken } = await res.json();

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signin/discord';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrfToken';
    input.value = csrfToken;
    form.appendChild(input);

    const cb = document.createElement('input');
    cb.type = 'hidden';
    cb.name = 'callbackUrl';
    cb.value = '/';
    form.appendChild(cb);

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-1.5 rounded-lg text-xs font-medium bg-brand-primary/15 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/25 transition-all"
    >
      {loading ? 'Connecting...' : 'Sign in with Discord'}
    </button>
  );
}
