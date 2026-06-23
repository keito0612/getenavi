type Props = {
  userId: string;
};

export function PostsTab({ userId: _userId }: Props) {
  // TODO: ユーザーの投稿一覧を取得して表示
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-gray-500">投稿がありません</p>
    </div>
  );
}
