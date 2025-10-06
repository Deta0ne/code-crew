import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectApplication } from './types';
import { formatDate } from '@/components/features/BeaconForm/config/utils';

export const getApplicantColumns = (
    onViewDetails: (application: ProjectApplication) => void,
    onDeleteApplication: (applicationId: string) => void,
): ColumnDef<ProjectApplication>[] => [
    {
        accessorKey: 'owner_username',
        header: () => {
            return <div className="text-left">Owner</div>;
        },
        cell: ({ row }) => (
            <div className=" text-blue-500">
                <Link href={`/${row.getValue('owner_username')}`}>{row.getValue('owner_username')}</Link>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
    },
    {
        accessorKey: 'motivation_message',
        header: () => <div>Motivation Message</div>,
        cell: ({ row }) => {
            const motivation_message = row.getValue('motivation_message');
            return (
                <div className="max-w-xs truncate" title={motivation_message as string}>
                    {motivation_message as string}
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Applied Date',
        cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue('created_at'))}</div>,
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue('updated_at'))}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(row.original as ProjectApplication)}>
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteApplication(row.original.id)}>
                            Delete Application
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
