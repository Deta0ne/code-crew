import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectApplication } from './types';
import Link from 'next/link';
import { formatDate } from '@/components/features/BeaconForm/config/utils';

export const getColumns = (
    onViewDetails: (application: ProjectApplication) => void,
): ColumnDef<ProjectApplication>[] => [
    {
        accessorKey: 'applicant_name',
        header: () => {
            return <div className="text-left">Applicant Name</div>;
        },
        cell: ({ row }) => (
            <div className=" text-blue-500">
                <Link href={`/${row.getValue('applicant_name')}`}>{row.getValue('applicant_name')}</Link>
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
            return <div>{motivation_message as string}</div>;
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue('created_at'))}</div>,
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
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
                        <DropdownMenuItem asChild>
                            <Link href={`/${row.getValue('applicant_name')}`}>View applicant</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewDetails(row.original as ProjectApplication)}>
                            View Details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
