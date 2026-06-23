"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signIn } from "@/hooks/useAuth";
import { Modal } from "@/components/ui";
import type { ModalState } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const { error } = await signIn.email(data);

    if (error) {
      if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
        setError("email", { message: "メールアドレスまたはパスワードが正しくありません" });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "ログイン失敗",
          message: error.message || "ログインに失敗しました",
        });
      }
      return;
    }

    setModal({
      isOpen: true,
      type: "success",
      title: "ログイン成功",
      message: "ログインしました",
    });
  };

  const handleModalClose = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (modal.type === "success") {
      router.push("/");
    }
  };

  const inputClassName = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={inputClassName(!!errors.email)}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={inputClassName(!!errors.password)}
            placeholder="8文字以上"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
      />
    </>
  );
}
