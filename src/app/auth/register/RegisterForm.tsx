"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/hooks/useAuth";
import { Modal } from "@/components/ui";
import type { ModalState } from "@/lib/types";
import type { FieldErrors } from "@/lib/errors";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const router = useRouter();

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "パスワードが一致しません" });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      if (error.code === "USER_ALREADY_EXISTS") {
        setFieldErrors({ email: "このメールアドレスは既に登録されています" });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "登録失敗",
          message: error.message || "登録に失敗しました",
        });
      }
      setIsLoading(false);
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

  const inputClassName = (field: string) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
      fieldErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            お名前
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError("name");
            }}
            required
            className={inputClassName("name")}
            placeholder="山田 太郎"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            required
            className={inputClassName("email")}
            placeholder="example@email.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            required
            minLength={8}
            className={inputClassName("password")}
            placeholder="8文字以上"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード（確認）
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirmPassword");
            }}
            required
            minLength={8}
            className={inputClassName("confirmPassword")}
            placeholder="もう一度入力"
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "登録中..." : "登録する"}
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
