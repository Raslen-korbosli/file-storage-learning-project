'use client';
import { Button } from '@/components/ui/button';
import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useSession,
} from '@clerk/nextjs';
import Image from 'next/image';
import { mutation } from '../../convex/_generated/server';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const collectFiles = useQuery(api.files.getFiles);
  const session = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello here</h1>

      <SignedIn>
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <Button
        onClick={() => createFile({ name: 'raslen', lastName: 'korbosli' })}
      >
        {' '}
        click me
      </Button>
    </main>
  );
}
