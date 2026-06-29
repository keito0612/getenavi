"use client";

// Next.js 16 requires this file for proper error handling
// This component replaces the root layout when a critical error occurs
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>エラー - ゲテナビ</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "1rem",
            }}
          >
            エラーが発生しました
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            申し訳ございません。予期せぬエラーが発生しました。
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#d97706",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            もう一度試す
          </button>
        </div>
      </body>
    </html>
  );
}
