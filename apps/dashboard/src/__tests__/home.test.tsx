import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

vi.mock('../lib/auth', () => ({
  authOptions: {},
}));

import Home from '../app/page';

describe('Home Page', () => {
  it('renders the heading "Photobot"', async () => {
    const Page = await Home();
    render(Page);
    const heading = screen.getByRole('heading', { level: 1, name: /Photobot/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', async () => {
    const Page = await Home();
    render(Page);
    const description = screen.getByText(/Photography Lounge/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the "Login with Discord" link when not logged in', async () => {
    const Page = await Home();
    render(Page);
    const loginLink = screen.getByText(/Sign in with Discord/i);
    expect(loginLink).toBeInTheDocument();
  });

  it('contains the camera icon', async () => {
    const Page = await Home();
    const { container } = render(Page);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
