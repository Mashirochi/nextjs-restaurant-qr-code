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
import { Pencil, Trash2, ChevronsUpDown, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BranchListResType,
  BranchSchemaType,
} from "../../../type/schema/branch.schema";
import EditBranch from "./edit.branch";
import AddBranch from "./add.branch";
import AutoPagination from "@/components/custom/auto.pagination";
import {
  useDeleteBranchMutation,
  useGetBranchList,
} from "@/lib/query/useBranch";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const getMapSrcFromInput = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.includes("<iframe")) {
    const matched = trimmed.match(/src=["']([^"']+)["']/i);
    return matched?.[1] ?? "";
  }

  return trimmed;
};

type BranchItem = BranchListResType["data"][0];

const BranchTableContext = createContext<{
  setBranchIdEdit: (value: number) => void;
  branchIdEdit: number | undefined;
  branchDelete: BranchItem | null;
  setBranchDelete: (value: BranchItem | null) => void;
}>({
  setBranchIdEdit: (value: number | undefined) => {},
  branchIdEdit: undefined,
  branchDelete: null,
  setBranchDelete: (value: BranchItem | null) => {},
});

export const columns: ColumnDef<BranchSchemaType>[] = [
  {
    id: "Order",
    header: "STT",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên chi nhánh",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Địa chỉ
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "hotline",
    header: "Hotline",
    cell: ({ row }) => <div>{row.getValue("hotline")}</div>,
  },
  {
    accessorKey: "open",
    header: "Mở cửa",
    cell: ({ row }) => <div>{row.getValue("open")}</div>,
  },
  {
    accessorKey: "close",
    header: "Đóng cửa",
    cell: ({ row }) => <div>{row.getValue("close")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setBranchIdEdit, setBranchDelete } =
        useContext(BranchTableContext);

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBranchIdEdit(row.original.id)}
          >
            <Pencil className="h-4 w-4 text-blue-600 hover:scale-110 transition" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBranchDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-600 hover:scale-110 transition" />
          </Button>
        </div>
      );
    },
  },
];

function AlertDialogDeleteBranch({
  branchDelete,
  setBranchDelete,
}: {
  branchDelete: BranchItem | null;
  setBranchDelete: (value: BranchItem | null) => void;
}) {
  const deleteBranch = useDeleteBranchMutation();
  const handleDelete = () => {
    try {
      if (branchDelete) {
        deleteBranch.mutateAsync(branchDelete.id, {
          onSuccess: () => {
            setBranchDelete(null);
          },
        });
        toast.success("Xóa chi nhánh thành công");
      }
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <AlertDialog
      open={Boolean(branchDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setBranchDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa chi nhánh?</AlertDialogTitle>
          <AlertDialogDescription>
            Chi nhánh{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {branchDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const PAGE_SIZE = 10;
export default function BranchTable() {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const branchListQuery = useGetBranchList();
  const data: BranchSchemaType[] = branchListQuery.data?.payload.data ?? [];

  const [branchIdEdit, setBranchIdEdit] = useState<number | undefined>();
  const [branchDelete, setBranchDelete] = useState<BranchItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  return (
    <BranchTableContext.Provider
      value={{
        branchIdEdit,
        setBranchIdEdit,
        branchDelete,
        setBranchDelete,
      }}
    >
      <div className="w-full">
        <EditBranch
          id={branchIdEdit}
          setId={setBranchIdEdit}
          onSubmitSuccess={() => {}}
        />
        <AlertDialogDeleteBranch
          branchDelete={branchDelete}
          setBranchDelete={setBranchDelete}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc tên chi nhánh..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddBranch />
          </div>
        </div>
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
                              header.getContext(),
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
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị{" "}
            <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
            <strong>{data.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/branches"
            />
          </div>
        </div>
      </div>
    </BranchTableContext.Provider>
  );
}
