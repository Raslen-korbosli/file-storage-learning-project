import { Button } from '@/components/ui/button';
import {
  OrganizationSwitcher,
  Protect,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

import Image from 'next/image';
import Link from 'next/link';
export default function Header() {
  return (
    <div className=" border-b p-4 bg-gray-50  w-full z-50 fixed ">
      <div className="container flex flex-row justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-semibold flex items-center gap-2"
        >
          <Image src="/logo.png" width={50} height={50} alt="logo image" />
          File Storage
        </Link>
        <div className="flex gap-4">
          {' '}
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
