"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/hooks/useAuth";
import { Modal } from "@/components/ui";
import type { ModalState } from "@/lib/types";
import type { FieldErrors } from "@/lib/errors";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setIsLoading(true);

    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
        setFieldErrors({ email: "メールアドレスまたはパスワードが正しくありません" });
      } else {
        setModal({
          isOpen: true,
          type: "error",
          title: "ログイン失敗",
          message: error.message || "ログインに失敗しました",
        });
      }
      setIsLoading(false);
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

  const inputClassName = (field: string) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
      fieldErrors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={inputClassName("password")}
            placeholder="8文字以上"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "ログイン中..." : "ログイン"}
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
