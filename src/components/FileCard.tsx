import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatRelative } from 'date-fns';

import { useQuery } from 'convex/react';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
import { DropDownActions } from './DropDownActions';

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
          <DropDownActions
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
