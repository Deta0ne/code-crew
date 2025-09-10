// BeaconForm.tsx
'use client';

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    // Basics
    title: z.string().min(3, 'Title must be at least 3 characters'),
    short_description: z.string().min(10, 'Short description must be at least 10 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    category: z.enum([
        'web',
        'mobile',
        'desktop',
        'ai_ml',
        'data_science',
        'devops',
        'design',
        'blockchain',
        'game_dev',
        'other',
    ]),
    project_type: z.enum(['learning', 'portfolio', 'open_source', 'hackathon', 'tutorial', 'research']),

    // Team
    max_members: z.number().min(2).max(20),
    difficulty: z.enum(['beginner_friendly', 'intermediate', 'advanced']),

    // Details
    estimated_duration_weeks: z.number().min(1).max(52),
    github_url: z.string().url().optional(),
    project_url: z.string().url().optional(),

    // Additional
    is_beginner_friendly: z.boolean(),
    mentoring_available: z.boolean(),
    remote_friendly: z.boolean(),
});

export function BeaconForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            max_members: 5,
            is_beginner_friendly: true,
            remote_friendly: true,
            mentoring_available: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Create Beacon</Button>
            </SheetTrigger>
            <SheetContent className="w-[95%] sm:w-[540px] sm:max-w-none">
                <SheetHeader>
                    <SheetTitle>Create a Project Beacon</SheetTitle>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Tabs defaultValue="basics" className="mt-6">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basics">Basics</TabsTrigger>
                                <TabsTrigger value="team">Team</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="additional">Additional</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basics" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter project title..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="short_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Brief overview of your project..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Detailed description of your project..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="web">Web Development</SelectItem>
                                                    <SelectItem value="mobile">Mobile Development</SelectItem>
                                                    <SelectItem value="ai_ml">AI/ML</SelectItem>
                                                    <SelectItem value="data_science">Data Science</SelectItem>
                                                    {/* Add other categories */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="team" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="max_members"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Maximum Team Size</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={2}
                                                    max={20}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Choose between 2-20 members</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Difficulty</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="beginner_friendly">Beginner Friendly</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="estimated_duration_weeks"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estimated Duration (weeks)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={52}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Project duration in weeks (1-52)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="github_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://github.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>

                        <SheetFooter>
                            <div className="flex justify-between w-full">
                                <Button type="button" variant="outline">
                                    Save as Draft
                                </Button>
                                <Button type="submit">Publish Beacon</Button>
                            </div>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
