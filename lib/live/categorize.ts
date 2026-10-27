import type { CategoryId } from "@/lib/types";
import type { LiveSource } from "@/lib/live/sources";

const RULES: { id: CategoryId; words: string[] }[] = [
  { id: "semiconductors", words: ["芯片", "半导体", "光刻", "晶圆", "封装", "存储芯片", "光刻机"] },
  { id: "robotics", words: ["机器人", "人形", "具身", "机械臂"] },
  { id: "ev", words: ["新能源", "电动车", "电动汽车", "智驾", "动力电池", "汽车"] },
  { id: "ai", words: ["人工智能", "大模型", "智能体", "生成式", "AI", "算力", "机器学习"] },
  { id: "vc", words: ["融资", "估值", "创投", "风险投资", "基金", "IPO", "上市", "并购"] },
  { id: "policy", words: ["监管", "备案", "网信", "合规", "国务院", "央行", "处罚", "牌照"] },
  { id: "outbound", words: ["出海", "海外", "关税", "东南亚", "跨境"] },
  { id: "consumer", words: ["消费", "品牌", "零售", "电商", "客单价"] },
  { id: "macro", words: ["宏观", "GDP", "利率", "制造业", "出口", "银行", "净利润", "通胀"] },
  { id: "internet", words: ["互联网", "平台", "软件", "SaaS", "字节", "美团", "阿里"] },
];

export function categorize(title: string, excerpt: string, source: LiveSource): CategoryId {
  const blob = `${title} ${excerpt}`;
  for (const rule of RULES) {
    if (rule.words.some((word) => blob.includes(word))) return rule.id;
  }
  return source.fallback;
}
