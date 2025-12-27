"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TicketTreeType } from "@/type/schema/ticket.schema";

type TicketTreeTableProps = {
  idLabel: string;
  dateLabel: string;
  performedByLabel: string;
  notesLabel: string;
  noTicketsLabel: string;
};

export const columns = (
  props: TicketTreeTableProps
): ColumnDef<TicketTreeType>[] => [
  {
    accessorKey: "id",
    header: () => props.idLabel,
  },
  {
    accessorKey: "date",
    header: () => props.dateLabel,
    cell: ({ row }) => (
      <div>{new Date(row.original.date).toISOString().split("T")[0]}</div>
    ),
  },
  {
    accessorKey: "performedBy",
    header: () => props.performedByLabel,
  },
  {
    accessorKey: "notes",
    header: () => props.notesLabel,
  },
];

export default function TicketTreeTable({
  idLabel,
  dateLabel,
  performedByLabel,
  notesLabel,
  noTicketsLabel,
}: TicketTreeTableProps) {
  const [data, setData] = useState<TicketTreeType[]>([
    {
      id: 1,
      date: new Date(),
      performedBy: "Admin 1",
      notes: "Ghi chú 1",
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000), // yesterday
      performedBy: "Admin 2",
      notes: "Ghi chú 2",
    },
    {
      id: 3,
      date: new Date(Date.now() - 172800000), // 2 days ago
      performedBy: "Admin 3",
      notes: "Ghi chú 3",
    },
  ]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: columns({
      idLabel,
      dateLabel,
      performedByLabel,
      notesLabel,
      noTicketsLabel,
    }),
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    columns({
                      idLabel,
                      dateLabel,
                      performedByLabel,
                      notesLabel,
                      noTicketsLabel,
                    }).length
                  }
                  className="h-24 text-center"
                >
                  {noTicketsLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
    </div>
  );
}
