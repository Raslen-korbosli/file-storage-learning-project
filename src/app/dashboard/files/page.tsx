import FileBrowser from '@/components/FileBrowser';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';

export default function FilePage() {
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';
  const [query, setQuery] = useState('');
  let files = useQuery(api.files.getFiles, {
    orgId: orgId,
  });
  files = files?.filter((file) =>
    file.name.toLowerCase().startsWith(query.toLowerCase())
  );
  return <FileBrowser title="Your Files" />;
}
