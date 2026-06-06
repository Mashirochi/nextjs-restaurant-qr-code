"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useGetReviewList, useDeleteReviewMutation, useGetReviewReasons } from "@/lib/query/useReview";
import { formatCurrency, handleErrorApi, cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Star, Trash2, Plus, RefreshCcw, MessageSquare, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import ReviewDialog from "@/components/review/review-dialog";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AutoPagination from "@/components/custom/auto.pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function ReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const take = searchParams.get("take") ? Number(searchParams.get("take")) : 10;
  const ratingStars = searchParams.get("ratingStars") ? Number(searchParams.get("ratingStars")) : undefined;
  const reasons = searchParams.get("reasons") || undefined;
  const selectedReasons = reasons ? reasons.split(",") : [];

  const { data, isPending, refetch } = useGetReviewList({
    page,
    take,
    ratingStars,
    reasons,
  });
  const { data: reasonsResponse } = useGetReviewReasons({ ratingStars });
  const reasonsMap = reasonsResponse?.payload?.data ?? {};
  
  const deleteReviewMutation = useDeleteReviewMutation();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openReasonFilter, setOpenReasonFilter] = useState(false);

  const reviews = data?.payload?.data ?? [];
  const pagination = data?.payload?.pagination;
  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.take)) : 1;

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteReviewMutation.mutateAsync(deleteId);
      toast.success("Xóa đánh giá thành công!");
      setDeleteId(null);
      refetch();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${
              s <= count ? "fill-amber-400 text-amber-400" : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Đánh giá từ khách hàng</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý và xem phản hồi từ khách hàng về chất lượng dịch vụ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isPending}
            className="gap-1 h-9"
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button
            size="sm"
            onClick={() => setReviewOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-1 h-9"
          >
            <Plus className="h-4 w-4" />
            Thêm đánh giá
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 py-4">
        <div className="flex flex-wrap gap-2">
  {[5, 4, 3, 2, 1].map((star) => (
    <Badge
      key={star}
      variant={ratingStars === star ? "default" : "outline"}
      className="cursor-pointer px-3 py-1"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("ratingStars", star.toString());
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }}
    >
      <div className="flex items-center gap-1">
        <span>{star}</span>
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      </div>
    </Badge>
  ))}
</div>

        <Popover open={openReasonFilter} onOpenChange={setOpenReasonFilter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openReasonFilter}
              className="w-[250px] text-sm justify-between"
            >
              <span className="truncate">
                {selectedReasons.length > 0 ? selectedReasons.join(", ") : "Lọc theo lý do"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Tìm lý do..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy lý do.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    key="all"
                    value="all-reasons"
                    onSelect={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("reasons");
                      params.set("page", "1");
                      router.push(`${pathname}?${params.toString()}`, { scroll: false });
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedReasons.length === 0 ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Tất cả lý do
                  </CommandItem>
                  {Object.entries(reasonsMap).map(([reason, count]) => (
                    <CommandItem
                      key={reason}
                      value={reason}
                      onSelect={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        let nextReasons: string[];
                        if (selectedReasons.includes(reason)) {
                          nextReasons = selectedReasons.filter((r) => r !== reason);
                        } else {
                          nextReasons = [...selectedReasons, reason];
                        }
                        if (nextReasons.length === 0) {
                          params.delete("reasons");
                        } else {
                          params.set("reasons", nextReasons.join(","));
                        }
                        params.set("page", "1");
                        router.push(`${pathname}?${params.toString()}`, { scroll: false });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedReasons.includes(reason) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {reason} ({count})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle>Danh sách đánh giá</CardTitle>
          <CardDescription>
            Hiển thị tất cả đánh giá.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[120px]">Số điện thoại</TableHead>
                  <TableHead className="w-[120px]">Khách hàng ID</TableHead>
                  <TableHead className="w-[140px]">Điểm đánh giá</TableHead>
                  <TableHead className="w-[200px]">Lý do</TableHead>
                  <TableHead>Nội dung phản hồi</TableHead>
                  <TableHead className="w-[160px]">Thời gian</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Chưa có đánh giá nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-mono text-xs">{review.id}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {review.phoneNumber || <span className="text-muted-foreground/60">—</span>}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {review.customerId ? `#${review.customerId}` : <span className="text-muted-foreground/60">—</span>}
                      </TableCell>
                      <TableCell>{renderStars(review.ratingStars)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(review.arrayReasons) &&
                            review.arrayReasons.map((reason, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                {reason}
                              </Badge>
                            ))}
                          {(!Array.isArray(review.arrayReasons) || review.arrayReasons.length === 0) && (
                            <span className="text-muted-foreground/60 text-xs">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(review.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Xóa đánh giá"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {!isPending && pagination && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-xs text-muted-foreground py-4 flex-1">
                Hiển thị <strong>{reviews.length}</strong> trong <strong>{pagination.total}</strong> kết quả
              </div>
              <div>
                <AutoPagination
                  page={page}
                  pageSize={totalPages}
                  pathname={pathname}
                  isLink={false}
                  onClick={(pageNumber) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", pageNumber.toString());
                    router.push(`${pathname}?${params.toString()}`);
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xóa đánh giá này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đánh giá này sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Review Dialog */}
      <ReviewDialog open={reviewOpen} onOpenChange={setReviewOpen} />
    </main>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense>
      <ReviewsContent />
    </Suspense>
  );
}
