"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/passwordReset";
import { FormField } from "@/components/ui";

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "リクエストに失敗しました");
      }

      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "リクエストに失敗しました");
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        <p className="font-medium">メールを送信しました</p>
        <p className="text-sm mt-1">
          メールアドレスが登録されている場合、パスワード再設定用のリンクをお送りしました。メールをご確認ください。
        </p>
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
        id="email"
        label="メールアドレス"
        type="email"
        placeholder="example@email.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "送信中..." : "リセットリンクを送信"}
      </button>
    </form>
  );
}
