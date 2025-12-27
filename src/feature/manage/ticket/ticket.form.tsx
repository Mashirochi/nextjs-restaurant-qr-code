"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  CreateTicketBody,
  CreateTicketBodyType,
} from "@/type/schema/ticket.schema";

export default function TicketForm({
  emailLabel,
  emailPlaceholder,
  contentLabel,
  contentPlaceholder,
  imageUploadLabel,
  submitLabel,
}: {
  emailLabel: string;
  emailPlaceholder: string;
  contentLabel: string;
  contentPlaceholder: string;
  imageUploadLabel: string;
  submitLabel: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTicketBodyType>({
    resolver: zodResolver(CreateTicketBody),
    defaultValues: {
      email: "",
      content: "",
      images: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + newFiles.length;

      if (totalFiles > 10) {
        toast.error("Bạn chỉ có thể tải lên tối đa 10 hình ảnh");
        return;
      }

      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: CreateTicketBodyType) => {
    try {
      // Simulate form submission with manual data
      const ticketData = {
        id: Date.now(), // temporary ID
        email: data.email,
        content: data.content,
        images: files.map((file) => URL.createObjectURL(file)), // temporary URLs
        date: new Date(),
        performedBy: "Admin", // placeholder
        notes: "Ghi chú mặc định", // placeholder
      };

      console.log("Ticket submitted:", ticketData);
      toast.success("Gửi vé thành công!");

      // Reset form
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Có lỗi xảy ra khi gửi vé");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label htmlFor="email">{emailLabel}</Label>
                <div className="col-span-3 w-full space-y-2">
                  <Input
                    id="email"
                    className="w-full"
                    placeholder={emailPlaceholder}
                    {...field}
                  />
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                <Label htmlFor="content">{contentLabel}</Label>
                <div className="col-span-3 w-full space-y-2">
                  <Textarea
                    id="content"
                    className="w-full min-h-[100px]"
                    placeholder={contentPlaceholder}
                    {...field}
                  />
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-4 items-start justify-items-start gap-4">
          <Label>{imageUploadLabel}</Label>
          <div className="col-span-3 w-full space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Chọn hình ảnh
              </Button>
              <span className="text-sm text-muted-foreground">
                {files.length}/10 hình ảnh
              </span>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
