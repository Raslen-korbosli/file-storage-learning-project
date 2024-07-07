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

import { Doc } from '../../convex/_generated/dataModel';
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
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from './ui/use-toast';
import Image from 'next/image';
function getImage(fileId: string) {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
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
  const types = {
    pdf: <FileTextIcon />,
    image: <ImageIcon />,
    csv: <GanttChartIcon />,
  };
  return (
    <Card className="">
      <CardHeader className="relative">
        <div className="flex flex-4 items-center gap-4">
          <CardTitle className="flex justify-center items-start b-0">
            {file.name}
          </CardTitle>
          <CardContent>{types[file.type]}</CardContent>
        </div>
        <CardContent>
          <Image
            alt={`${file.name} image`}
            width={200}
            height={200}
            src={getImage(file._id)}
          />
        </CardContent>
        <div className="absolute top-2 right-2 ">
          <FileCardAction file={file} />
        </div>
      </CardHeader>

      <CardFooter>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
}
