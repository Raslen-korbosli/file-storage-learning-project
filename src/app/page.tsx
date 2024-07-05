'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useOrganization,
  useSession,
  useUser,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'required')
    .refine((files) => files.length > 0, 'required'),
});

export default function Home() {
  const { toast } = useToast();
  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';
  const collectFiles = useQuery(api.files.getFiles, {
    orgId: orgId,
  });

  const session = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organization && !user) return;
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': values.file[0]!.type },
      body: values.file[0],
    });
    const { storageId } = await result.json();
    try {
      await createFile({
        name: 'raslen',
        fileId: storageId,
        orgId: orgId,
      });
      form.reset();
      setDialogOpen(false);
      toast({
        variant: 'success',
        title: 'File Uploaded Successfully',
        description: 'Everyone can see your file',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'File Uploaded Failed',
        description: 'Something Went Wrong , try Again Later',
      });
    }
  }
  const fileRef = form.register('file');
  return (
    <main className="container p-12">
      <div className="flex justify-between items-center">
        <h1 className="capitalize text-4xl font-bold">your files</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(isOpen) => {
            setDialogOpen(isOpen);
            form.reset();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => {}}>
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] ">
            <DialogHeader className="pb-4">
              <DialogTitle>Upload Your File Here</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange } }) => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input type="file" {...fileRef} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogContent>
        </Dialog>

        {/* <Button
          onClick={() => {
            if (!organization && !user) return;
            return createFile({
              firstName: 'raslen',
              lastName: 'korbosli',
              orgId: orgId,
            });
          }}
        >
          Upload File
        </Button> */}
      </div>
    </main>
  );
}
