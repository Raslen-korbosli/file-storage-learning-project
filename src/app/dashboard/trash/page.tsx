import FileBrowser from '@/components/FileBrowser';

export default function FavoritesPage() {
  return <FileBrowser title="Your Trash" deletedOnly={true} />;
}
