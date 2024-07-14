import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format, formatRelative } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Doc, Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/button';
import {
  DeleteIcon,
  DownloadIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  StarIcon,
  StarOff,
  TrashIcon,
  UndoIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from './ui/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Protect } from '@clerk/nextjs';
function FileCardAction({
  file,
  isFavorite,
  FileImageUrl,
}: {
  file: Doc<'files'>;
  isFavorite: boolean;
  FileImageUrl: string;
}) {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file to our deletion process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // TODO:delete
                try {
                  await deleteFile({
                    fileId: file._id,
                  });
                  toast({
                    variant: 'success',
                    title: 'File Marked For Deletion',
                    description: 'your File Will Be Deleted Soon',
                  });
                } catch (err) {
                  toast({
                    variant: 'destructive',
                    title: 'File deleted Failed',
                    description: 'Something Went Wrong , try Again Later',
                  });
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />{' '}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              await toggleFavorite({
                fileId: file._id,
                orgId: file.orgId,
              });
            }}
            className="flex gap-1"
          >
            {isFavorite ? (
              <>
                <StarOff className="h-4 w-4" />
                Unfavorite
              </>
            ) : (
              <>
                <StarIcon className="h-4 w-4" />
                Favorite
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              await toggleFavorite({
                fileId: file._id,
                orgId: file.orgId,
              });
            }}
            className="flex gap-1"
          >
            <DownloadIcon className="h-4 w-4" />
            <Link href={FileImageUrl} target="_blank">
              Download
            </Link>
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                file.shouldDeleted
                  ? restoreFile({ fileId: file._id })
                  : setIsConfirmOpen(true);
              }}
              className={`flex gap-1 ${file.shouldDeleted ? ' text-green-600 focus:text-green-700' : ' text-red-600 focus:text-red-700'} cursor-pointer `}
            >
              {file.shouldDeleted ? (
                <>
                  <UndoIcon className="h-4 w-4" /> Restore
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" /> Delete
                </>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default function FileCard({
  file,
  allFavorites,
}: {
  file: Doc<'files'>;
  allFavorites: Array<Doc<'favorites'>>;
}) {
  const FileImageUrl = useQuery(api.files.getFileImageUrl, {
    fileId: file.fileId,
  });
  const isFavorite = allFavorites.some(
    (favorite) => favorite.fileId === file._id
  );
  const types = {
    pdf: <FileTextIcon />,
    image: <ImageIcon />,
    csv: <GanttChartIcon />,
  };
  const UserProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  return (
    <Card>
      <CardHeader className="relative ">
        <div className="flex flex-4 self-start">
          <CardTitle className="flex justify-center items-start gap-2 pb-2">
            {types[file.type]}
            {file.name}
          </CardTitle>
        </div>
        <CardContent className="flex flex-col justify-center items-center">
          <div className=" relative aspect-square h-[100px]  ">
            {file.type === 'image' && (
              <Image
                alt={`${file.name} image`}
                fill
                src={FileImageUrl ? FileImageUrl : '/emptyImage.svg'}
              />
            )}
            {file.type === 'pdf' && (
              <Image alt={`${file.name} image`} fill src="/pdf.png" />
            )}
            {file.type === 'csv' && (
              <Image alt={`${file.name} image`} fill src="/csv.png" />
            )}
          </div>
        </CardContent>
        <div className="absolute top-2 right-2 ">
          <FileCardAction
            file={file}
            isFavorite={isFavorite}
            FileImageUrl={FileImageUrl ?? ''}
          />
        </div>
      </CardHeader>

      <CardFooter className="flex justify-between  items-center gap-2 text-sm text-gray-700 flex-wrap">
        <div className="flex gap-2 items-center">
          {' '}
          <Avatar className="h-6 w-6">
            <AvatarImage src={UserProfile?.image} />
            <AvatarFallback> {UserProfile?.name}</AvatarFallback>
          </Avatar>
          {UserProfile?.name}
        </div>

        <p className="text-gray-700 text-sm">
          {/* Uploaded On {format(new Date(file._creationTime), 'MM/dd/yyyy H:m')} */}
          Uploaded {formatRelative(new Date(file._creationTime), new Date())}
        </p>
      </CardFooter>
    </Card>
  );
}
