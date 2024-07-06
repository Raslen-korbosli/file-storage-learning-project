'use client';

import DialogUpload from '@/components/dialogUpload';
import { useOrganization, useSession, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import FileCard from '@/components/FileCard';
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
    <main className=" p-12">
      <div className="flex justify-between items-center pb-8">
        <h1 className="capitalize text-4xl font-bold">your files</h1>
        <DialogUpload />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {collectFiles?.map((file) => (
          <FileCard key={file.fileId} file={file} />
        ))}
      </div>
    </main>
  );
}
