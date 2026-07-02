"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/profile";
import { frontendAuthService } from "@/services/frontend";
import { FormField } from "@/components/ui";

export function PasswordSection() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setServerError("");
    setSuccess("");

    try {
      await frontendAuthService.changePassword(data);
      setSuccess("パスワードを変更しました");
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "パスワードの変更に失敗しました");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">パスワード変更</h2>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {serverError}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          id="currentPassword"
          label="現在のパスワード"
          type="password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />

        <FormField
          id="newPassword"
          label="新しいパスワード"
          type="password"
          placeholder="8文字以上"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <FormField
          id="confirmPassword"
          label="新しいパスワード（確認）"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "変更中..." : "パスワードを変更"}
        </button>
      </form>
    </div>
  );
}
