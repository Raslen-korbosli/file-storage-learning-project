'use client';
import FileCard from '@/components/FileCard';
import SearchBar from '@/components/SearchBar';
import DialogUpload from '@/components/dialogUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Grid2X2Icon, Loader2, Rows3 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';
import { DataTable } from './FileTable';
import { columns } from './columns';

export default function FileBrowser({
  title,
  favorite,
  deletedOnly,
}: {
  title: string;
  favorite?: boolean;
  deletedOnly?: boolean;
}) {
  console.log(favorite);
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const files = useQuery(api.files.getFiles, {
    orgId: orgId,
    query,
    favorites: favorite,
    deletedOnly,
    type,
  });
  const allFavorites = useQuery(api.files.allFavorites, { orgId: orgId });

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
        <SearchBarHeader />

        <div>
          {' '}
          <Tabs defaultValue="grid" className="w-full">
            <div className=" flex justify-between ">
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid2X2Icon />{' '}
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Rows3 />
                </TabsTrigger>
              </TabsList>
              <div>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">Pdf</SelectItem>
                    <SelectItem value="csv">Csv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {files === undefined ? (
              <div className=" flex flex-col justify-center items-center p-16 min-h-full text-gray-800">
                <Loader2 className="h-32 w-32 animate-spin" />{' '}
                <span className="text-xl">loading...</span>
              </div>
            ) : files.length > 0 ? (
              <>
                <TabsContent value="grid" className="overflow-y-scroll">
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4 max-h-[600px]">
                    {files?.map((file) => (
                      <FileCard
                        key={file.fileId}
                        file={file}
                        allFavorites={allFavorites ?? []}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="table">
                  <DataTable columns={columns} data={files} />
                </TabsContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-start gap-4 min-h-full ">
                <div className="relative aspect-square w-[40%]">
                  <Image
                    alt="picture of empty directory icon"
                    src="/empty.svg"
                    fill
                    className="absolute   "
                  />
                </div>
                <div></div>
                <p className="text-2xl ">
                  {!query
                    ? 'You Have No Files, Upload One Now'
                    : 'File Not Found'}
                </p>
                {!query && <DialogUpload />}
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </main>
  );
}
