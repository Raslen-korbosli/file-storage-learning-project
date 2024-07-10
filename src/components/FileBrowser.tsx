'use client';
import FileCard from '@/components/FileCard';
import SearchBar from '@/components/SearchBar';
import DialogUpload from '@/components/dialogUpload';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { useOrganization, useUser } from '@clerk/nextjs';

export default function FileBrowser({
  title,
  favorite,
}: {
  title: string;
  favorite?: boolean;
}) {
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';
  const [query, setQuery] = useState('');
  let files = useQuery(api.files.getFiles, {
    orgId: orgId,
    query,
    favorites: favorite,
  });

  function SearchBarHeader() {
    return (
      <div className="flex justify-between items-center pb-8">
        <h1 className="capitalize text-4xl font-bold ">{title}</h1>
        <SearchBar setQuery={setQuery} />
        <DialogUpload />
      </div>
    );
  }
  return (
    <main className=" p-16 flex-1   ">
      <div className="container">
        {query && <SearchBarHeader />}
        {files === undefined ? (
          <div className=" flex flex-col justify-center items-center p-16 min-h-full text-gray-800">
            <Loader2 className="h-32 w-32 animate-spin" />{' '}
            <span className="text-xl">loading...</span>
          </div>
        ) : files.length > 0 ? (
          <div>
            {!query && <SearchBarHeader />}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {files?.map((file) => <FileCard key={file.fileId} file={file} />)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start gap-4 min-h-full ">
            <div className="relative aspect-square h-[500px]   ">
              <Image
                alt="picture of empty directory icon"
                src="/empty.svg"
                fill
                className="absolute    "
              />
            </div>
            <div></div>
            <p className="text-2xl ">
              {!query ? 'You Have No Files, Upload One Now' : 'File Not Found'}
            </p>
            {!query && <DialogUpload />}
          </div>
        )}
      </div>
    </main>
  );
}
