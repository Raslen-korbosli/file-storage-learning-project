'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { formatRelative } from 'date-fns';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Image from 'next/image';
import { useState } from 'react';
import { DropDownActions } from './DropDownActions';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
function UserCell({ userId }: { userId: Id<'users'> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId: userId });

  return (
    <div className="flex gap-2 items-center">
      <Image
        src={userProfile?.image ?? ''}
        className="rounded-full h-6 w-6"
        width={50}
        height={50}
        alt="user Image "
      />{' '}
      {userProfile?.name}
    </div>
  );
}
function DropDownMenu({ file }: { file: Doc<'files'> }) {
  // const allFavorites = useQuery(api.files.allFavorites, { orgId: file.orgId });
  // const isFavorite = allFavorites?.some(
  //   (favorite) => favorite.fileId === file._id
  // );
  const FileImageUrl = useQuery(api.files.getFileImageUrl, {
    fileId: file.fileId,
  });

  return (
    <DropDownActions
      file={file}
      FileImageUrl={FileImageUrl ?? ''}
      isFavorite={false}
    />
  );
}
export const columns: ColumnDef<Doc<'files'>>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'User',
    cell: ({ row }) => <UserCell userId={row.original.userId} />,
  },
  {
    header: 'Uploaded On ',
    cell: ({ row }) => (
      <div>
        {' '}
        {formatRelative(new Date(row.original._creationTime), new Date())}
      </div>
    ),
  },
  {
    header: 'Actions',
    cell: ({ row }) => <DropDownMenu file={row.original} />,
  },
];
