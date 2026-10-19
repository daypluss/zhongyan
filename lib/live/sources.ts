export type LiveSource = {
  id: string;
  name: string;
  feed: string;
  home: string;
  kind: "rss" | "yicai" | "podcast";
  fallback: "ai" | "internet" | "macro";
};

/** Public feed addresses. The relay URL is not here; it lives in Settings. */
export const LIVE_SOURCES: LiveSource[] = [
  {
    id: "36kr",
    name: "36氪",
    feed: "https://www.36kr.com/feed",
    home: "https://www.36kr.com",
    kind: "rss",
    fallback: "ai",
  },
  {
    id: "tmtpost",
    name: "钛媒体",
    feed: "https://www.tmtpost.com/rss.xml",
    home: "https://www.tmtpost.com",
    kind: "rss",
    fallback: "internet",
  },
  {
    id: "zhidx",
    name: "智东西",
    feed: "https://www.zhidx.com/rss",
    home: "https://www.zhidx.com",
    kind: "rss",
    fallback: "ai",
  },
  {
    id: "199it",
    name: "199IT",
    feed: "https://www.199it.com/feed",
    home: "https://www.199it.com",
    kind: "rss",
    fallback: "internet",
  },
  {
    id: "yicai",
    name: "第一财经",
    feed: "https://www.yicai.com/api/ajax/getlatest?page=1&pagesize=30",
    home: "https://www.yicai.com",
    kind: "yicai",
    fallback: "macro",
  },
  {
    id: "luanfanshu",
    name: "乱翻书",
    feed: "https://feed.xyzfm.space/yxuruh3f9mc4",
    home: "https://www.xiaoyuzhoufm.com",
    kind: "podcast",
    fallback: "internet",
  },
];

export function sourceById(id: string) {
  return LIVE_SOURCES.find((source) => source.id === id);
}
