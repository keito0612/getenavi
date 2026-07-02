/**
 * 日付を相対時間文字列に変換
 * @param date - 変換する日付
 * @returns 相対時間文字列（例: "1日前", "3時間前"）
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return "たった今";
  } else if (diffMin < 60) {
    return `${diffMin}分前`;
  } else if (diffHour < 24) {
    return `${diffHour}時間前`;
  } else if (diffDay < 7) {
    return `${diffDay}日前`;
  } else if (diffWeek < 4) {
    return `${diffWeek}週間前`;
  } else if (diffMonth < 12) {
    return `${diffMonth}ヶ月前`;
  } else {
    return `${diffYear}年前`;
  }
}
