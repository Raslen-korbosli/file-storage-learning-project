'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization, useSession, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';
const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'required')
    .refine((files) => files.length > 0, 'required'),
});

export default function DialogUpload() {
  const { toast } = useToast();
  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { organization } = useOrganization();
  const { user } = useUser();
  const orgId = organization ? organization.id : user?.id ?? 'skip';

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
    const types = {
      'application/pdf': 'pdf',
      'image/png': 'image',
      'text/csv': 'csv',
    } as Record<string, Doc<'files'>['type']>;
    try {
      await createFile({
        name: form.getValues('title'),
        fileId: storageId,
        orgId: orgId,
        type: types[values.file[0].type],
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
    <Dialog
      open={dialogOpen}
      onOpenChange={(isOpen) => {
        setDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="default"
          className=" text-lg"
          size="lg"
          onClick={() => {}}
        >
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader className="pb-4">
          <DialogTitle>Upload Your File Here</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  );
}
