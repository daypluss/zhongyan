import type { ArticleDraft } from "@/lib/types";
import { q, s } from "@/lib/data/helpers";

export const techArticles: ArticleDraft[] = [
  {
    id: "ai-agents",
    titleCn: "智能体创业潮正在加速，投资人开始盯紧商业化",
    titleEn:
      "The agent startup wave is accelerating, and investors are watching commercialization",
    sourceId: "36kr",
    publishedAt: "2026-10-16T06:20:00+08:00",
    category: "ai",
    subcategory: "Startups",
    tags: ["Agents", "Enterprise", "Venture"],
    difficulty: "intermediate",
    readingMinutes: 8,
    summaryEn:
      "AI pitches are moving from model rank to a simpler question: who has entered a real budget.",
    summaryCn: "人工智能项目的第一问，正在从模型排名转到企业预算。",
    whyItMatters:
      "Several teams are shifting the story from model development toward paid pilots — and renewal is the evidence that counts.",
    lingo: ["智能体", "商业化", "降本增效", "现金流", "估值", "续约"],
    entityIds: ["xiheng"],
    relatedIds: ["ai-inference", "vc-memo"],
    paragraphs: [
      [
        s(
          "Investors looking at AI projects this year often stop opening with model rankings.",
          "投资人 今年 看 人工智能 项目 ， 第一 问 往往 不再 是 模型 排名 。",
          true
        ),
        s(
          "They would rather know who has already sold an agent into an enterprise budget.",
          "他们 更 想 知道 ， 谁 已经 把 智能体 卖进 了 企业 预算 。"
        ),
      ],
      [
        s(
          "Xiheng Intelligence is still giving demos, but the draft terms spell out commercialization milestones in concrete language.",
          "析衡智能 仍 在 讲 演示 ， 但 条款 草稿 里 ， 商业化 里程碑 写 得 很 具体 。"
        ),
        s(
          "One banking customer cares about error rate and handling time, not parameter scale.",
          "一家 银行 客户 关心 差错率 和 处理时长 ， 不 关心 参数 规模 。",
          true
        ),
      ],
      [
        s(
          "That is not the same as the application layer already making money.",
          "这 并 不 等于 应用层 已经 赚钱 。"
        ),
        s(
          "At many companies, cash flow still depends on financing, and orders have not yet become renewals.",
          "更多 公司 的 现金流 仍 依赖 融资 ， 订单 也 还 没有 形成 续约 。"
        ),
      ],
      [
        s(
          "Fund memos are starting to write cost reduction and efficiency as indicators that can be checked.",
          "基金 备忘录 开始 把 降本增效 写成 可核验 的 指标 。",
          true
        ),
        s(
          "If a pilot cannot show costs falling within two quarters, the valuation is hard to defend.",
          "如果 试点 不能 在 两个 季度 里 看到 成本 下降 ， 估值 就 很难 维持 。"
        ),
      ],
      [
        s(
          "Deployment is not another demo. It is finding a department willing to pay.",
          "落地 不是 再 做 一个 演示 ， 而是 找到 愿意 付费 的 部门 。"
        ),
        s(
          "Investors will treat renewal as the evidence of commercialization, not the pilot itself.",
          "投资人 会 把 续约 看成 商业化 的 证据 ， 而 不是 把 试点 本身 看成 证据 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "The opening question has shifted from model rank to budget ownership.",
        cn: "第一问从模型排名转到了预算在谁手里。",
      },
      {
        en: "Milestones in draft terms are getting specific: error rate, handling time, paid use.",
        cn: "条款草稿里的里程碑更具体，看差错率、处理时长和付费。",
      },
      {
        en: "A pilot is not commercialization. Renewal is.",
        cn: "试点还不是商业化，续约才是。",
      },
      {
        en: "Many teams still fund operations with financing, so cash flow stays the constraint.",
        cn: "不少团队的经营仍靠融资，现金流仍是约束。",
      },
    ],
    investor: {
      facts: [
        "The briefing describes bank buyers asking about error rate and handling time rather than parameter scale.",
        "Draft terms in the case name commercialization milestones explicitly.",
        "The piece states that cash flow at many companies still depends on financing, and that orders have not become renewals.",
      ],
      inferences: [
        "Budget ownership may be moving from innovation labs to operations. That is an inference from who is asking, not a market-wide disclosed fact.",
        "Valuations that rest only on demos are likely to be harder to defend if two quarters pass without a measured cost decline.",
      ],
      relevance: [
        {
          label: "Monetization",
          kind: "inference",
          text: "Paid pilots matter only if they convert to renewals. Until then, revenue quality is still unproven.",
        },
        {
          label: "Competition",
          kind: "inference",
          text: "If the buyer’s test is cost reduction, demos that cannot be audited will look alike.",
        },
        {
          label: "Capital intensity",
          kind: "fact",
          text: "The article ties ongoing operations to financing rather than to collected revenue.",
        },
      ],
      watch: [
        "Whether any paid pilot renews after two quarters.",
        "Whether the milestone names a budget owner, not only a technical metric.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What are investors more interested in than model rank?",
        [
          "Office location",
          "Who has sold an agent into an enterprise budget",
          "The number of demo videos",
          "Parameter count alone",
        ],
        1,
        "The piece says the question has moved to who has entered a real budget.",
        "他们更想知道，谁已经把智能体卖进了企业预算。",
        "卖进企业预算"
      ),
      q(
        "recognition",
        "「续约」在这篇里被当成什么？",
        ["一次演示的别名", "商业化的证据", "融资的同义词", "参数规模"],
        1,
        "试点本身不被当成证据，续约才被当成商业化的证据。",
        "投资人会把续约看成商业化的证据，而不是把试点本身看成证据。",
        "续约"
      ),
      q(
        "vocabulary",
        "What does 降本增效 ask a team to show?",
        [
          "A higher model rank",
          "Lower cost and higher efficiency, in a form that can be checked",
          "A new office",
          "More demo days",
        ],
        1,
        "The memo turns the phrase into indicators that can be verified, not a slogan.",
        "基金备忘录开始把降本增效写成可核验的指标。",
        "降本增效"
      ),
      q(
        "business",
        "Why is cash flow still a constraint in the piece?",
        [
          "Because every company is already profitable",
          "Because many companies still depend on financing, and orders have not become renewals",
          "Because banks banned pilots",
          "Because parameter scale fell",
        ],
        1,
        "The article separates a lively pilot market from companies that still live on financing.",
        "更多公司的现金流仍依赖融资，订单也还没有形成续约。",
        "现金流"
      ),
      q(
        "context",
        "银行客户真正关心的是哪一组词？",
        ["参数规模", "差错率和处理时长", "办公室面积", "演示次数"],
        1,
        "买方问的是差错率和处理时长，不是参数规模。",
        "一家银行客户关心差错率和处理时长，不关心参数规模。",
        "差错率"
      ),
    ],
  },
  {
    id: "ai-inference",
    titleCn: "推理成本下降之后，大模型公司才开始谈毛利",
    titleEn:
      "Only after inference costs fell did foundation-model companies start talking about gross margin",
    sourceId: "zhidx",
    publishedAt: "2026-10-16T06:05:00+08:00",
    category: "ai",
    subcategory: "Foundation models",
    tags: ["Inference", "Gross margin", "Capex"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Cheaper inference does not automatically repair gross margin. The compute bill and the price war are still in the model.",
    summaryCn: "推理更便宜，并不自动修好毛利率。算力账单和价格战都还在。",
    whyItMatters:
      "The margin question has moved from training glory to whether revenue can keep up with inference spend.",
    lingo: ["推理成本", "大模型", "毛利率", "价格战", "资本开支", "算力", "单位经济"],
    entityIds: ["deepseek"],
    relatedIds: ["ai-agents", "semi-packaging"],
    paragraphs: [
      [
        s(
          "A drop in inference cost does not automatically repair gross margin.",
          "推理成本 下降 ， 并 不 自动 带来 毛利率 修复 。",
          true
        ),
        s(
          "DeepSeek pushed inference cost into the public discussion, but gross margin still has to be read company by company.",
          "深度求索 把 推理成本 推进 了 公开 讨论 ， 但 毛利率 仍然 要 单独 看 。"
        ),
      ],
      [
        s(
          "The price war has pushed application-layer prices down, while the compute bill is still there.",
          "价格战 把 应用层 的 价格 压 得很 低 ， 算力 账单 却 仍 在 。"
        ),
        s(
          "Foundation-model companies are shifting capex from training clusters toward inference clusters.",
          "大模型 公司 把 资本开支 从 训练 集群 转向 推理 集群 。",
          true
        ),
      ],
      [
        s(
          "Investors are now asking about unit economics, not the parameter story.",
          "投资人 现在 问 的 是 单位经济 ， 不是 参数 故事 。"
        ),
        s(
          "If revenue growth cannot keep up with compute spend, profitability keeps moving further out.",
          "如果 收入 增速 跟不上 算力 投入 ， 盈利能力 就 会 继续 后移 。"
        ),
      ],
      [
        s(
          "Domestic substitution has made part of the chip supply steadier. It has not removed the capex.",
          "国产替代 让 一部分 芯片 供应 更 稳 ， 但 没有 去掉 资本开支 。"
        ),
        s(
          "A lower price per token is a fact about cost. It is not yet a fact about profit.",
          "单 个 词元 更 便宜 是 成本 事实 ， 还 不是 利润 事实 。"
        ),
      ],
      [
        s(
          "The watch item is simple: does collected revenue rise faster than the inference bill?",
          "要 看 的 很 简单 ： 回款 是否 快于 推理 账单 。",
          true
        ),
        s(
          "Until that is true, a gross-margin sentence in a deck is still a hope.",
          "在 这 一点 成立 之前 ， 路演 里 的 毛利率 仍 是 希望 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Cheaper inference is a cost fact, not a profit fact.",
        cn: "推理更便宜是成本事实，不是利润事实。",
      },
      {
        en: "Capex is rotating from training clusters to inference clusters.",
        cn: "资本开支正从训练集群转向推理集群。",
      },
      {
        en: "The price war can take away what engineering saved.",
        cn: "价格战可以把工程上省下的成本拿走。",
      },
      {
        en: "Unit economics have replaced the parameter story as the question.",
        cn: "投资人现在问单位经济，不再问参数故事。",
      },
    ],
    investor: {
      facts: [
        "The piece says inference-cost declines do not automatically repair gross margin.",
        "It describes capex shifting from training clusters toward inference clusters.",
        "It states that domestic substitution steadied part of chip supply without removing capex.",
      ],
      inferences: [
        "Companies that quote a lower token price may still see gross margin fall if application-layer pricing falls faster. That is an inference, not a reported market average.",
        "Profitability likely stays deferred wherever revenue growth lags compute spend.",
      ],
      relevance: [
        {
          label: "Margins",
          kind: "inference",
          text: "Gross margin is now a function of price, utilization, and the inference bill together.",
        },
        {
          label: "Capital intensity",
          kind: "fact",
          text: "The article keeps capex in the story even after inference gets cheaper.",
        },
        {
          label: "Competition",
          kind: "fact",
          text: "The price war is described as still pressing on application-layer prices.",
        },
      ],
      watch: [
        "Whether collections outrun the inference bill.",
        "Utilization of inference clusters, not only announcements of new clusters.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What does a lower inference cost fail to guarantee?",
        [
          "A repaired gross margin",
          "Any public discussion",
          "The existence of clusters",
          "A chip supply",
        ],
        0,
        "The opening line separates a cost decline from a margin repair.",
        "推理成本下降，并不自动带来毛利率修复。",
        "毛利率"
      ),
      q(
        "business",
        "资本开支正在从哪里转向哪里？",
        ["从推理转向培训", "从训练集群转向推理集群", "从销售转向行政", "从国内转向无关市场"],
        1,
        "文章写的是从训练集群转向推理集群。",
        "大模型公司把资本开支从训练集群转向推理集群。",
        "资本开支"
      ),
      q(
        "vocabulary",
        "单位经济 in this piece replaces which story?",
        ["The parameter story", "The office story", "The hiring story only", "A tax story"],
        0,
        "Investors are asking about unit economics instead of parameters.",
        "投资人现在问的是单位经济，不是参数故事。",
        "单位经济"
      ),
      q(
        "context",
        "国产替代在文中做到了什么，又没做到什么？",
        [
          "去掉了全部资本开支",
          "让一部分芯片供应更稳，但没有去掉资本开支",
          "结束了价格战",
          "提高了所有公司的利润",
        ],
        1,
        "供应更稳不等于资本开支消失。",
        "国产替代让一部分芯片供应更稳，但没有去掉资本开支。",
        "国产替代"
      ),
      q(
        "recognition",
        "Which phrase is the actual watch item?",
        [
          "路演里的形容词",
          "回款是否快于推理账单",
          "参数是否更大",
          "办公室是否更大",
        ],
        1,
        "The piece names collections versus the inference bill.",
        "要看的很简单：回款是否快于推理账单。",
        "回款"
      ),
    ],
  },
  {
    id: "semi-packaging",
    titleCn: "先进封装成为算力链上最拥挤的资本开支",
    titleEn: "Advanced packaging has become the most crowded capex line on the compute chain",
    sourceId: "yicai",
    publishedAt: "2026-10-16T06:50:00+08:00",
    category: "semiconductors",
    subcategory: "Packaging",
    tags: ["Capex", "Packaging", "Utilization"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Training-cluster build-out has slowed, but advanced packaging is where capex is crowding — and yield decides whether utilization means anything.",
    summaryCn: "训练集群慢了下来，先进封装的资本开支却更挤。良率不过关，利用率就没有意义。",
    whyItMatters:
      "Domestic substitution is not one trade. Foundry, equipment, and packaging do not share a profit curve.",
    lingo: ["先进封装", "资本开支", "算力", "良率", "产能利用率", "国产替代", "现金流"],
    entityIds: ["smic"],
    relatedIds: ["semi-tools", "ai-inference"],
    paragraphs: [
      [
        s(
          "Compute demand is still there, but the build-out of training clusters has slowed.",
          "算力 需求 还 在 ， 但 训练 集群 的 建设 已经 放缓 。",
          true
        ),
        s(
          "Capex in advanced packaging is more crowded, and equipment lead times have stretched.",
          "先进封装 的 资本开支 更 拥挤 ， 设备 交期 被 拉长 。"
        ),
      ],
      [
        s(
          "The manufacturing segment where SMIC sits and the packaging segment are not the same profit curve.",
          "中芯国际 所 在 的 制造 环节 ， 和 封装 环节 不是 同一 条 利润 曲线 。"
        ),
        s(
          "Investors tend to write domestic substitution as one direction and miss the differences between steps.",
          "投资人 容易 把 国产替代 写成 一个 方向 ， 忽略 环节 之间 的 差别 。",
          true
        ),
      ],
      [
        s(
          "If yield does not come up, the capacity-utilization figure is meaningless.",
          "如果 良率 上不去 ， 产能利用率 的 数字 就 没有 意义 。"
        ),
        s(
          "Cash-flow pressure shows up first at the companies expanding the fastest.",
          "现金流 压力 首先 出现 在 扩产 最 快 的 公司 。"
        ),
      ],
      [
        s(
          "Equipment, materials, and packaging are three different ledgers inside one supply chain.",
          "供应链 里 的 设备 、 材料 和 封装 ， 是 三 笔 不同 的 账 。"
        ),
        s(
          "Whether gross margin holds depends on whether customers will pay a premium for advanced packaging.",
          "毛利率 能否 稳住 ， 取决于 客户 是否 愿意 为 先进封装 付 溢价 。"
        ),
      ],
      [
        s(
          "A crowded capex line is not the same thing as a confirmed shortage of profit.",
          "拥挤 的 资本开支 并 不 等于 利润 已经 确认 短缺 。"
        ),
        s(
          "The next check is acceptance of equipment, not the announcement that it was ordered.",
          "下一步 要 核验 的 是 设备 验收 ， 不是 下单 的 消息 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Packaging capex is crowded even as training-cluster construction slows.",
        cn: "训练集群建设放缓时，先进封装的资本开支反而更挤。",
      },
      {
        en: "Foundry and packaging do not share one profit curve.",
        cn: "制造环节和封装环节不是同一条利润曲线。",
      },
      {
        en: "Utilization without yield is a weak number.",
        cn: "良率上不去，产能利用率就没有解释力。",
      },
      {
        en: "The premium has to be paid by the customer, not assumed in the model.",
        cn: "溢价要客户愿意付，不能在模型里直接假设。",
      },
    ],
    investor: {
      facts: [
        "The piece says training-cluster construction has slowed while advanced-packaging capex is more crowded.",
        "It states that yield has to rise before capacity utilization means anything.",
        "It separates equipment, materials, and packaging into different ledgers.",
      ],
      inferences: [
        "Treating domestic substitution as a single stock theme will mix unlike profit curves. That is an inference about investor behavior described in the piece.",
        "The fastest expanders may feel cash pressure first. The article states the pattern; it does not name a list of companies in distress.",
      ],
      relevance: [
        {
          label: "Capital intensity",
          kind: "fact",
          text: "Lead times on equipment have stretched, so capital goes in before it can be accepted.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Gross margin depends on a packaging premium customers may or may not pay.",
        },
        {
          label: "Industry structure",
          kind: "fact",
          text: "Foundry and packaging are described as different steps, not one curve.",
        },
      ],
      watch: [
        "Equipment acceptance, not order announcements.",
        "Yield alongside any utilization figure.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What has slowed, and what is more crowded?",
        [
          "Packaging slowed; training capex is crowded",
          "Training-cluster build-out slowed; advanced-packaging capex is crowded",
          "Both have stopped",
          "Neither changed",
        ],
        1,
        "Demand for compute remains, but the crowded line is advanced packaging.",
        "算力需求还在，但训练集群的建设已经放缓。",
        "先进封装"
      ),
      q(
        "business",
        "良率上不去时，产能利用率说明什么？",
        ["说明利润已经稳定", "说明这个数字没有意义", "说明客户已经付了溢价", "说明现金流充裕"],
        1,
        "没有良率，利用率的数字没有意义。",
        "如果良率上不去，产能利用率的数字就没有意义。",
        "良率"
      ),
      q(
        "vocabulary",
        "国产替代 in the piece is easy to misuse as:",
        [
          "One single direction that hides differences between steps",
          "A completed fact at every step",
          "A cash balance",
          "A tax term",
        ],
        0,
        "The article warns against writing it as one direction.",
        "投资人容易把国产替代写成一个方向，忽略环节之间的差别。",
        "国产替代"
      ),
      q(
        "recognition",
        "下一步要核验的是什么？",
        ["下单消息", "设备验收", "办公室新闻", "参数排名"],
        1,
        "验收才是下一步，不是下单消息。",
        "下一步要核验的是设备验收，不是下单的消息。",
        "验收"
      ),
      q(
        "context",
        "Why might gross margin not hold?",
        [
          "Customers may not pay a premium for advanced packaging",
          "SMIC and packaging are the same curve",
          "Lead times got shorter",
          "Yield no longer matters",
        ],
        0,
        "The premium is a customer decision.",
        "毛利率能否稳住，取决于客户是否愿意为先进封装付溢价。",
        "溢价"
      ),
    ],
  },
  {
    id: "semi-tools",
    titleCn: "设备与材料的国产替代，节奏比口号慢",
    titleEn: "Domestic substitution in equipment and materials is slower than the slogan",
    sourceId: "21cbh",
    publishedAt: "2026-10-16T05:15:00+08:00",
    category: "semiconductors",
    subcategory: "Equipment",
    tags: ["Equipment", "Materials", "Qualification"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Equipment orders are more visible than materials orders. Qualification is a cycle, not a press release.",
    summaryCn: "设备订单的可见度高于材料。验证周期要写进备忘录，不能只写政策方向。",
    whyItMatters:
      "Share gains can be real and still slow, because critical steps keep a second supplier.",
    lingo: ["国产替代", "订单", "资本开支", "产能利用率", "盈利能力", "验收"],
    entityIds: ["naura"],
    relatedIds: ["semi-packaging", "industrial-robots"],
    paragraphs: [
      [
        s(
          "In the equipment market where Naura sits, order visibility is higher than in materials.",
          "北方华创 所 在 的 设备 市场 ， 订单 可见度 高于 材料 市场 。",
          true
        ),
        s(
          "Domestic substitution is a real purchasing direction. It is not a completed fact.",
          "国产替代 是 真实 的 采购 方向 ， 不是 已经 完成 的 事实 。"
        ),
      ],
      [
        s(
          "Customers still keep two suppliers on critical steps.",
          "客户 在 关键工序 上 仍然 保留 双供应商 。"
        ),
        s(
          "That means share gains will be slow, and customer relationships may be steadier.",
          "这 意味着 市占率 提升 会 慢 ， 客户 关系 却 可能 更 稳 。",
          true
        ),
      ],
      [
        s(
          "The pace of capex follows fab expansion plans.",
          "资本开支 的 节奏 跟着 晶圆厂 的 扩产 计划 走 。"
        ),
        s(
          "If downstream utilization stays low, equipment acceptance is delayed.",
          "如果 下游 产能利用率 偏 低 ， 设备 验收 就 会 推迟 。"
        ),
      ],
      [
        s(
          "A memo should spell out the qualification cycle, not only the policy direction.",
          "备忘录 应该 把 验证周期 写 清楚 ， 而 不是 只 写 政策 方向 。"
        ),
        s(
          "Profitability shows up after volume delivery. Pilot orders should not be extrapolated.",
          "盈利能力 要 等 批量交付 之后 才 看得到 ， 不能 用 试点 订单 外推 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Substitution is a purchasing direction, not a finished fact.",
        cn: "国产替代是采购方向，不是已经完成的事实。",
      },
      {
        en: "Dual suppliers on critical steps slow share gains.",
        cn: "关键工序保留双供应商，市占率会抬得慢。",
      },
      {
        en: "Acceptance slips when downstream utilization is weak.",
        cn: "下游利用率偏低时，设备验收会推迟。",
      },
      {
        en: "Do not extrapolate a pilot order into profitability.",
        cn: "不要用试点订单外推盈利能力。",
      },
    ],
    investor: {
      facts: [
        "Order visibility is described as higher in equipment than in materials.",
        "Customers keep a second supplier on critical steps.",
        "Acceptance is delayed when downstream utilization is low.",
      ],
      inferences: [
        "Slower share gains can still be the healthier pattern if the relationship is stickier. That reading is an inference.",
        "Policy support alone does not date the revenue. The qualification cycle does.",
      ],
      relevance: [
        {
          label: "Competition",
          kind: "fact",
          text: "Dual-supplier practice caps how fast share can move.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Profitability is visible only after volume delivery, so early gross margin can mislead.",
        },
        {
          label: "Regulation",
          kind: "fact",
          text: "The piece treats policy direction as incomplete without a qualification calendar.",
        },
      ],
      watch: [
        "Acceptance dates versus order dates.",
        "Whether a second supplier is still named on the critical step.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "Where is order visibility higher?",
        ["Materials", "Equipment", "Retail stores", "Advertising"],
        1,
        "The equipment market is described as more visible than materials.",
        "北方华创所在的设备市场，订单可见度高于材料市场。",
        "订单"
      ),
      q(
        "vocabulary",
        "国产替代在文中是什么？",
        ["已经完成的事实", "真实的采购方向", "一种税率", "一种演示"],
        1,
        "它是方向，不是完成时。",
        "国产替代是真实的采购方向，不是已经完成的事实。",
        "国产替代"
      ),
      q(
        "business",
        "Why might market share rise slowly?",
        [
          "Customers keep two suppliers on critical steps",
          "There are no orders",
          "Fabs stopped all capex",
          "Yield is no longer measured",
        ],
        0,
        "Dual supply is the mechanism.",
        "客户在关键工序上仍然保留双供应商。",
        "市占率"
      ),
      q(
        "recognition",
        "试点订单不能用来做什么？",
        ["外推盈利能力", "记录客户名字", "描述政策", "说明公司存在"],
        0,
        "盈利能力要等批量交付。",
        "盈利能力要等批量交付之后才看得到，不能用试点订单外推。",
        "盈利能力"
      ),
      q(
        "context",
        "What should a memo write clearly?",
        ["Only the slogan", "The qualification cycle", "The office address", "A model rank"],
        1,
        "验证周期比政策口号更该写进备忘录。",
        "备忘录应该把验证周期写清楚，而不是只写政策方向。",
        "验证周期"
      ),
    ],
  },
  {
    id: "humanoid",
    titleCn: "人形机器人：样机、小批量与资本开支之间的距离",
    titleEn: "Humanoid robots: the distance between prototypes, small batches, and capex",
    sourceId: "zhidx",
    publishedAt: "2026-10-16T03:20:00+08:00",
    category: "robotics",
    subcategory: "Humanoids",
    tags: ["Yield", "Capex", "Delivery"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "A prototype can raise money. A small batch is what starts to test yield — and shipment is not acceptance.",
    summaryCn: "样机能带来融资，小批量才开始考验良率。交付里程碑应当写成验收，而不是发货。",
    whyItMatters:
      "Reducers, sensors, and motors do not share one valuation just because they sit in the same robot story.",
    lingo: ["样机", "小批量", "良率", "资本开支", "现金流", "交付", "里程碑", "供应链"],
    entityIds: ["unitree", "beilu"],
    relatedIds: ["vc-robot", "industrial-robots"],
    paragraphs: [
      [
        s(
          "Unitree let the market see hardware speed. Mass production is still a different matter.",
          "宇树科技 让 市场 看见 了 硬件 速度 ， 量产 仍 是 另一 件 事 。",
          true
        ),
        s(
          "A prototype can bring in financing. A small batch is what starts to test yield.",
          "样机 可以 带来 融资 ， 小批量 才 开始 考验 良率 。"
        ),
      ],
      [
        s(
          "Beilu Robotics’ customers will pay for a pilot. They will not lock a long-term order.",
          "北麓机器人 的 客户 愿意 付 试点 费用 ， 不 愿意 锁定 长期 订单 。"
        ),
        s(
          "If capex is pulled forward, cash flow tightens before revenue arrives.",
          "资本开支 如果 前置 ， 现金流 会 在 收入 之前 变 紧 。",
          true
        ),
      ],
      [
        s(
          "Reducers, sensors, and motors in the supply chain do not share one valuation logic.",
          "供应链 里 的 减速器 、 传感器 和 电机 ， 不是 同一个 估值 逻辑 。"
        ),
        s(
          "Putting them into one robot story makes it easy to miss the bottleneck.",
          "把 它们 放进 同一个 机器人 故事 ， 容易 忽略 瓶颈 。"
        ),
      ],
      [
        s(
          "A delivery milestone should be written as acceptance, not as shipment.",
          "交付 里程碑 应当 写成 验收 ， 而 不是 写成 发货 。",
          true
        ),
        s(
          "Before yield is stable, market share explains very little.",
          "在 良率 稳定 之前 ， 市占率 几乎 没有 解释力 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Prototype speed and mass production are different events.",
        cn: "硬件速度和量产不是同一件事。",
      },
      {
        en: "Customers will fund a pilot and still refuse a long-term order.",
        cn: "客户可以付试点费用，同时拒绝锁定长期订单。",
      },
      {
        en: "Early capex tightens cash before revenue.",
        cn: "资本开支前置时，现金流会先于收入变紧。",
      },
      {
        en: "Write acceptance, not shipment, into the milestone.",
        cn: "里程碑要写验收，不要写发货。",
      },
    ],
    investor: {
      facts: [
        "The piece separates prototype financing from the yield test of a small batch.",
        "Beilu’s customers, in this demo case, pay for pilots and do not lock long-term orders.",
        "The article says pre-funded capex tightens cash before revenue.",
      ],
      inferences: [
        "A single ‘robotics’ valuation multiple will mis-price components with different bottlenecks. That is the article’s argument, not a priced market.",
        "Share figures published before yield is stable are weak evidence.",
      ],
      relevance: [
        {
          label: "Capital intensity",
          kind: "fact",
          text: "Cash is committed before revenue when capex is pulled forward.",
        },
        {
          label: "Competition",
          kind: "inference",
          text: "The bottleneck may sit in a component, not in the brand of the robot.",
        },
        {
          label: "Monetization",
          kind: "fact",
          text: "Pilot fees are not described as long-term orders.",
        },
      ],
      watch: [
        "Acceptance certificates, not shipping notices.",
        "Which component is the actual bottleneck.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What does a small batch test that a prototype does not?",
        ["Office design", "Yield", "A logo", "A press release"],
        1,
        "The small batch is where yield starts to be tested.",
        "样机可以带来融资，小批量才开始考验良率。",
        "良率"
      ),
      q(
        "recognition",
        "交付里程碑应当写成什么？",
        ["发货", "验收", "融资", "演示"],
        1,
        "验收，不是发货。",
        "交付里程碑应当写成验收，而不是写成发货。",
        "验收"
      ),
      q(
        "business",
        "What happens to cash if capex is pulled forward?",
        [
          "It tightens before revenue arrives",
          "It becomes irrelevant",
          "It only improves",
          "It replaces yield",
        ],
        0,
        "Cash tightens ahead of revenue.",
        "资本开支如果前置，现金流会在收入之前变紧。",
        "现金流"
      ),
      q(
        "vocabulary",
        "减速器、传感器和电机为什么不能共用一个估值？",
        [
          "因为它们在供应链里不是同一个逻辑",
          "因为它们是同一家公司",
          "因为良率已经稳定",
          "因为订单已经锁定",
        ],
        0,
        "同一个机器人故事会掩盖不同瓶颈。",
        "供应链里的减速器、传感器和电机，不是同一个估值逻辑。",
        "估值"
      ),
      q(
        "context",
        "北麓机器人的客户愿意做什么，不愿意做什么？",
        [
          "愿意锁定长期订单，不愿意付试点",
          "愿意付试点费用，不愿意锁定长期订单",
          "两者都不愿意",
          "两者都已经完成",
        ],
        1,
        "试点费用和长期订单被分开写。",
        "北麓机器人的客户愿意付试点费用，不愿意锁定长期订单。",
        "试点"
      ),
    ],
  },
  {
    id: "industrial-robots",
    titleCn: "工业机器人的更新周期，汽车链之外的订单从哪来",
    titleEn: "The industrial-robot refresh cycle: where orders come from outside the auto chain",
    sourceId: "21cbh",
    publishedAt: "2026-10-15T20:00:00+08:00",
    category: "robotics",
    subcategory: "Industrial",
    tags: ["Capex", "Orders", "Service"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "When auto-chain capex slows, the refresh cycle matters more than new-plant headlines. Service revenue is what lifts the valuation range.",
    summaryCn: "汽车链资本开支放缓后，更新周期比新厂新闻更能说明需求。没有服务收入，估值中枢很难抬。",
    whyItMatters:
      "Guidance cuts follow deferred customer capex. Inventory and collections tell you sooner than tender headlines.",
    lingo: ["资本开支", "渗透率", "指引", "国产替代", "毛利率", "回款", "订单"],
    entityIds: [],
    relatedIds: ["humanoid", "macro-capacity"],
    paragraphs: [
      [
        s(
          "After capex in the auto chain slowed, industrial robots needed a new source of orders.",
          "汽车 链 的 资本开支 放缓 之后 ， 工业 机器人 需要 新 的 订单 来源 。",
          true
        ),
        s(
          "Penetration in electronics, batteries, and general manufacturing is not the same.",
          "电子 、 电池 和 一般 制造 的 渗透率 并 不 一样 。"
        ),
      ],
      [
        s(
          "The refresh cycle says more about the next two years than new-plant construction does.",
          "更新周期 比 新厂 建设 更能 说明 未来 两 年 的 需求 。"
        ),
        s(
          "If customers defer capex, equipment makers’ guidance gets cut.",
          "如果 客户 推迟 资本开支 ， 设备商 的 指引 就 会 下调 。",
          true
        ),
      ],
      [
        s(
          "Domestic substitution is moving faster at the mid and low end. High-precision steps still take time.",
          "国产替代 在 中低端 进展 更 快 ， 高精度 环节 仍然 要 时间 。"
        ),
        s(
          "Gross-margin gaps come mainly from software and service, not only from hardware.",
          "毛利率 的 差别 主要 来自 软件 和 售后 ， 不 只 来自 硬件 。"
        ),
      ],
      [
        s(
          "Investors should look at collections and inventory, not only at tender headlines.",
          "投资人 应该 看 回款 和 库存 ， 而 不是 只 看 招标 新闻 。",
          true
        ),
        s(
          "An equipment company without service revenue will struggle to lift its valuation range.",
          "没有 服务 收入 的 设备 公司 ， 估值 中枢 很难 抬升 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "The refresh cycle is a better two-year tell than new-plant news.",
        cn: "未来两年更该看更新周期，而不是新厂新闻。",
      },
      {
        en: "Deferred customer capex shows up as a guidance cut.",
        cn: "客户推迟资本开支，设备商的指引就会下调。",
      },
      {
        en: "High-precision steps are slower to substitute than the mid and low end.",
        cn: "中低端替代更快，高精度环节仍要时间。",
      },
      {
        en: "Service revenue is what makes a higher valuation range plausible.",
        cn: "没有服务收入，估值中枢很难抬升。",
      },
    ],
    investor: {
      facts: [
        "Auto-chain capex is described as having slowed, creating a need for other order sources.",
        "Penetration differs across electronics, batteries, and general manufacturing.",
        "Guidance is cut when customers defer capex.",
      ],
      inferences: [
        "A company with only hardware gross margin may not earn a software multiple. The piece argues this; it does not price a peer set.",
        "Tender headlines can lead collections. That lag is the practical warning.",
      ],
      relevance: [
        {
          label: "Industry structure",
          kind: "fact",
          text: "Demand is split by end market, not one industrial-robot number.",
        },
        {
          label: "Margins",
          kind: "fact",
          text: "Software and service, not only hardware, drive the margin gap.",
        },
        {
          label: "Monetization",
          kind: "inference",
          text: "Without service revenue, the valuation range is hard to lift.",
        },
      ],
      watch: [
        "Guidance changes after customers defer capex.",
        "Inventory and collections beside any tender headline.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What explains the next two years better than new plants?",
        ["A logo refresh", "The replacement cycle", "A single macro print", "Office leases"],
        1,
        "更新周期比新厂建设更能说明需求。",
        "更新周期比新厂建设更能说明未来两年的需求。",
        "更新周期"
      ),
      q(
        "business",
        "客户推迟资本开支时，设备商会发生什么？",
        ["指引上调", "指引下调", "库存消失", "渗透率立刻一致"],
        1,
        "指引会被下调。",
        "如果客户推迟资本开支，设备商的指引就会下调。",
        "指引"
      ),
      q(
        "vocabulary",
        "国产替代哪里更快？",
        ["高精度环节", "中低端", "所有环节同一天", "只在汽车链"],
        1,
        "中低端更快，高精度仍要时间。",
        "国产替代在中低端进展更快，高精度环节仍然要时间。",
        "国产替代"
      ),
      q(
        "recognition",
        "估值中枢很难抬升，缺的是什么？",
        ["服务收入", "招标新闻", "新厂照片", "更多口号"],
        0,
        "没有服务收入，中枢很难抬。",
        "没有服务收入的设备公司，估值中枢很难抬升。",
        "估值"
      ),
      q(
        "context",
        "毛利率差别主要来自哪里？",
        ["只来自硬件", "主要来自软件和售后", "只来自关税", "只来自办公室"],
        1,
        "软件和售后，不只是硬件。",
        "毛利率的差别主要来自软件和售后，不只来自硬件。",
        "毛利率"
      ),
    ],
  },
];
