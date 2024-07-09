'use client';

import { useOrganization, useSession, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import DialogUpload from '@/components/dialogUpload';
import { Loader2 } from 'lucide-react';
import FileCard from '@/components/FileCard';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';

export default function FileBrowser({
  title,
  setQuery,
  query,
  files,
}: {
  title: string;
  files: Array<object[]>;
}) {
  return (
    <main className=" p-16 flex-1   ">
      <div className="container">
        {query && (
          <div className="flex justify-between items-center pb-8">
            <h1 className="capitalize text-4xl font-bold ">{title}</h1>
            <SearchBar setQuery={setQuery} />
            <DialogUpload />
          </div>
        )}
        {collectFiles === undefined ? (
          <div className=" flex flex-col justify-center items-center p-16 min-h-full text-gray-800">
            <Loader2 className="h-32 w-32 animate-spin" />{' '}
            <span className="text-xl">loading...</span>
          </div>
        ) : collectFiles.length > 0 ? (
          <div>
            {!query && (
              <div className="flex justify-between items-center pb-8">
                <h1 className="capitalize text-4xl font-bold">your files</h1>
                <SearchBar setQuery={setQuery} />
                <DialogUpload />
              </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {collectFiles?.map((file) => (
                <FileCard key={file.fileId} file={file} />
              ))}
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
