"use client";

import { useState, useEffect } from "react";
import type { User } from "better-auth";
import { authFetch } from "@/lib/authFetch";
import type { ProfileData } from "@/lib/types";
import { ProfileEditModal } from "./ProfileEditModal";

type Props = {
  user: User;
  reviewCount: number;
  likeCount: number;
  isOwner: boolean;
};

export function ProfileHeader({ user, reviewCount, likeCount, isOwner }: Props) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    authFetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
        }
      })
      .catch(() => {
        // プロフィールがまだない場合は無視
      });
  }, []);

  const handleEditComplete = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    setIsEditModalOpen(false);
  };

  return (
    <>
      {/* 背景画像エリア */}
      <div className="relative h-32 bg-gray-800">
        {profile?.backgroundImage ? (
          <img
            src={profile.backgroundImage}
            alt="背景画像"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CameraIcon className="w-8 h-8 text-gray-600" />
          </div>
        )}
      </div>

      {/* プロフィール情報 */}
      <div className="relative px-4 pb-4 bg-gray-900">
        {/* アバター */}
        <div className="absolute -top-10 left-4">
          <div className="w-20 h-20 rounded-full border-2 border-blue-500 bg-gray-800 flex items-center justify-center overflow-hidden">
            {profile?.avatarImage ? (
              <img
                src={profile.avatarImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-blue-500" />
            )}
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="pt-12">
          <h1 className="text-xl font-bold text-white">{user.name}</h1>

          {/* コメント */}
          {profile?.comment && (
            <p className="mt-1 text-sm text-gray-400">{profile.comment}</p>
          )}

          {/* 編集ボタン */}
          {isOwner && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-3 w-full py-2 border border-gray-600 rounded-full text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              編集
            </button>
          )}

          {/* 統計 */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <span>
              <span className="font-semibold text-white">{reviewCount}</span> レビュー
            </span>
            <span>
              <span className="font-semibold text-white">{likeCount}</span> いいね
            </span>
          </div>
        </div>
      </div>

      {/* 編集モーダル */}
      {isEditModalOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onComplete={handleEditComplete}
        />
      )}
    </>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}
