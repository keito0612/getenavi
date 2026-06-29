"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";

type Props = {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel?: string;
};

export function ReviewForm({
  initialRating = 0,
  initialComment = "",
  onSubmit,
  onCancel,
  submitLabel = "投稿する",
}: Props) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validate = (): boolean => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating < 1 || rating > 5) {
      newErrors.rating = "評価を選択してください";
    }

    if (!comment.trim()) {
      newErrors.comment = "コメントを入力してください";
    } else if (comment.length > 1000) {
      newErrors.comment = "コメントは1000文字以内で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const success = await onSubmit({ rating, comment });
    setIsSubmitting(false);

    if (success) {
      setRating(0);
      setComment("");
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評価
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          コメント
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          placeholder="お店の感想を書いてください..."
        />
        <div className="flex justify-between mt-1">
          {errors.comment ? (
            <p className="text-sm text-red-600">{errors.comment}</p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${comment.length > 1000 ? "text-red-600" : "text-gray-500"}`}>
            {comment.length}/1000
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "送信中..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
