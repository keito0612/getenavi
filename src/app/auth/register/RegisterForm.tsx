"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { signUp } from "@/hooks/useAuth";
import { Modal, FormField } from "@/components/ui";
import type { ModalState } from "@/lib/types";

export function RegisterForm() {
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
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    const { error } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (error) {
      const isUserExists =
        error.code === "USER_ALREADY_EXISTS" ||
        error.message?.includes("User already exists");

      if (isUserExists) {
        setError("email", { message: "このメールアドレスは既に登録されています" });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "登録失敗",
          message: error.message || "登録に失敗しました",
        });
      }
      return;
    }

    setModal({
      isOpen: true,
      type: "success",
      title: "登録完了",
      message: "アカウントが作成されました",
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
          id="name"
          label="お名前"
          type="text"
          placeholder="山田 太郎"
          error={errors.name?.message}
          {...register("name")}
        />

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

        <FormField
          id="confirmPassword"
          label="パスワード（確認）"
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
          {isSubmitting ? "登録中..." : "登録する"}
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
