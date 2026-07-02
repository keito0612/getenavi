"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signIn } from "@/hooks/useAuth";
import { Modal, FormField } from "@/components/ui";
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="email"
          label="メールアドレス"
          type="email"
          placeholder="example@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          id="password"
          label="パスワード"
          type="password"
          placeholder="8文字以上"
          error={errors.password?.message}
          {...register("password")}
        />

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
