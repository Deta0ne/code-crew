import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectBookmark } from './types';
import { formatDate } from '@/components/features/BeaconForm/config/utils';

export const getBookmarkColumns = (onRemoveBookmark: (bookmarkId: string) => void): ColumnDef<ProjectBookmark>[] => [
    {
        accessorKey: 'title',
        header: () => {
            return <div className="text-left">Project Title</div>;
        },
        cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
        accessorKey: 'project_type',
        header: 'Type',
        cell: ({ row }) => {
            const projectType = row.getValue('project_type') as string;
            return (
                <Badge variant="outline" className="capitalize">
                    {projectType.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColors = {
                active: 'bg-green-100 text-green-800',
                draft: 'bg-gray-100 text-gray-800',
                paused: 'bg-yellow-100 text-yellow-800',
                completed: 'bg-blue-100 text-blue-800',
                cancelled: 'bg-red-100 text-red-800',
            };
            return (
                <Badge
                    className={`capitalize ${
                        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Bookmarked',
        cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue('created_at'))}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        header: () => <div className="text-left">Delete</div>,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveBookmark(row.original.project_id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            );
        },
    },
];
