import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Loader2, SearchIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Dispatch, SetStateAction } from 'react';
import { query } from '../../convex/_generated/server';

const formSchema = z.object({
  query: z.string().min(0).max(200),
});
export default function SearchBar({
  setQuery,
}: {
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();
    setQuery(values.query);
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex gap-2  justify-center items-center"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="w-[300px]"
                    placeholder="search your file name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex gap-1 items-center !mt-0"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <SearchIcon />
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
}
