'use client';

import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectApplication } from './types';
import React from 'react';
import { getApplicantColumns } from './applicant-columns';
import ApplicationDetailsDialog from './ApplicationDetailsDialog';
import { useRouter } from 'next/navigation';
import { deleteApplication } from '@/lib/services/application';
import { toast } from 'sonner';

const ApplicantTable = ({ applicant_data }: { applicant_data: ProjectApplication[] }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedApplication, setSelectedApplication] = React.useState<ProjectApplication | null>(null);

    const router = useRouter();

    const handleDeleteApplication = async (applicationId: string) => {
        const result = await deleteApplication(applicationId);
        if (result.success) {
            toast.success(result.message);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };
    const columns = React.useMemo(
        () =>
            getApplicantColumns(
                (application: ProjectApplication) => {
                    setSelectedApplication(application);
                    setDialogOpen(true);
                },
                (applicationId: string) => {
                    handleDeleteApplication(applicationId);
                },
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const table = useReactTable({
        data: applicant_data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <ApplicationDetailsDialog
                isOpen={dialogOpen}
                onOpenChange={setDialogOpen}
                application={selectedApplication}
                viewType="applicant"
            />
        </div>
    );
};

export default ApplicantTable;
