"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNameSchema, type UpdateNameInput } from "@/lib/validations/profile";
import { frontendAuthService } from "@/services/frontend";
import type { UserData } from "@/lib/types";

type Props = {
  user: UserData;
  onUpdate: (user: UserData) => void;
};

export function ProfileSection({ user, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  });

  const onSubmit = async (data: UpdateNameInput) => {
    setServerError("");

    try {
      const updatedUser = await frontendAuthService.updateProfile(data);
      onUpdate(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "更新に失敗しました");
    }
  };

  const handleCancel = () => {
    reset({ name: user.name });
    setIsEditing(false);
    setServerError("");
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">プロフィール情報</h2>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {serverError}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              お名前
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">お名前</dt>
              <dd className="mt-1 text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">メールアドレス</dt>
              <dd className="mt-1 text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">登録日</dt>
              <dd className="mt-1 text-gray-900">{formatDate(user.createdAt)}</dd>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            編集する
          </button>
        </div>
      )}
    </div>
  );
}
