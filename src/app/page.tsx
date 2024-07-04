'use client';
import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useSession,
  useUser,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';
  const collectFiles = useQuery(api.files.getFiles, {
    orgId: orgId,
  });

  const session = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        onClick={() => {
          if (!organization && !user) return;
          return createFile({
            firstName: 'raslen',
            lastName: 'korbosli',
            orgId: orgId,
          });
        }}
      >
        click me
      </Button>
    </main>
  );
}
