"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/profile";
import { frontendAuthService } from "@/services/frontend";

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

  const inputClassName = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

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
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            現在のパスワード
          </label>
          <input
            id="currentPassword"
            type="password"
            {...register("currentPassword")}
            className={inputClassName(!!errors.currentPassword)}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード
          </label>
          <input
            id="newPassword"
            type="password"
            {...register("newPassword")}
            className={inputClassName(!!errors.newPassword)}
            placeholder="8文字以上"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            新しいパスワード（確認）
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={inputClassName(!!errors.confirmPassword)}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

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
