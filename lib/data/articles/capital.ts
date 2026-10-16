import type { ArticleDraft } from "@/lib/types";
import { q, s } from "@/lib/data/helpers";

export const capitalArticles: ArticleDraft[] = [
  {
    id: "vc-memo",
    titleCn: "应用层估值回落，基金开始重写人工智能备忘录",
    titleEn: "Application-layer valuations are resetting, and funds are rewriting their AI memos",
    sourceId: "chinaventure",
    publishedAt: "2026-10-16T07:10:00+08:00",
    category: "vc",
    subcategory: "Memos",
    tags: ["Valuation", "Terms", "Exit"],
    difficulty: "intermediate",
    readingMinutes: 8,
    summaryEn:
      "Last year’s anchor was growth and story. This year’s is cash flow, renewal, and a path that sits in the premise — not the appendix.",
    summaryCn: "估值锚从增长故事换成现金流和续约。商业化路径要写进投资前提，而不是附录。",
    whyItMatters:
      "Exit is being discussed earlier. A Hong Kong listing and a sale now sit on the same page — but neither rescues a company with no cash flow.",
    lingo: ["估值", "现金流", "续约", "商业化", "融资", "退出", "港股", "并购"],
    entityIds: [],
    relatedIds: ["ai-agents", "vc-robot"],
    paragraphs: [
      [
        s(
          "Last year’s valuation anchor was growth and narrative. This year’s is cash flow and renewal.",
          "去年 的 估值 锚 是 增长 和 故事 ， 今年 的 锚 是 现金流 和 续约 。",
          true
        ),
        s(
          "One early-stage fund wrote the commercialization path into the investment premise, not an appendix.",
          "一家 早期 基金 把 商业化 路径 写进 投资 前提 ， 而 不是 写进 附录 。"
        ),
      ],
      [
        s(
          "In the terms, milestones correspond to paid pilots, not another demo.",
          "条款 里 ， 里程碑 对应 的 是 付费 试点 ， 不是 新 的 演示 。"
        ),
        s(
          "If orders do not turn into revenue within two quarters, the next round is pushed back.",
          "如果 订单 不能 在 两个 季度 里 变成 收入 ， 下一轮 融资 就 会 被 推迟 。",
          true
        ),
      ],
      [
        s(
          "This is an adjustment of the valuation framework, not a rejection of the technical direction.",
          "这 是 估值 体系 的 调整 ， 不是 对 技术 方向 的 否定 。"
        ),
        s(
          "Investors will still give more patience to teams that can actually deploy.",
          "投资人 仍 会 给 真正 能 落地 的 团队 更多 耐心 。"
        ),
      ],
      [
        s(
          "Exit discussions show up earlier. A Hong Kong listing and a sale are on the same page.",
          "退出 的 讨论 也 更 早 出现 ， 港股 和 并购 被 放在 同一 页 。",
          true
        ),
        s(
          "A company without cash flow is in a weak place to talk about a control premium.",
          "没有 现金流 的 公司 ， 很难 谈 控制权 溢价 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "The anchor moved from growth narrative to cash flow and renewal.",
        cn: "估值锚从增长故事换成了现金流和续约。",
      },
      {
        en: "Commercialization belongs in the premise, not the appendix.",
        cn: "商业化路径要写进投资前提，不是附录。",
      },
      {
        en: "A missed conversion of orders into revenue pushes the next round out.",
        cn: "订单两个季度内变不成收入，下一轮就会推迟。",
      },
      {
        en: "Exit is earlier in the memo, and cash flow still gates any control premium.",
        cn: "退出讨论更早出现，但没有现金流就很难谈控制权溢价。",
      },
    ],
    investor: {
      facts: [
        "The piece contrasts last year’s anchor (growth and story) with this year’s (cash flow and renewal).",
        "Milestones in the described terms point to paid pilots.",
        "Hong Kong listings and M&A are described as appearing on the same page of the memo.",
      ],
      inferences: [
        "This is a framework adjustment, not a verdict that the technology failed. The article says so directly; the market-wide extent is not measured here.",
        "Teams that can deploy may still receive patience. That is a stated tendency, not a promise of terms.",
      ],
      relevance: [
        {
          label: "Monetization",
          kind: "fact",
          text: "Orders have a two-quarter test before the next round is assumed.",
        },
        {
          label: "Competition",
          kind: "inference",
          text: "Capital may concentrate on teams that can deploy, which would widen the gap versus demo-stage peers.",
        },
        {
          label: "Exit",
          kind: "fact",
          text: "Listing and sale are being written together, earlier than before.",
        },
      ],
      watch: [
        "Whether the next round’s premise names a paid milestone.",
        "Whether a control premium is even discussed where cash flow is absent.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What replaced growth and story as the valuation anchor?",
        ["Headcount", "Cash flow and renewal", "Office size", "Parameter count"],
        1,
        "今年的锚是现金流和续约。",
        "去年的估值锚是增长和故事，今年的锚是现金流和续约。",
        "估值"
      ),
      q(
        "recognition",
        "商业化路径应该写在哪里？",
        ["附录", "投资前提", "新闻标题", "招聘启事"],
        1,
        "写进投资前提，而不是附录。",
        "一家早期基金把商业化路径写进投资前提，而不是写进附录。",
        "商业化"
      ),
      q(
        "business",
        "What pushes the next round back?",
        [
          "Orders that do not become revenue within two quarters",
          "Any technical discussion",
          "A Hong Kong holiday",
          "Writing a memo",
        ],
        0,
        "两个季度内订单不变成收入，融资就被推迟。",
        "如果订单不能在两个季度里变成收入，下一轮融资就会被推迟。",
        "融资"
      ),
      q(
        "vocabulary",
        "没有现金流时，很难谈什么？",
        ["控制权溢价", "技术方向", "团队存在", "试点定义"],
        0,
        "控制权溢价以现金流为前提。",
        "没有现金流的公司，很难谈控制权溢价。",
        "控制权"
      ),
      q(
        "context",
        "港股和并购在备忘录里的关系是什么？",
        ["互相否定", "被放在同一页", "都已取消", "只留给后期"],
        1,
        "退出方式被放在同一页，讨论也更早。",
        "退出的讨论也更早出现，港股和并购被放在同一页。",
        "退出"
      ),
    ],
  },
  {
    id: "vc-robot",
    titleCn: "机器人公司的一轮融资：条款里写的是交付，不是故事",
    titleEn: "A robotics round where the terms specify delivery, not a story",
    sourceId: "pedaily",
    publishedAt: "2026-10-16T05:40:00+08:00",
    category: "vc",
    subcategory: "Rounds",
    tags: ["Terms", "Delivery", "Ratchet"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Beilu’s new round is more restrained. Milestones name delivery nodes, yield, and collections — a delivery ratchet, not a growth ratchet.",
    summaryCn: "这一轮估值更克制。里程碑写的是交付节点、良率和回款。对赌从增长换成了交付。",
    whyItMatters:
      "Later-stage funds feel this first, because an exit needs time that a slipped acceptance will consume.",
    lingo: ["融资", "估值", "交付", "良率", "回款", "对赌", "里程碑", "退出"],
    entityIds: ["beilu"],
    relatedIds: ["humanoid", "vc-memo"],
    paragraphs: [
      [
        s(
          "Beilu Robotics closed a new round at a more restrained valuation than the last one.",
          "北麓机器人 完成 了 新 一轮 融资 ， 估值 比 上一轮 更 克制 。",
          true
        ),
        s(
          "Investors wrote delivery nodes, yield, and collections into the milestones.",
          "投资人 把 交付 节点 、 良率 和 回款 写进 了 里程碑 。"
        ),
      ],
      [
        s(
          "An attractive order book does not mean cash flow has turned positive.",
          "订单 好看 ， 并 不 等于 现金流 已经 转正 。"
        ),
        s(
          "If the customer delays acceptance, revenue recognition moves back.",
          "如果 客户 延期 验收 ， 收入确认 就 会 往后 放 。",
          true
        ),
      ],
      [
        s(
          "Ratchets have not disappeared. They have shifted from growth ratchets to delivery ratchets.",
          "对赌 没有 消失 ， 只是 从 增长 对赌 改成 了 交付 对赌 。"
        ),
        s(
          "The change matters more to later-stage funds, because they need time for an exit.",
          "这一 变化 对 后期 基金 更 重要 ， 因为 他们 要 为 退出 预留 时间 。"
        ),
      ],
      [
        s(
          "Supply-chain risk is in the memo as well.",
          "产业链 上 的 供应链 风险 也 被 写进 备忘录 。"
        ),
        s(
          "Domestic substitution can lower some supply risk. It cannot replace customer acceptance.",
          "国产替代 能 降低 一部分 供应 风险 ， 不能 替代 客户 的 验收 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "The round is restrained, and the milestones are operational.",
        cn: "估值更克制，里程碑写成了交付、良率和回款。",
      },
      {
        en: "A good-looking order book is not positive cash flow.",
        cn: "订单好看，不等于现金流已经转正。",
      },
      {
        en: "The ratchet moved from growth to delivery.",
        cn: "对赌从增长对赌改成了交付对赌。",
      },
      {
        en: "Substitution does not replace acceptance.",
        cn: "国产替代不能替代客户验收。",
      },
    ],
    investor: {
      facts: [
        "In this demo case, the new round is at a more restrained valuation.",
        "Milestones name delivery nodes, yield, and collections.",
        "Delayed acceptance pushes revenue recognition back.",
      ],
      inferences: [
        "Later-stage funds are more exposed because exit timelines absorb slippage. That is the article’s reasoning.",
        "A delivery ratchet can still be as binding as a growth ratchet. The piece says the instrument changed, not that pressure vanished.",
      ],
      relevance: [
        {
          label: "Deal terms",
          kind: "fact",
          text: "The ratchet is tied to delivery rather than to a growth number.",
        },
        {
          label: "Cash flow",
          kind: "fact",
          text: "Orders and cash turning positive are explicitly separated.",
        },
        {
          label: "Exit",
          kind: "inference",
          text: "Slipped acceptance consumes the time a later fund had reserved for exit.",
        },
      ],
      watch: [
        "Acceptance dates inside the milestone.",
        "Whether revenue recognition moves when acceptance slips.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What did investors write into the milestones?",
        [
          "A brand story",
          "Delivery nodes, yield, and collections",
          "Only a valuation number",
          "An office lease",
        ],
        1,
        "里程碑写的是交付节点、良率和回款。",
        "投资人把交付节点、良率和回款写进了里程碑。",
        "里程碑"
      ),
      q(
        "vocabulary",
        "对赌发生了什么变化？",
        ["消失了", "从增长对赌改成交付对赌", "变成了税", "变成了补贴"],
        1,
        "对赌还在，锚从增长换成交付。",
        "对赌没有消失，只是从增长对赌改成了交付对赌。",
        "对赌"
      ),
      q(
        "business",
        "订单好看说明现金流已经转正吗？",
        ["说明", "不说明", "只在港股说明", "只在材料行业说明"],
        1,
        "文章把两者分开。",
        "订单好看，并不等于现金流已经转正。",
        "现金流"
      ),
      q(
        "recognition",
        "客户延期验收，会影响到什么？",
        ["收入确认往后放", "良率自动上升", "估值必须上升", "退出已经完成"],
        0,
        "收入确认会往后放。",
        "如果客户延期验收，收入确认就会往后放。",
        "收入确认"
      ),
      q(
        "context",
        "国产替代不能替代什么？",
        ["客户验收", "备忘录", "基金", "供应链这个词"],
        0,
        "供应风险可以降低，验收不能被替代。",
        "国产替代能降低一部分供应风险，不能替代客户的验收。",
        "验收"
      ),
    ],
  },
  {
    id: "policy-filing",
    titleCn: "生成式人工智能备案，开始出现在融资法律意见书里",
    titleEn: "Generative-AI filing requirements are showing up in financing legal opinions",
    sourceId: "21cbh",
    publishedAt: "2026-10-16T07:55:00+08:00",
    category: "policy",
    subcategory: "AI regulation",
    tags: ["Filing", "Data", "Terms"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Filing is no longer an appendix handled after launch. Lawyers are giving data compliance its own section, and an unclear path for cross-border data moves revenue timing.",
    summaryCn: "备案不再是上线之后的附录。数据合规开始单列，数据跨境没有路径时，海外收入确认会受影响。",
    whyItMatters:
      "Compliance is starting to show up as a valuation discount for application-layer companies. The policy is not a bullish or bearish sticker — the pace has to be checkable.",
    lingo: ["备案", "合规", "数据跨境", "监管", "商业化", "估值", "里程碑"],
    entityIds: ["cac", "genai-filing"],
    relatedIds: ["policy-platform", "ai-agents"],
    paragraphs: [
      [
        s(
          "CAC filing requirements are no longer an appendix handled after a product launches.",
          "国家网信办 的 备案 要求 ， 已经 不是 产品 上线 之后 才 处理 的 附录 。",
          true
        ),
        s(
          "Lawyers are starting to give data compliance its own section in financing legal opinions.",
          "律师 开始 在 融资 法律意见书 里 单列 数据 合规 。"
        ),
      ],
      [
        s(
          "If there is no path for cross-border data, revenue recognition for overseas business is affected.",
          "数据跨境 如果 没有 路径 ， 海外 业务 的 收入确认 会 受 影响 。",
          true
        ),
        s(
          "This is a compliance cost. It is not an issue that can wait for the next round.",
          "这 是 合规 成本 ， 不是 可以 放到 下一轮 再 谈 的 问题 。"
        ),
      ],
      [
        s(
          "Investors are treating regulation as a term, not as background color.",
          "投资人 把 监管 当成 条款 ， 而 不是 当成 背景 。"
        ),
        s(
          "If filing progress is uncertain, the commercialization date in the milestones has to move back.",
          "如果 备案 进度 不确定 ， 里程碑 里 的 商业化 时点 就 要 后移 。"
        ),
      ],
      [
        s(
          "For application-layer companies, compliance capability is starting to affect the valuation discount.",
          "对 应用层 公司 来说 ， 合规 能力 开始 影响 估值 折价 。",
          true
        ),
        s(
          "The policy itself is not a bullish or bearish label. What matters is whether the pace can be checked.",
          "政策 本身 不是 利好 或 利空 的 标签 ， 关键 是 落地 节奏 能否 被 核验 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Filing has moved into the legal opinion, ahead of launch.",
        cn: "备案写进了融资法律意见书，不再等上线之后。",
      },
      {
        en: "No path for cross-border data affects overseas revenue recognition.",
        cn: "数据跨境没有路径，海外收入确认会受影响。",
      },
      {
        en: "Uncertain filing progress pushes the commercialization date back.",
        cn: "备案进度不确定，商业化时点就要后移。",
      },
      {
        en: "Read the pace, not a bullish or bearish sticker.",
        cn: "要核验落地节奏，不要贴利好或利空的标签。",
      },
    ],
    investor: {
      facts: [
        "The piece says filing is no longer handled only after launch.",
        "Legal opinions are described as giving data compliance its own section.",
        "Missing a cross-border data path is said to affect overseas revenue recognition.",
      ],
      inferences: [
        "A valuation discount for weak compliance is described as starting, not as a measured market multiple.",
        "Calling the policy simply bullish or bearish hides the only investable question: whether the pace can be checked.",
      ],
      relevance: [
        {
          label: "Regulation",
          kind: "fact",
          text: "Regulation is being written as a term.",
        },
        {
          label: "Monetization",
          kind: "fact",
          text: "Commercialization dates in milestones move if filing is uncertain.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Compliance cost can change the discount even when it is not inside gross margin.",
        },
      ],
      watch: [
        "Whether the legal opinion has a standalone data section.",
        "The filing date named in the milestone, and whether it slips.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "Where is data compliance starting to appear on its own?",
        [
          "In financing legal opinions",
          "Only in consumer ads",
          "Only after an exit",
          "In office leases",
        ],
        0,
        "律师在融资法律意见书里单列数据合规。",
        "律师开始在融资法律意见书里单列数据合规。",
        "合规"
      ),
      q(
        "vocabulary",
        "数据跨境没有路径时，什么会受影响？",
        ["海外收入确认", "办公室面积", "参数排名", "样机颜色"],
        0,
        "海外业务的收入确认会受影响。",
        "数据跨境如果没有路径，海外业务的收入确认会受影响。",
        "数据跨境"
      ),
      q(
        "business",
        "备案进度不确定时，里程碑里什么要后移？",
        ["商业化时点", "公司名称", "基金名称", "城市"],
        0,
        "商业化时点后移。",
        "如果备案进度不确定，里程碑里的商业化时点就要后移。",
        "备案"
      ),
      q(
        "recognition",
        "政策本身应该被看成什么？",
        ["自动的利好", "自动的利空", "需要核验落地节奏，而不是标签", "与融资无关"],
        2,
        "关键是节奏能否被核验。",
        "政策本身不是利好或利空的标签，关键是落地节奏能否被核验。",
        "落地"
      ),
      q(
        "context",
        "投资人怎样对待监管？",
        ["当成背景", "当成条款", "当成演示", "当成补贴"],
        1,
        "监管被写成条款。",
        "投资人把监管当成条款，而不是当成背景。",
        "监管"
      ),
    ],
  },
  {
    id: "policy-platform",
    titleCn: "平台监管常态化之后，增长指引怎么改",
    titleEn: "After platform regulation became routine, how growth guidance changes",
    sourceId: "yicai",
    publishedAt: "2026-10-15T19:40:00+08:00",
    category: "policy",
    subcategory: "Platforms",
    tags: ["Guidance", "Compliance", "M&A"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Fines are no longer modeled as one-offs. Guidance that speaks only about users, and not profit, is a hard call to get through.",
    summaryCn: "罚款不再被当成一次性事件。只讲用户、不讲利润的指引，电话会会很难开。",
    whyItMatters:
      "Approval time is now part of the M&A timetable. Ignore it and the exit clock is too short.",
    lingo: ["监管", "指引", "补贴", "贡献利润", "合规", "并购", "控制权", "退出"],
    entityIds: [],
    relatedIds: ["local-profit", "policy-filing"],
    paragraphs: [
      [
        s(
          "After regulation moved from concentrated penalties to day-to-day constraints, platform growth guidance became more cautious.",
          "监管 从 集中 处罚 转到 日常 约束 以后 ， 平台 的 增长 指引 更 谨慎 。",
          true
        ),
        s(
          "Investors no longer treat fines as a one-off event.",
          "投资人 不再 把 罚款 当成 一次性 事件 。"
        ),
      ],
      [
        s(
          "Operationally, subsidies giving way to contribution profit is the other side of the same change.",
          "经营 上 ， 补贴 让位于 贡献利润 ， 是 同一 变化 的 另一 面 。"
        ),
        s(
          "If guidance talks only about users and not profit, the call is hard to get through.",
          "如果 指引 只 讲 用户 ， 不 讲 利润 ， 电话会 会 很难 开 。",
          true
        ),
      ],
      [
        s(
          "Compliance cost enters the gross-margin discussion even though it is not inside the definition of gross margin.",
          "合规 成本 会 进入 毛利率 的 讨论 ， 虽然 它 不 在 毛利率 的 定义 里 。"
        ),
        s(
          "The model has to treat regulation as an ongoing operating variable.",
          "模型 必须 把 监管 当成 持续 的 经营 变量 。"
        ),
      ],
      [
        s(
          "For M&A, approval time becomes part of the deal timetable.",
          "对 并购 来说 ， 审批 时间 变成 交易 时间表 的 一部分 。"
        ),
        s(
          "If a control deal ignores that item, the time to exit gets underestimated.",
          "控制权 交易 如果 忽略 这一 项 ， 退出 时间 就 会 被 低估 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Guidance got more cautious once penalties became routine constraints.",
        cn: "处罚变成日常约束之后，增长指引更谨慎。",
      },
      {
        en: "Fines are no longer a one-off in the model.",
        cn: "罚款不再被当成一次性事件。",
      },
      {
        en: "User-only guidance does not survive the call.",
        cn: "只讲用户、不讲利润，电话会很难开。",
      },
      {
        en: "Approval time belongs on the deal timetable.",
        cn: "审批时间是并购时间表的一部分。",
      },
    ],
    investor: {
      facts: [
        "Guidance is described as more cautious after regulation became day-to-day.",
        "Fines are no longer treated as one-off.",
        "Approval time is part of the M&A timetable in the piece.",
      ],
      inferences: [
        "Compliance cost will be debated next to gross margin even though it is definitionally separate. That is a modeling habit, not an accounting identity.",
        "Exit timing that ignores approval will be too optimistic.",
      ],
      relevance: [
        {
          label: "Regulation",
          kind: "fact",
          text: "Regulation is an ongoing operating variable in the model.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Contribution profit replacing subsidies is the operating face of the same shift.",
        },
        {
          label: "Exit",
          kind: "fact",
          text: "Control deals that skip approval time underestimate the exit clock.",
        },
      ],
      watch: [
        "Whether guidance pairs users with profit.",
        "The approval line on any control-deal timetable.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "How did growth guidance change?",
        ["It became more cautious", "It was cancelled", "It only discusses fines as one-offs", "It ignores users and profit"],
        0,
        "指引更谨慎。",
        "平台的增长指引更谨慎。",
        "指引"
      ),
      q(
        "vocabulary",
        "补贴让位于什么？",
        ["贡献利润", "罚款故事", "参数", "样机"],
        0,
        "经营上，补贴让位于贡献利润。",
        "经营上，补贴让位于贡献利润，是同一变化的另一面。",
        "贡献利润"
      ),
      q(
        "business",
        "只讲用户的指引会怎样？",
        ["电话会很难开", "自动通过", "提高毛利率定义", "取消审批"],
        0,
        "不讲利润，电话会很难开。",
        "如果指引只讲用户，不讲利润，电话会会很难开。",
        "电话会"
      ),
      q(
        "recognition",
        "控制权交易忽略审批时间，会低估什么？",
        ["退出时间", "用户昵称", "办公室", "演示次数"],
        0,
        "退出时间会被低估。",
        "控制权交易如果忽略这一项，退出时间就会被低估。",
        "退出"
      ),
      q(
        "context",
        "合规成本为什么会进入毛利率讨论？",
        [
          "因为它在会计定义里",
          "虽然不在定义里，讨论仍会把它放进来",
          "因为它等于补贴",
          "因为它取消了监管",
        ],
        1,
        "定义之外，讨论之内。",
        "合规成本会进入毛利率的讨论，虽然它不在毛利率的定义里。",
        "合规"
      ),
    ],
  },
  {
    id: "macro-capacity",
    titleCn: "制造业投资还在，产能利用率决定它还能撑多久",
    titleEn: "Manufacturing investment is still there. Capacity utilization decides how long it can last.",
    sourceId: "yicai",
    publishedAt: "2026-10-16T05:55:00+08:00",
    category: "macro",
    subcategory: "Manufacturing",
    tags: ["Utilization", "Credit", "Orders"],
    difficulty: "foundational",
    readingMinutes: 7,
    summaryEn:
      "Capex has not vanished, but the bar for a new project is higher. A rise in leverage is not a rise in demand.",
    summaryCn: "资本开支还在，新项目门槛更高。杠杆上来，并不等于需求上来。",
    whyItMatters:
      "One macro number does not become a company’s cash flow. The translation is orders, inventory, and price.",
    lingo: ["资本开支", "产能利用率", "杠杆", "现金流", "毛利率", "订单"],
    entityIds: [],
    relatedIds: ["industrial-robots", "fintech-fees"],
    paragraphs: [
      [
        s(
          "Manufacturing capex has not disappeared, but the bar for new projects is higher.",
          "制造业 的 资本开支 没有 消失 ， 但 新 项目 的 门槛 更 高 。",
          true
        ),
        s(
          "If capacity utilization stays low, the next round of equipment orders contracts.",
          "产能利用率 如果 持续 偏 低 ， 下一轮 设备 订单 就 会 收缩 。"
        ),
      ],
      [
        s(
          "When investors read credit data, they should separate medium- and long-term loans from work that has actually started.",
          "投资人 看 信贷 时 ， 要 把 中长期贷款 和 实际 开工 分开 。"
        ),
        s(
          "A rise in leverage does not equal a rise in demand.",
          "杠杆 上来 ， 并 不 等于 需求 上来 。",
          true
        ),
      ],
      [
        s(
          "The gap between the export chain and domestic demand shows up in different industries’ gross margins.",
          "出口 链 和 内需 的 差别 ， 会 写进 不同 行业 的 毛利率 。"
        ),
        s(
          "One macro number cannot be translated directly into a company’s cash flow.",
          "一个 宏观 数字 不能 直接 翻译 成 一家 公司 的 现金流 。"
        ),
      ],
      [
        s(
          "So the work goes back to orders, inventory, and prices.",
          "所以 行业 研究 要 回到 订单 、 库存 和 价格 。",
          true
        ),
        s(
          "That is the basic craft of turning macro into investment language.",
          "这 是 把 宏观 翻译 成 投资 语言 的 基本功 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Capex remains, with a higher bar for new projects.",
        cn: "资本开支还在，新项目门槛更高。",
      },
      {
        en: "Low utilization leads to fewer equipment orders next.",
        cn: "利用率持续偏低，下一轮设备订单会收缩。",
      },
      {
        en: "More leverage is not more demand.",
        cn: "杠杆上来不等于需求上来。",
      },
      {
        en: "Translate macro through orders, inventory, and price.",
        cn: "宏观要经订单、库存和价格，才能变成公司语言。",
      },
    ],
    investor: {
      facts: [
        "Manufacturing capex is described as still present, with a higher bar.",
        "Low utilization is linked to a contraction in the next equipment-order round.",
        "Loans and actual start of work are separated.",
      ],
      inferences: [
        "Export-chain and domestic-demand businesses will not share gross-margin direction. The piece says the gap shows up there; it does not publish a table.",
        "A single credit print is a poor proxy for a company’s cash flow.",
      ],
      relevance: [
        {
          label: "Industry structure",
          kind: "fact",
          text: "The next equipment cycle depends on utilization, not on the existence of capex in the abstract.",
        },
        {
          label: "Leverage",
          kind: "fact",
          text: "Leverage up is not demand up.",
        },
        {
          label: "Cash flow",
          kind: "inference",
          text: "Company cash has to be read from orders, inventory, and price.",
        },
      ],
      watch: [
        "Utilization before modeling the next equipment round.",
        "Whether new loans correspond to projects that have started.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What decides how long manufacturing investment can last in this piece?",
        ["A slogan", "Capacity utilization", "Office count", "A single headline"],
        1,
        "产能利用率决定下一轮设备订单。",
        "产能利用率如果持续偏低，下一轮设备订单就会收缩。",
        "产能利用率"
      ),
      q(
        "vocabulary",
        "杠杆上来等于需求上来吗？",
        ["等于", "不等于", "只在周四等于", "只在出口等于"],
        1,
        "文章明确分开。",
        "杠杆上来，并不等于需求上来。",
        "杠杆"
      ),
      q(
        "business",
        "看信贷时要分开的是哪两项？",
        ["中长期贷款和实际开工", "logo和口号", "用户和昵称", "演示和参数"],
        0,
        "贷款不等于已经开工。",
        "投资人看信贷时，要把中长期贷款和实际开工分开。",
        "中长期贷款"
      ),
      q(
        "recognition",
        "一个宏观数字不能直接变成什么？",
        ["公司现金流", "一个句子", "一个行业名称", "一份报纸"],
        0,
        "不能直接翻译成公司现金流。",
        "一个宏观数字不能直接翻译成一家公司的现金流。",
        "现金流"
      ),
      q(
        "context",
        "行业研究要回到哪三样？",
        ["订单、库存和价格", "口号、颜色和办公室", "参数、演示和排名", "罚款、补贴和昵称"],
        0,
        "订单、库存、价格。",
        "所以行业研究要回到订单、库存和价格。",
        "订单"
      ),
    ],
  },
  {
    id: "fintech-fees",
    titleCn: "助贷费率在降，合规成本没有一起降",
    titleEn: "Loan-facilitation fees are falling. Compliance costs are not falling with them.",
    sourceId: "tmtpost",
    publishedAt: "2026-10-16T04:10:00+08:00",
    category: "macro",
    subcategory: "Fintech",
    tags: ["Fees", "Compliance", "Cash flow"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Scale alone compresses gross margin when fees fall and compliance does not. Stable cash flow is more welcome to later capital than a growth story.",
    summaryCn: "费率下降而合规成本不降，只靠规模会先压毛利率。现金流稳定比高增长故事更受后期资金欢迎。",
    whyItMatters:
      "This is risk pricing, not a penetration story. Cross-border collections are a separate ledger.",
    lingo: ["费率", "助贷", "合规", "毛利率", "现金流", "风险定价", "出海", "牌照"],
    entityIds: ["ant"],
    relatedIds: ["macro-capacity", "outbound-consumer"],
    paragraphs: [
      [
        s(
          "In the fintech environment where Ant Group operates, fee rates have been falling for several quarters.",
          "蚂蚁集团 所 在 的 金融 科技 环境 里 ， 费率 下降 已经 持续 了 几个 季度 。",
          true
        ),
        s(
          "If loan-facilitation companies rely only on scale, gross margin gets compressed first.",
          "助贷 公司 如果 只 靠 规模 ， 毛利率 会 先 被 压缩 。"
        ),
      ],
      [
        s(
          "Compliance cost includes data, collection constraints, and capital. It is not on the fee schedule.",
          "合规 成本 包括 数据 、 催收 约束 和 资本金 ， 不 在 费率 表 上 。"
        ),
        s(
          "Investors tend to read falling revenue as a demand problem and miss the structural change from regulation.",
          "投资人 容易 把 收入 下降 看成 需求 问题 ， 忽略 监管 带来 的 结构 变化 。",
          true
        ),
      ],
      [
        s(
          "Companies with stable cash flow are more welcome to later-stage capital than high-growth stories.",
          "现金流 稳定 的 公司 ， 比 高 增长 故事 更 受 后期 资金 欢迎 。"
        ),
        s(
          "This is about risk pricing, not about consumer-finance penetration.",
          "这 和 渗透率 无关 ， 和 风险定价 有关 。"
        ),
      ],
      [
        s(
          "Cross-border collections are a separate ledger. Licenses and localization set the speed.",
          "跨境 收款 是 另一 本 账 ， 牌照 和 本地化 决定 速度 。",
          true
        ),
        s(
          "Going overseas does not mean lifting the domestic model and dropping it abroad.",
          "出海 不 等于 把 国内 模型 直接 搬 出去 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Fees can fall while compliance cost does not.",
        cn: "费率可以降，合规成本不必一起降。",
      },
      {
        en: "Scale-only models feel gross-margin pressure first.",
        cn: "只靠规模，毛利率会先被压缩。",
      },
      {
        en: "Falling revenue may be structure, not demand.",
        cn: "收入下降可能是监管带来的结构变化，不是需求消失。",
      },
      {
        en: "Outbound collections need a license and a local setup. They are not a copy-paste.",
        cn: "跨境收款看牌照和本地化，不是把国内模型搬出去。",
      },
    ],
    investor: {
      facts: [
        "Fee rates in this environment are described as having fallen for several quarters.",
        "Compliance cost is defined as data, collection constraints, and capital — off the fee schedule.",
        "Cross-border collections are a separate ledger.",
      ],
      inferences: [
        "Reading the revenue decline as only a demand problem will miss the regulatory structure. The piece flags that habit.",
        "Later-stage capital preferring stable cash flow is a stated preference, not a count of term sheets.",
      ],
      relevance: [
        {
          label: "Margins",
          kind: "fact",
          text: "Scale without a lower compliance burden compresses gross margin.",
        },
        {
          label: "Regulation",
          kind: "fact",
          text: "The structural change is regulatory, and it is easy to mislabel as demand.",
        },
        {
          label: "Monetization",
          kind: "inference",
          text: "Risk pricing, not penetration, is the right frame for the fee decline.",
        },
      ],
      watch: [
        "Whether compliance cost is modeled separately from the fee rate.",
        "License and localization timelines on any cross-border ledger.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What did not fall together with fee rates?",
        ["Compliance cost", "The calendar", "The word for company", "Inventory of robots"],
        0,
        "合规成本没有一起降。",
        "助贷公司如果只靠规模，毛利率会先被压缩。",
        "合规"
      ),
      q(
        "vocabulary",
        "合规成本包括哪些、又不在哪里？",
        [
          "包括数据、催收约束和资本金，不在费率表上",
          "只包括办公室租金",
          "等于渗透率",
          "等于出海",
        ],
        0,
        "它不在费率表上。",
        "合规成本包括数据、催收约束和资本金，不在费率表上。",
        "资本金"
      ),
      q(
        "business",
        "收入下降容易被误看成什么？",
        ["需求问题", "牌照本身", "本地化完成", "毛利率定义"],
        0,
        "容易忽略监管带来的结构变化。",
        "投资人容易把收入下降看成需求问题，忽略监管带来的结构变化。",
        "监管"
      ),
      q(
        "recognition",
        "这篇文章说，这件事和什么有关？",
        ["风险定价", "样机颜色", "训练集群数量", "新厂照片"],
        0,
        "和风险定价有关，和渗透率无关。",
        "这和渗透率无关，和风险定价有关。",
        "风险定价"
      ),
      q(
        "context",
        "出海等于把国内模型搬出去吗？",
        ["等于", "不等于", "只在周四等于", "牌照无关所以等于"],
        1,
        "牌照和本地化决定速度，不能直接搬。",
        "出海不等于把国内模型直接搬出去。",
        "出海"
      ),
    ],
  },
];
