import fs from "fs";
import pinyinPkg from "pinyin";

const pinyin = pinyinPkg.default || pinyinPkg;

const overrides = {
  增长: "zēng zhǎng",
  对应: "duì yìng",
  良率: "liáng lǜ",
  只是: "zhǐ shì",
  为: "wèi",
  供应链: "gōng yìng liàn",
  供应: "gōng yìng",
  要求: "yāo qiú",
  应用层: "yìng yòng céng",
  只: "zhǐ",
  毛利率: "máo lì lǜ",
  产能利用率: "chǎn néng lì yòng lǜ",
  差别: "chā bié",
  费率: "fèi lǜ",
  渗透率: "shèn tòu lǜ",
  差错率: "chā cuò lǜ",
  效率: "xiào lǜ",
  供应商: "gōng yìng shāng",
  差异化: "chā yì huà",
  差: "chā",
  还: "hái",
  留得下: "liú de xià",
  重算: "chóng suàn",
  还是: "hái shì",
  小马智行: "xiǎo mǎ zhì xíng",
  都: "dōu",
  得: "de",
  得很: "de hěn",
  双供应商: "shuāng gōng yìng shāng",
  意味着: "yì wèi zhe",
  市占率: "shì zhàn lǜ",
  跟着: "gēn zhe",
  看得到: "kàn de dào",
  量产: "liàng chǎn",
  杠杆: "gàng gǎn",
  进行: "jìn xíng",
  尽管: "jǐn guǎn",
  只有: "zhǐ yǒu",
  只要: "zhǐ yào",
  什么: "shén me",
  谁: "shéi",
};

function pyOf(word) {
  if (overrides[word]) return overrides[word];
  return pinyin(word, { style: pinyin.STYLE_TONE, heteronym: false })
    .flat()
    .join(" ");
}

const usage = {
  商业化: {
    usage:
      "Moving from a demo or pilot into repeatable paying use. Listen for who owns the budget, and whether the step can be checked.",
    cols: ["商业化落地", "商业化路径", "加速商业化"],
    related: ["落地", "试点", "续约"],
  },
  融资: {
    usage: "Raising a round. In memos it is a timing question: what has to be true before the next check is written.",
    cols: ["下一轮融资", "融资条款", "融资前提"],
    related: ["估值", "条款", "里程碑"],
  },
  估值: {
    usage: "What the round or the market is willing to pay. The anchor can be a story, cash flow, or a renewal — name which one.",
    cols: ["估值体系", "估值锚", "估值折价"],
    related: ["现金流", "续约", "折价"],
  },
  产业链: {
    usage: "The linked steps from upstream supply to the finished product. Profit does not sit evenly along it.",
    cols: ["产业链上游", "产业链风险"],
    related: ["供应链", "上游"],
  },
  渗透率: {
    usage: "How far a product has spread into its addressable use. A high rate means the story has to shift from increment to efficiency.",
    cols: ["渗透率提升", "渗透率已经不低"],
    related: ["集中度", "复购"],
  },
  降本增效: {
    usage: "Cut cost and raise efficiency. In a term sheet it only counts if the indicator can be audited, not if it is a slogan.",
    cols: ["降本增效指标", "可核验的降本增效"],
    related: ["可核验", "成本", "效率"],
  },
  出海: {
    usage: "Taking the business overseas. Treat it as an operating ledger — certification, cash, localization — not as publicity.",
    cols: ["出海曲线", "品牌出海", "出海订单"],
    related: ["本地化", "关税", "回款"],
  },
  国产替代: {
    usage: "A real purchasing direction toward domestic suppliers. It is not a completed fact, and it is not one profit curve across every step.",
    cols: ["国产替代节奏", "关键工序国产替代"],
    related: ["验证周期", "双供应商", "市占率"],
  },
  竞争格局: {
    usage: "Who is actually competing, and how stable that is. A steadier pattern is often what lets profit be discussed at all.",
    cols: ["竞争格局稳定", "格局分散"],
    related: ["价格战", "集中度"],
  },
  供应链: {
    usage: "The chain that has to deliver parts, not the story about them. Equipment, materials, and components can be different ledgers.",
    cols: ["供应链风险", "本地供应链"],
    related: ["交付", "验收", "国产替代"],
  },
  算力: {
    usage: "Computing capacity, usually GPUs and clusters. Demand can stay high while the bill, and the capex line, still moves.",
    cols: ["算力需求", "算力账单", "算力投入"],
    related: ["资本开支", "推理成本", "集群"],
  },
  大模型: {
    usage: "Foundation models. The investor question has moved from parameter count to unit economics and gross margin.",
    cols: ["大模型公司", "大模型价格战"],
    related: ["推理成本", "单位经济", "毛利率"],
  },
  资本开支: {
    usage: "Capex. Ask where it sits — training, inference, packaging, a new plant — and whether it lands before revenue.",
    cols: ["资本开支前置", "资本开支节奏"],
    related: ["现金流", "产能利用率", "验收"],
  },
  盈利能力: {
    usage: "The ability to turn the business into profit, not a single quarter’s headline. Delivery growth is weaker evidence than a margin that holds.",
    cols: ["盈利能力证明", "盈利能力后移"],
    related: ["毛利率", "现金流"],
  },
  现金流: {
    usage: "Cash in and out. Orders, stories, and even revenue recognition can look fine while cash is still tight.",
    cols: ["现金流转正", "现金流压力", "经营现金流"],
    related: ["回款", "融资", "订单"],
  },
  毛利率: {
    usage: "Gross margin. It is the check on price wars, mix, tariffs, and whether a cheaper token actually became profit.",
    cols: ["毛利率修复", "毛利率站稳", "综合毛利率"],
    related: ["价格战", "盈利能力", "客单价"],
  },
  市占率: {
    usage: "Market share. Before yield is stable, or while a second supplier remains, the number explains little.",
    cols: ["市占率提升"],
    related: ["良率", "竞争格局"],
  },
  订单: {
    usage: "A booked order. It is not revenue, not cash, and not acceptance.",
    cols: ["订单可见度", "在手订单", "试点订单"],
    related: ["回款", "收入确认", "验收"],
  },
  回款: {
    usage: "Cash actually collected. This is the valuation anchor when orders look large and terms are strict.",
    cols: ["回款周期", "回款快于渗透"],
    related: ["现金流", "订单", "收入确认"],
  },
  交付: {
    usage: "Delivery. In a careful memo the milestone is acceptance, not shipment.",
    cols: ["交付节点", "交付里程碑", "批量交付"],
    related: ["验收", "发货", "里程碑"],
  },
  条款: {
    usage: "The terms. Regulation, milestones, and control rights belong here, not in the background paragraph.",
    cols: ["条款草稿", "融资条款"],
    related: ["里程碑", "对赌", "控制权"],
  },
  对赌: {
    usage: "A ratchet or earn-out tied to a target. It has not vanished; in some rounds it has moved from growth to delivery.",
    cols: ["增长对赌", "交付对赌"],
    related: ["里程碑", "估值", "交付"],
  },
  里程碑: {
    usage: "A dated, checkable step in the terms. Weak ones name a demo. Strong ones name a paid use, a yield, or an acceptance.",
    cols: ["商业化里程碑", "交付里程碑"],
    related: ["条款", "试点", "验收"],
  },
  落地: {
    usage: "Deployment into real use. It is not another demo; it is a department that will pay.",
    cols: ["商业化落地", "落地节奏"],
    related: ["商业化", "试点", "付费"],
  },
  试点: {
    usage: "A pilot. Customers will often pay for one and still refuse a long-term order. It is not, by itself, commercialization.",
    cols: ["付费试点", "试点费用", "试点订单"],
    related: ["续约", "商业化", "订单"],
  },
  续约: {
    usage: "Renewal. Investors in this edition treat it as the evidence that commercialization happened.",
    cols: ["续约率", "订单续约"],
    related: ["商业化", "订阅", "回款"],
  },
  客单价: {
    usage: "Average order value. If it depends on promotion, or fails to rise, fulfillment cost can eat the gross profit.",
    cols: ["客单价提升", "客单价依靠促销"],
    related: ["毛利率", "履约", "促销"],
  },
  获客成本: {
    usage: "What it costs to acquire a customer. A lower number is not automatically healthy unit economics.",
    cols: ["获客成本下降"],
    related: ["单位经济", "补贴", "复购"],
  },
  贡献利润: {
    usage: "Contribution profit, after the direct costs the company chooses to include. Always ask how it is calculated.",
    cols: ["贡献利润口径", "贡献利润转正"],
    related: ["补贴", "单位经济", "毛利"],
  },
  单位经济: {
    usage: "Unit economics: what one order, one customer, or one token actually earns after its direct costs.",
    cols: ["单位经济模型", "健康的单位经济"],
    related: ["获客成本", "回款", "毛利率"],
  },
  产能利用率: {
    usage: "How much of installed capacity is actually used. Without yield, the figure does not mean much.",
    cols: ["产能利用率偏低"],
    related: ["良率", "资本开支", "订单"],
  },
  指引: {
    usage: "Guidance management gives for the next period. A cut often follows customers deferring capex. User-only guidance is a weak call.",
    cols: ["业绩指引", "增长指引", "指引下调"],
    related: ["资本开支", "利润"],
  },
  备案: {
    usage: "A regulatory filing. For generative AI it is showing up in legal opinions before launch, and it can move a commercialization date.",
    cols: ["生成式人工智能备案", "备案进度"],
    related: ["合规", "监管", "里程碑"],
  },
  合规: {
    usage: "Compliance as a cost and a capability. It is often off the fee schedule, and it can still change the valuation discount.",
    cols: ["数据合规", "合规成本", "合规能力"],
    related: ["监管", "备案", "折价"],
  },
  监管: {
    usage: "Regulation as an operating variable. In a careful memo it is a term, not background color, and fines are not assumed to be one-off.",
    cols: ["监管环境", "常态化监管"],
    related: ["合规", "条款", "罚款"],
  },
  数据跨境: {
    usage: "Moving data across the border. If there is no path, overseas revenue recognition can slip.",
    cols: ["数据跨境路径", "数据跨境合规"],
    related: ["合规", "收入确认", "出海"],
  },
  本地化: {
    usage: "The cost of making the product work in a local market: certification, service, data rules, assembly. Not the launch event.",
    cols: ["本地化成本", "本地化账本"],
    related: ["出海", "认证", "关税"],
  },
  关税: {
    usage: "A tariff. It hits gross margin directly. Promotions do not reliably earn it back.",
    cols: ["关税上升", "关税成本"],
    related: ["毛利率", "出海", "组装"],
  },
  渠道: {
    usage: "The route to the customer. Opening more doors is not the same as keeping the profit, and deposits often precede revenue.",
    cols: ["渠道押金", "渠道控制权", "渠道密度"],
    related: ["复购", "集中度", "控制权"],
  },
  良率: {
    usage: "Yield: the share of output that meets spec. It is what a small batch starts to test, and what makes utilization meaningful.",
    cols: ["良率稳定", "良率爬坡"],
    related: ["小批量", "验收", "产能利用率"],
  },
  推理成本: {
    usage: "What it costs to run the model for a user, not to train it. A decline is a cost fact, not yet a profit fact.",
    cols: ["推理成本下降", "推理账单"],
    related: ["算力", "毛利率", "单位经济"],
  },
  订阅: {
    usage: "A recurring seat or license fee. Margins can look better than outcome pricing, while renewals get harder.",
    cols: ["席位订阅", "订阅模式"],
    related: ["续约", "结果付费", "毛利率"],
  },
  结果付费: {
    usage: "Paying for a checked outcome rather than a seat or a feature list. It moves risk from the customer to the vendor.",
    cols: ["按结果付费", "结果付费合同"],
    related: ["差错率", "回款", "收入确认"],
  },
  应用层: {
    usage: "The application layer above the model. This is where price wars show up, and where compliance can become a valuation discount.",
    cols: ["应用层公司", "应用层价格"],
    related: ["大模型", "商业化", "估值"],
  },
  智能体: {
    usage: "An agent: software that takes a workflow, not only a chat answer. The question is whether it has entered a budget.",
    cols: ["智能体创业", "企业智能体"],
    related: ["商业化", "落地", "预算"],
  },
  价格战: {
    usage: "A price war. It is not one contest: scale-and-cost is different from mix-and-options. Margin is the test, not the nickname.",
    cols: ["价格战强度", "价格战第二年"],
    related: ["毛利率", "内卷", "竞争格局"],
  },
  补贴: {
    usage: "A subsidy used to buy growth. When it recedes, unit economics and contribution profit have to stand on their own.",
    cols: ["补贴退潮", "补贴让利"],
    related: ["贡献利润", "单位经济", "获客成本"],
  },
  集中度: {
    usage: "How concentrated a market or a brand position is. After channels are opened, concentration decides who keeps the profit.",
    cols: ["品牌集中度", "行业集中度"],
    related: ["渠道", "竞争格局", "复购"],
  },
  下沉市场: {
    usage: "Lower-tier cities and counties. Growth can still be there after acquisition has stopped being cheap.",
    cols: ["下沉市场增长", "下沉渠道"],
    related: ["获客成本", "渗透率", "集中度"],
  },
  并购: {
    usage: "Buying a company or a channel. In fragmented categories it can be more common than organic growth. Approval time belongs on the timetable.",
    cols: ["并购整合", "产业并购"],
    related: ["控制权", "退出", "现金流"],
  },
  退出: {
    usage: "The path to liquidity: a listing, a sale, or time reserved for either. Slippage in acceptance or approval consumes that time.",
    cols: ["退出路径", "退出时间", "退出讨论"],
    related: ["港股", "并购", "现金流"],
  },
  港股: {
    usage: "A Hong Kong listing, often written next to M&A as two exit routes on the same page.",
    cols: ["港股上市", "港股退出"],
    related: ["退出", "并购"],
  },
  控制权: {
    usage: "Who controls the company, the channel, or the technology. A control premium is hard to argue without cash flow.",
    cols: ["控制权溢价", "控制权交易", "渠道控制权"],
    related: ["并购", "溢价", "条款"],
  },
  杠杆: {
    usage: "Leverage. More of it is not the same thing as more demand. Separate the loan from work that has actually started.",
    cols: ["加杠杆", "杠杆率"],
    related: ["中长期贷款", "现金流"],
  },
  先进封装: {
    usage: "Advanced packaging in the compute chain. Capex can crowd here even when training-cluster construction slows.",
    cols: ["先进封装产能", "先进封装溢价"],
    related: ["资本开支", "良率", "溢价"],
  },
  收入确认: {
    usage: "When revenue is allowed to be booked. Delayed acceptance pushes it back. A large order can still have strict conditions.",
    cols: ["收入确认条件", "收入确认时点"],
    related: ["验收", "订单", "回款"],
  },
  验收: {
    usage: "The customer’s acceptance. It is the milestone that counts. Shipment, a pilot order, and domestic substitution do not replace it.",
    cols: ["验收节点", "延期验收", "设备验收"],
    related: ["交付", "收入确认", "里程碑"],
  },
  复购: {
    usage: "Repeat purchase. Investors who used to pay for penetration are more willing to pay for this.",
    cols: ["复购率", "两个季度的复购"],
    related: ["渗透率", "客单价", "品牌"],
  },
  即时零售: {
    usage: "Delivery retail on a short clock. Orders can grow while cost per order is the number that matters.",
    cols: ["即时零售订单", "即时零售履约"],
    related: ["单均成本", "履约", "补贴"],
  },
  单均成本: {
    usage: "Cost per order, read at the decimal. It is the page-one question once subsidies recede.",
    cols: ["单均履约成本"],
    related: ["即时零售", "单位经济", "客单价"],
  },
  助贷: {
    usage: "Loan facilitation: matching or servicing credit without necessarily holding all of it. Scale alone does not protect gross margin when fees fall.",
    cols: ["助贷费率", "助贷公司"],
    related: ["费率", "合规", "风险定价"],
  },
  费率: {
    usage: "The fee rate. It can fall for quarters while compliance cost does not.",
    cols: ["费率下降", "费率表"],
    related: ["助贷", "合规", "毛利率"],
  },
  风险定价: {
    usage: "Pricing the risk, not just narrating penetration. A lower fee is a pricing outcome, not proof that demand vanished.",
    cols: ["风险定价能力"],
    related: ["费率", "合规", "渗透率"],
  },
  资本金: {
    usage: "Capital the business must hold. It is part of compliance cost and it does not appear on the fee schedule.",
    cols: ["资本金约束"],
    related: ["合规", "杠杆"],
  },
  牌照: {
    usage: "A license. Together with localization, it sets the speed of a cross-border payments or credit business.",
    cols: ["支付牌照", "本地牌照"],
    related: ["出海", "合规", "本地化"],
  },
  内卷: {
    usage: "Involution: the colloquial name for a price war that destroys margins. It is a nickname. The test is still whether gross margin holds.",
    cols: ["行业内卷", "价格战内卷"],
    related: ["价格战", "毛利率"],
  },
  验证周期: {
    usage: "The qualification cycle before a supplier is approved on a real line. Policy direction does not date it.",
    cols: ["客户验证周期"],
    related: ["国产替代", "验收", "试点"],
  },
  批量交付: {
    usage: "Delivery at volume. Profitability is something you see after this, not by extrapolating a pilot order.",
    cols: ["批量交付能力"],
    related: ["试点", "盈利能力", "良率"],
  },
  关键工序: {
    usage: "A critical process step. Customers often keep a second supplier here, which slows share gains.",
    cols: ["关键工序替代"],
    related: ["双供应商", "国产替代"],
  },
  双供应商: {
    usage: "Two qualified suppliers on one step. It is why share can move slowly even when the direction is real.",
    cols: ["保留双供应商"],
    related: ["关键工序", "市占率"],
  },
  中长期贷款: {
    usage: "Medium- and long-term loans. Separate them from projects that have actually started.",
    cols: ["中长期贷款投放"],
    related: ["杠杆", "开工", "资本开支"],
  },
  样机: {
    usage: "A prototype. It can raise money. It does not test yield the way a small batch does.",
    cols: ["样机阶段"],
    related: ["小批量", "量产", "融资"],
  },
  小批量: {
    usage: "A small production batch. This is where yield starts to be real.",
    cols: ["小批量试产"],
    related: ["样机", "良率", "量产"],
  },
  更新周期: {
    usage: "The replacement cycle of installed equipment. For the next two years it can matter more than new-plant news.",
    cols: ["设备更新周期"],
    related: ["资本开支", "订单"],
  },
  溢价: {
    usage: "A premium a customer or a buyer will actually pay. Do not assume it inside the model.",
    cols: ["包装溢价", "控制权溢价"],
    related: ["毛利率", "控制权", "估值"],
  },
  法律意见书: {
    usage: "The legal opinion on a financing. Data compliance is starting to get its own section, rather than living in an appendix.",
    cols: ["融资法律意见书"],
    related: ["备案", "合规", "融资"],
  },
};

const raw = fs.readFileSync(new URL("./glosses.tsv", import.meta.url), "utf8");
const glosses = new Map();
for (const line of raw.split("\n")) {
  if (!line.trim() || line.startsWith("#")) continue;
  const [zh, en, pos, kind, cat, domain, diff] = line.split("\t");
  if (!zh || !en) throw new Error("Bad gloss line: " + line);
  glosses.set(zh, { en, pos, kind, cat, domain, diff });
}

const dir = new URL("../lib/data/articles/", import.meta.url);
const tokens = new Set();
const punct = new Set("，。、：；？！（）—…·".split(""));
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  const text = fs.readFileSync(new URL(f, dir), "utf8");
  const re = /s\(\s*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')\s*,\s*"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = re.exec(text))) {
    for (const p of m[1].split(/\s+/).filter(Boolean)) {
      if ([...p].every((ch) => punct.has(ch))) continue;
      tokens.add(p);
    }
  }
}

const missing = [...tokens].filter((t) => !glosses.has(t));
if (missing.length) {
  console.error("MISSING GLOSSES\n" + missing.join("\n"));
  process.exit(1);
}

const extra = [...glosses.keys()].filter((t) => !tokens.has(t));
if (extra.length) {
  console.error("UNUSED GLOSSES\n" + extra.join("\n"));
  process.exit(1);
}

const entries = [...tokens].map((zh) => {
  const g = glosses.get(zh);
  const note = usage[zh];
  return {
    id: zh,
    chinese: zh,
    pinyin: pyOf(zh),
    english: g.en,
    pos: g.pos,
    difficulty: g.diff,
    category: g.cat,
    domain: g.domain,
    kind: g.kind,
    ...(note?.usage ? { businessUsage: note.usage } : {}),
    ...(note?.cols ? { collocations: note.cols } : {}),
    ...(note?.related ? { related: note.related } : {}),
  };
});

const out = `import type { Lexeme } from "@/lib/types";

/** Generated by scripts/build-lexicon.mjs. Edit glosses.tsv, then rebuild. */
export const lexemes: Lexeme[] = ${JSON.stringify(entries, null, 2)};

export const lexemeById = new Map(lexemes.map((l) => [l.id, l]));
`;

fs.writeFileSync(new URL("../lib/data/lexicon.ts", import.meta.url), out);
console.log("Wrote", entries.length, "lexemes");
