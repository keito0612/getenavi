"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CloseIcon } from "@/components/ui";
import { authFetch } from "@/lib/authFetch";
import type { ProfileData } from "@/lib/types";

const profileEditSchema = z.object({
  comment: z.string().max(300, { message: "自己紹介は300文字以内で入力してください" }).optional(),
  backgroundImage: z.string().optional(),
  avatarImage: z.string().optional(),
});

type ProfileEditInput = z.infer<typeof profileEditSchema>;

// 空文字列をnullに変換
function transformEmptyToNull(data: ProfileEditInput) {
  return {
    comment: data.comment || null,
    backgroundImage: data.backgroundImage || null,
    avatarImage: data.avatarImage || null,
  };
}

type Props = {
  profile: ProfileData | null;
  onClose: () => void;
  onComplete: (profile: ProfileData) => void;
};

export function ProfileEditModal({ profile, onClose, onComplete }: Props) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditInput>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      comment: profile?.comment || "",
      backgroundImage: profile?.backgroundImage || "",
      avatarImage: profile?.avatarImage || "",
    },
  });

  const onSubmit = async (data: ProfileEditInput) => {
    setServerError("");

    try {
      const res = await authFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(transformEmptyToNull(data)),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "プロフィールの更新に失敗しました");
      }

      const { profile: updatedProfile } = await res.json();
      onComplete(updatedProfile);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "プロフィールの更新に失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4 bg-gray-900 rounded-xl overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">プロフィール編集</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {serverError && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
              自己紹介
            </label>
            <textarea
              id="comment"
              rows={3}
              {...register("comment")}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="自己紹介を入力してください"
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-400">{errors.comment.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatarImage" className="block text-sm font-medium text-gray-300 mb-1">
              アバター画像URL
            </label>
            <input
              id="avatarImage"
              type="text"
              {...register("avatarImage")}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <label htmlFor="backgroundImage" className="block text-sm font-medium text-gray-300 mb-1">
              背景画像URL
            </label>
            <input
              id="backgroundImage"
              type="text"
              {...register("backgroundImage")}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/background.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
