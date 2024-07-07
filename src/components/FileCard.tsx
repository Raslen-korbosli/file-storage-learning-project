import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

import { Doc, Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/button';
import {
  DeleteIcon,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from './ui/use-toast';
import Image from 'next/image';
import Link from 'next/link';
function getImage(fileId: Id<'_storage'>) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${'310c8a2f-b1c3-4dd8-9473-ea8d40928dd3'}`;
}
function FileCardAction({ file }: { file: Doc<'files'> }) {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
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
                    title: 'File deleted Successfully',
                    description: 'your File Now Is Gone From The System',
                  });
                } catch (err) {
                  toast({
                    variant: 'destructive',
                    title: 'File Uploaded Failed',
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
            onClick={() => setIsConfirmOpen(true)}
            className="flex gap-1 text-red-600 focus:text-red-700 focus:bg-gray-50 "
          >
            <TrashIcon className="h-4 w-4" /> Delete
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default function FileCard({ file }: { file: Doc<'files'> }) {
  const FileImageUrl = useQuery(api.files.getFileImageUrl, {
    fileId: file.fileId,
  });

  const types = {
    pdf: <FileTextIcon />,
    image: <ImageIcon />,
    csv: <GanttChartIcon />,
  };

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
          <FileCardAction file={file} />
        </div>
      </CardHeader>

      <CardFooter className="flex flex-col justify-center items-center">
        <Link href={FileImageUrl ? FileImageUrl : ''} target="_blank">
          <Button variant="outline">Download</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
