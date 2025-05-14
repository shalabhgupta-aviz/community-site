'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
      <p className="mt-4 text-center">
        Sorry, we couldn&apos;t find what you were looking for.
      </p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}