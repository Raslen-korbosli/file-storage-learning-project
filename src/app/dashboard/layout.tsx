import NavLinks from '@/components/NavLinks';
import type { Metadata } from 'next';
import Header from '../Header';
export const metadata: Metadata = {
  title: 'dashboard',
};

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className={` flex min-h-full `}>
        <NavLinks />
        {children}
      </div>
    </div>
  );
}
