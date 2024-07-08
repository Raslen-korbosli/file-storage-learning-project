import Link from 'next/link';
import { Button } from './ui/button';
import { FileIcon, StarIcon } from 'lucide-react';

export default function NavLinks() {
  return (
    <nav className="flex gap-4 flex-col items-start p-16 ">
      <Link href="/dashboard/files">
        <Button variant="link" className="flex gap-2 items-end  text-lg ">
          <FileIcon className="h-6 w-6" /> Files{' '}
        </Button>
      </Link>
      <Link href="/dashboard/favorites">
        <Button variant="link" className="flex gap-2 items-end text-lg ">
          <StarIcon className="h-6 w-6" />
          Favorite
        </Button>
      </Link>
    </nav>
  );
}
