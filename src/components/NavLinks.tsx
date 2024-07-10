'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { FileIcon, StarIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function NavLinks() {
  const pathName = usePathname();

  return (
    <nav className="flex gap-4 flex-col items-start p-16 ">
      <Link
        href="/dashboard/files"
        className={`${pathName === '/dashboard/files' && 'text-gray-500'}`}
      >
        <Button
          variant="link"
          className={`flex gap-2 items-end  text-lg ${pathName === '/dashboard/files' ? 'text-blue-600' : 'text-gray-900'}`}
        >
          <FileIcon className="h-6 w-6" /> Files{' '}
        </Button>
      </Link>
      <Link href="/dashboard/favorites">
        <Button
          variant="link"
          className={`flex gap-2 items-end  text-lg ${pathName === '/dashboard/favorites' ? 'text-blue-600' : 'text-gray-900'}`}
        >
          <StarIcon className="h-6 w-6" />
          Favorite
        </Button>
      </Link>
    </nav>
  );
}
