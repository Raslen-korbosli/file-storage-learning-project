'use client';

import DialogUpload from '@/components/dialogUpload';
import { useOrganization, useSession, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import FileCard from '@/components/FileCard';
import Image from 'next/image';
import { Loader, Loader2 } from 'lucide-react';
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
    <main className=" p-16 flex-1 ">
      {collectFiles === undefined ? (
        <div className=" flex flex-col justify-center items-center p-16 min-h-full text-gray-800">
          <Loader2 className="h-32 w-32 animate-spin" />{' '}
          <span className="text-xl">loading...</span>
        </div>
      ) : collectFiles?.length > 0 ? (
        <div>
          <div className="flex justify-between items-center pb-8">
            <h1 className="capitalize text-4xl font-bold">your files</h1>
            <DialogUpload />
          </div>
          <div className="grid grid-cols-[repeat(6,minmax(300px,1fr))] gap-4">
            {collectFiles?.map((file) => (
              <FileCard key={file.fileId} file={file} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start gap-4 min-h-full">
          <div className="relative aspect-square h-[500px]   ">
            <Image
              alt="picture of empty directory icon"
              src="./empty.svg"
              fill
              className="absolute    "
            />
          </div>
          <p className="text-2xl ">You Have No Files, Upload One Now</p>
          <DialogUpload />
        </div>
      )}
      {/* {collectFiles?.length === 0 && !collectFiles && (
        <div className="flex flex-col items-center justify-start gap-4 min-h-full">
          <div className="relative aspect-square h-[500px]   ">
            <Image
              alt="picture of empty directory icon"
              src="./empty.svg"
              fill
              className="absolute    "
            />
          </div>
          <p className="text-2xl ">You Have No Files, Upload One Now</p>
          <DialogUpload />
        </div>
      )} */}
      {/* {collectFiles && collectFiles?.length > 0 && (
        <div>
          <div className="flex justify-between items-center pb-8">
            <h1 className="capitalize text-4xl font-bold">your files</h1>
            <DialogUpload />
          </div>
          <div className="grid grid-cols-[repeat(4,minmax(300px,1fr))] gap-4">
            {collectFiles?.map((file) => (
              <FileCard key={file.fileId} file={file} />
            ))}
          </div>
        </div>
      )} */}
    </main>
  );
}
