'use client'

import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const data = [
    {
        "id": "cmko53dtj0006s3js9taidl4a",
        "userId": "klR9nGFJG8g57YmzX4rsWwZ4tn5pApQe",
        "createdAt": "2026-01-21 14:50:00.92",
        "published": true,
        "title": "Customer Feedback Survey",
        "description": "Please share your thoughts with us",
        "shareUrl": "e678343d-fa19-4a19-bde4-302d897ab3b2",
        "status": "PUBLISHED",
        "content": [
            {
                "id": "1769006955470",
                "type": "text",
                "label": "Name",
                "order": 1,
                "editable": true,
                "required": true,
                "placeholder": "Enter text"
            },
            {
                "id": "1769006957019",
                "type": "email",
                "label": "Email",
                "order": 2,
                "editable": true,
                "required": false,
                "placeholder": "Enter email"
            },
            {
                "id": "1769006958670",
                "type": "checkbox",
                "label": "All the information is correct",
                "order": 3,
                "editable": true,
                "required": true,
                "placeholder": "Enter checkbox"
            }
        ]
    },
];

const columnHelper = createColumnHelper();

const columns = [
    columnHelper.accessor('title', {
        header: 'Title',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
            <Badge variant={info.getValue() === 'PUBLISHED' ? 'default' : 'secondary'}>
                {info.getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor('published', {
        header: 'Published',
        cell: info => (
            <Badge variant={info.getValue() ? 'default' : 'destructive'}>
                {info.getValue() ? 'Yes' : 'No'}
            </Badge>
        ),
    }),
    columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: info => {
            const date = new Date(info.getValue());
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        },
    }),
    columnHelper.accessor('content', {
        header: 'Fields',
        cell: info => info.getValue().length,
    }),
];

export default function Page() {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Forms Overview</h1>
            <div className="rounded-md border">
                <table className="w-full">
                    <thead className="border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="h-12 px-4 text-left align-middle font-medium">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
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
        </div>
    );
}