"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Phone, X } from "lucide-react";
import { useCreateReviewMutation, useGetReviewReasons } from "@/lib/query/useReview";
import { toast } from "sonner";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "@/type/schema/jwt.type";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ratingTexts: Record<number, string> = {
  1: "Very disappointing",
  2: "Disappointing",
  3: "Average",
  4: "Good",
  5: "Great, excellent, wonderfull",
};

const satisfiedChips = [
  "Good food",
  "Friendly employee",
  "Good price",
  "Enthusiastic service",
  "Great space",
];

const dissatisfiedChips = [
  "Hygiene is not clean",
  "Staff is not enthusiastic",
  "The food is not good",
  "Long serving dishes",
  "Price does not match the quality",
  "Inconvenient space",
  "Noisy space",
];

export default function ReviewDialog({ open, onOpenChange }: ReviewDialogProps) {
  const [rating, setRating] = useState<number>(5);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const createReviewMutation = useCreateReviewMutation();
  const { data: reasonsData } = useGetReviewReasons({ ratingStars: rating });

  // Reset reasons when rating category shifts between positive (>=4) and negative (<=3)
  useEffect(() => {
    setSelectedReasons([]);
  }, [rating >= 4]);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    let customerId: number | undefined = undefined;
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        customerId = decoded.userId;
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }

    try {
      await createReviewMutation.mutateAsync({
        customerId,
        ratingStars: rating,
        arrayReasons: selectedReasons,
        comment,
        phoneNumber: phoneNumber || undefined,
      });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      // Reset form
      setRating(5);
      setSelectedReasons([]);
      setComment("");
      setPhoneNumber("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
    }
  };

  const isPositive = rating >= 4;
  const currentChips = isPositive ? satisfiedChips : dissatisfiedChips;
  const questionText = isPositive
    ? "What are you most satisfied with that can be shared?"
    : "Is there anything you are not satisfied with?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>
              <VisuallyHidden>Review dialog</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>
                This area allows customers to leave ratings and reviews for the restaurant.
              </VisuallyHidden>
            </DialogDescription>
      <DialogContent className="max-w-[420px] p-0 overflow-hidden rounded-2xl border-none bg-white dark:bg-slate-900 gap-0">
        {/* Close Button */}
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        <div className="p-6 pb-4 flex flex-col items-center">
          {/* Main Card with Cream/Light-Yellow Background */}
          <div className="w-full bg-[#fef9eb] dark:bg-slate-950/40 border border-amber-100/30 dark:border-amber-950/20 rounded-2xl p-5 flex flex-col items-center transition-all duration-300">
            <DialogHeader className="mb-3">
            <h3 className="text-gray-800 dark:text-slate-100 font-extrabold text-lg text-center leading-snug mb-3">
              How was your experience at the restaurant today?
            </h3>
            </DialogHeader>

            {/* Stars Row */}
            <div className="flex gap-2.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Star
                      className={`h-9 w-9 transition-colors duration-200 ${
                        isFilled
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "text-gray-300 dark:text-gray-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Rating Description */}
            <p className="text-amber-600 dark:text-amber-500 text-xs font-semibold mb-4 text-center">
              {ratingTexts[rating]}
            </p>

            <div className="w-full border-t border-amber-100/60 dark:border-slate-800/60 my-2" />

            {/* Chips Section */}
            <div className="w-full mt-2">
              <p className="text-gray-700 dark:text-slate-200 text-xs font-bold mb-3">
                {questionText}
              </p>

              <div className="flex flex-wrap gap-2 mb-4 justify-start">
                {currentChips.map((chip) => {
                  const isSelected = selectedReasons.includes(chip);
                  const counts = reasonsData?.payload.data || {};
                  const count = counts[chip] || 0;
                  const chipText = count > 0 ? `${chip} (${count})` : chip;
                  
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleReason(chip)}
                      className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 font-semibold shadow-sm"
                          : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {chipText}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="Write a review for the restaurant..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[90px] text-xs bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-xl focus-visible:ring-orange-500 resize-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Bottom Phone/Submit Section */}
        <div className="bg-gray-50/50 dark:bg-slate-950/20 p-6 pt-2 border-t border-gray-100 dark:border-slate-800/50">
          <p className="text-gray-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
            The restaurant really appreciates and wants to respond to your review,
            please leave your phone number
          </p>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 h-11 text-xs bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-xl focus-visible:ring-orange-500"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={createReviewMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-5 h-11 rounded-xl shrink-0 transition-colors shadow-sm"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit a review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
