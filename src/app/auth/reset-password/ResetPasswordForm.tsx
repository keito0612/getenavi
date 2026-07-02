"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { resetPasswordFormSchema, type ResetPasswordFormInput } from "@/lib/validations/passwordReset";
import { FormField } from "@/components/ui";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  if (!token) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        <p className="font-medium">無効なリンクです</p>
        <p className="text-sm mt-1">
          パスワード再設定リンクが無効または期限切れです。
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-3 text-orange-500 hover:underline text-sm"
        >
          再度リクエストする
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormInput) => {
    setServerError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "パスワードのリセットに失敗しました");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "パスワードのリセットに失敗しました");
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        <p className="font-medium">パスワードを変更しました</p>
        <p className="text-sm mt-1">ログインページにリダイレクトします...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <FormField
        id="password"
        label="新しいパスワード"
        type="password"
        placeholder="8文字以上"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormField
        id="confirmPassword"
        label="新しいパスワード（確認）"
        type="password"
        placeholder="もう一度入力"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "変更中..." : "パスワードを変更"}
      </button>
    </form>
  );
}
