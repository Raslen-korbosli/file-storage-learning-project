import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Protect } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import {
  DownloadIcon,
  MoreVertical,
  StarIcon,
  StarOff,
  TrashIcon,
  UndoIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import { useToast } from './ui/use-toast';
export function DropDownActions({
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
