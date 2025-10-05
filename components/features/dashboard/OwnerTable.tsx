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
import {} from '@/components/ui/dropdown-menu';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectApplication } from './types';
import React from 'react';
import { getColumns } from './owner-columns';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from '@/components/ui/dialog';

const OwnerTable = ({ owner_data }: { owner_data: ProjectApplication[] }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedApplication, setSelectedApplication] = React.useState<ProjectApplication | null>(null);

    const columns = React.useMemo(
        () =>
            getColumns((application: ProjectApplication) => {
                setSelectedApplication(application);
                setDialogOpen(true);
            }),
        [],
    );

    const table = useReactTable({
        data: owner_data,
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
                                    No results.
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>Complete details of the selected application</DialogDescription>
                    </DialogHeader>
                    {selectedApplication ? (
                        <div>
                            {/* Basic Information Section */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Applicant</Label>
                                        <div className="col-span-2">{selectedApplication.applicant_name}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Status</Label>
                                        <div className="col-span-2">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                    selectedApplication.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : selectedApplication.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {selectedApplication.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Applied Date</Label>
                                        <div className="col-span-2">
                                            {new Date(selectedApplication.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Last Updated</Label>
                                        <div className="col-span-2">
                                            {new Date(selectedApplication.updated_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Application Details Section */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold pb-2">Application Details</h3>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <Label className="font-medium">Motivation</Label>
                                        <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                            {selectedApplication.motivation_message}
                                        </div>
                                    </div>
                                    {selectedApplication.what_they_bring && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">What They Bring</Label>
                                            <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                                {selectedApplication.what_they_bring}
                                            </div>
                                        </div>
                                    )}
                                    {selectedApplication.what_they_want_to_learn && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">What They Want To Learn</Label>
                                            <div className="col-span-2 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                                {selectedApplication.what_they_want_to_learn}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Availability & Contact Section */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Availability & Contact</h3>
                                <div className="grid gap-2">
                                    {selectedApplication.hours_per_week != null && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">Hours per Week</Label>
                                            <div className="col-span-2 dark:text-white">
                                                {selectedApplication.hours_per_week} hours
                                            </div>
                                        </div>
                                    )}
                                    {selectedApplication.timezone && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">Timezone</Label>
                                            <div className="col-span-2 dark:text-white">
                                                {selectedApplication.timezone}
                                            </div>
                                        </div>
                                    )}
                                    {selectedApplication.portfolio_url && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">Portfolio</Label>
                                            <a
                                                className="col-span-2 text-blue-600 hover:text-blue-800 underline break-all dark:text-white"
                                                href={selectedApplication.portfolio_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {selectedApplication.portfolio_url}
                                            </a>
                                        </div>
                                    )}
                                    {selectedApplication.github_url && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Label className="font-medium">GitHub</Label>
                                            <a
                                                className="col-span-2 text-blue-600 hover:text-blue-800 underline break-all"
                                                href={selectedApplication.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {selectedApplication.github_url}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Section */}
                            {(selectedApplication.reviewed_at ||
                                selectedApplication.reviewed_by ||
                                selectedApplication.review_notes) && (
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold border-b pb-2">Review Information</h3>
                                    <div className="grid gap-2">
                                        {selectedApplication.reviewed_at && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label className="font-medium">Reviewed At</Label>
                                                <div className="col-span-2">
                                                    {new Date(selectedApplication.reviewed_at).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        {selectedApplication.reviewed_by && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label className="font-medium">Reviewed By</Label>
                                                <div className="col-span-2 font-mono text-sm text-gray-600">
                                                    {selectedApplication.reviewed_by}
                                                </div>
                                            </div>
                                        )}
                                        {selectedApplication.review_notes && (
                                            <div className="grid grid-cols-3 gap-2">
                                                <Label className="font-medium">Review Notes</Label>
                                                <div className="col-span-2 whitespace-pre-wrap bg-blue-50 p-3 rounded-md border border-blue-200">
                                                    {selectedApplication.review_notes}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No application selected.</p>
                            <p className="text-sm mt-1">Please select an application to view details.</p>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-start mt-1">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OwnerTable;
