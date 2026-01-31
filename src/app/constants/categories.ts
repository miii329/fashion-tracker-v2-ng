export const CATEGORIES = [
  'すべて',
  'ファッション',
  'メイク',
  'アクセサリー',
  'カラコン',
  'その他',
] as const;

export type Category = typeof CATEGORIES[number];
