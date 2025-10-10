'use client';

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerTable from '@/components/features/dashboard/OwnerTable';
import ApplicantTable from '@/components/features/dashboard/ApplicantTable';
import BookmarkTable from '@/components/features/dashboard/BookmarkTable';
import { ProjectApplication, ProjectBookmark } from '@/components/features/dashboard/types';
import { createClient } from '@/lib/supabase/client';

interface DashboardClientProps {
    initialOwnerData: ProjectApplication[];
    initialApplicantData: ProjectApplication[];
    initialBookmarkData: ProjectBookmark[];
    userId: string;
}

export default function DashboardClient({
    initialOwnerData,
    initialApplicantData,
    initialBookmarkData,
    userId,
}: DashboardClientProps) {
    const [ownerData, setOwnerData] = useState(initialOwnerData);
    const [applicantData, setApplicantData] = useState(initialApplicantData);
    const [bookmarkData, setBookmarkData] = useState(initialBookmarkData);

    const refreshData = useCallback(async () => {
        const supabase = createClient();

        // Refresh applications data
        const { data: project_applications } = await supabase.from('project_applications').select('*');

        if (project_applications) {
            const newOwnerData = project_applications.filter(
                (application) => application.applicant_id !== userId,
            ) as ProjectApplication[];
            const newApplicantData = project_applications.filter(
                (application) => application.applicant_id === userId,
            ) as ProjectApplication[];

            setOwnerData(newOwnerData);
            setApplicantData(newApplicantData);
        }

        // Refresh bookmarks data
        const { data: bookmarks } = await supabase.from('project_bookmarks').select('*').eq('user_id', userId);

        if (bookmarks) {
            setBookmarkData(bookmarks as ProjectBookmark[]);
        }
    }, [userId]);

    return (
        <div className="p-4 space-y-8">
            <Tabs defaultValue="owner">
                <TabsList>
                    <TabsTrigger value="owner">Owner</TabsTrigger>
                    <TabsTrigger value="applicant">Applicant</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                </TabsList>
                <TabsContent value="owner">
                    <OwnerTable owner_data={ownerData} onDataUpdate={refreshData} />
                </TabsContent>
                <TabsContent value="applicant">
                    <ApplicantTable applicant_data={applicantData} />
                </TabsContent>
                <TabsContent value="bookmarks">
                    <BookmarkTable bookmark_data={bookmarkData} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
