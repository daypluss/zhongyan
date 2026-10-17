import type { ArticleDraft } from "@/lib/types";
import { q, s } from "@/lib/data/helpers";

export const marketArticles: ArticleDraft[] = [
  {
    id: "saas-outcomes",
    titleCn: "企业软件的账单，正在从订阅变成结果",
    titleEn: "Enterprise software invoices are shifting from subscriptions to outcomes",
    sourceId: "tmtpost",
    publishedAt: "2026-10-16T07:40:00+08:00",
    category: "internet",
    subcategory: "Enterprise software",
    tags: ["Pricing", "Renewal", "Unit economics"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Customers will pay for a lower error rate. They will not pay for a feature list. Outcome pricing moves risk onto the vendor.",
    summaryCn: "客户愿意为差错率下降付钱，不愿意为功能清单付钱。结果付费把风险从客户转到公司。",
    whyItMatters:
      "If unit economics depend on a large delivery staff, the valuation is hard to set at a software-company level.",
    lingo: ["订阅", "结果付费", "差错率", "回款", "续约", "毛利率", "单位经济", "收入确认"],
    entityIds: ["hengshi"],
    relatedIds: ["ai-agents", "local-profit"],
    paragraphs: [
      [
        s(
          "Hengshi Software changed its quote from seat subscriptions to pay-for-results.",
          "衡石软件 把 报价 从 席位 订阅 改成 结果付费 。",
          true
        ),
        s(
          "Customers will pay for a lower error rate. They will not pay for a feature list.",
          "客户 愿意 为 差错率 下降 付钱 ， 不 愿意 为 功能 清单 付钱 。"
        ),
      ],
      [
        s(
          "That changes the sales cycle, and it changes revenue recognition.",
          "这 会 改变 销售 周期 ， 也 会 改变 收入确认 。"
        ),
        s(
          "If the outcome cannot be checked within a quarter, collections slow down.",
          "如果 结果 不能 在 一个 季度 里 被 核验 ， 回款 就 会 变 慢 。",
          true
        ),
      ],
      [
        s(
          "Subscription gross margins are higher, but renewals are getting harder.",
          "订阅 模式 的 毛利率 更 高 ， 但 续约 正在 变 难 。"
        ),
        s(
          "Outcome pricing moves some of the risk from the customer to the company.",
          "结果付费 把 一部分 风险 从 客户 转移 到 公司 。"
        ),
      ],
      [
        s(
          "Investors care whether the model can scale, not whether one case worked.",
          "投资人 关心 的 是 这种 模式 能否 规模化 ， 而 不是 一个 个案 。"
        ),
        s(
          "If unit economics depend on a large delivery staff, the valuation is hard to set at a software-company level.",
          "单位经济 如果 依赖 大量 交付 人员 ， 估值 就 很难 给到 软件 公司 的 水平 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "The invoice is moving from seats to a checked outcome.",
        cn: "账单从席位订阅走向可核验的结果。",
      },
      {
        en: "Revenue recognition and the sales cycle both change.",
        cn: "销售周期和收入确认都会变。",
      },
      {
        en: "Higher subscription margins are meeting harder renewals.",
        cn: "订阅毛利率更高，但续约变难。",
      },
      {
        en: "A delivery-heavy model does not earn a software multiple.",
        cn: "单位经济如果靠大量交付人员，估值很难给到软件公司的水平。",
      },
    ],
    investor: {
      facts: [
        "The demo company moved its quote from seats to outcomes.",
        "Unchecked outcomes slow collections.",
        "Subscription margins are described as higher, renewals as harder.",
      ],
      inferences: [
        "Outcome pricing transfers risk to the vendor. If delivery headcount stays high, the multiple should not be a pure software multiple.",
        "One successful case is not evidence of scale. The piece draws that line explicitly.",
      ],
      relevance: [
        {
          label: "Monetization",
          kind: "fact",
          text: "Payment is tied to a lower error rate, not a feature list.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Gross margin may fall versus subscription if the vendor carries delivery risk.",
        },
        {
          label: "Competition",
          kind: "inference",
          text: "Vendors who cannot verify an outcome inside a quarter will look slower to collect.",
        },
      ],
      watch: [
        "Whether the contract defines a checkable outcome.",
        "Delivery headcount versus software gross margin.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What will the customer pay for?",
        ["A feature list", "A lower error rate", "More seats by default", "A longer demo"],
        1,
        "付钱的对象是差错率下降。",
        "客户愿意为差错率下降付钱，不愿意为功能清单付钱。",
        "差错率"
      ),
      q(
        "vocabulary",
        "结果不能在一个季度里被核验时，什么变慢？",
        ["回款", "参数", "样机", "口号"],
        0,
        "回款变慢。",
        "如果结果不能在一个季度里被核验，回款就会变慢。",
        "回款"
      ),
      q(
        "business",
        "结果付费把风险转到了谁？",
        ["只留在客户", "从客户转到公司", "转到监管", "转到银行储户"],
        1,
        "一部分风险转到公司。",
        "结果付费把一部分风险从客户转移到公司。",
        "结果付费"
      ),
      q(
        "recognition",
        "订阅模式的矛盾是什么？",
        ["毛利率更高，但续约变难", "毛利率更低且续约更容易", "没有收入确认", "没有客户"],
        0,
        "毛利率和续约被同时写到。",
        "订阅模式的毛利率更高，但续约正在变难。",
        "续约"
      ),
      q(
        "context",
        "什么样的单位经济撑不起软件公司估值？",
        ["依赖大量交付人员", "完全没有交付", "只有一个客户名称", "办公在上海"],
        0,
        "交付人员过多，估值难给到软件水平。",
        "单位经济如果依赖大量交付人员，估值就很难给到软件公司的水平。",
        "单位经济"
      ),
    ],
  },
  {
    id: "local-profit",
    titleCn: "补贴退潮之后，本地生活平台开始谈贡献利润",
    titleEn: "As subsidies recede, local-services platforms are talking about contribution profit",
    sourceId: "36kr",
    publishedAt: "2026-10-15T21:10:00+08:00",
    category: "internet",
    subcategory: "Local services",
    tags: ["Subsidies", "Unit economics", "Profit"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Subsidies are no longer the only growth tool. Contribution profit is in the external language, and investors are asking how it is calculated.",
    summaryCn: "补贴不再是唯一的增长工具。贡献利润进了对外口径，投资人追问的是计算方式。",
    whyItMatters:
      "In a market where penetration is already high, the story has to move from increment to efficiency. Order growth and profit quality are different lines.",
    lingo: ["补贴", "贡献利润", "获客成本", "客单价", "单位经济", "竞争格局", "渗透率", "价格战"],
    entityIds: ["meituan"],
    relatedIds: ["instant-retail", "policy-platform"],
    paragraphs: [
      [
        s(
          "In the local-services market where Meituan operates, subsidies are no longer the only growth tool.",
          "美团 所 在 的 本地 生活 市场 ， 补贴 不再 是 唯一 的 增长 工具 。",
          true
        ),
        s(
          "Platforms put contribution profit into their external language. Investors then ask how it is calculated.",
          "平台 把 贡献利润 写进 对外 口径 ， 投资人 则 追问 计算 方式 。"
        ),
      ],
      [
        s(
          "A lower customer-acquisition cost does not necessarily produce healthy unit economics.",
          "获客成本 下降 ， 不 一定 带来 健康 的 单位经济 。"
        ),
        s(
          "If average order value does not rise, fulfillment cost swallows gross profit.",
          "如果 客单价 上不去 ， 履约 成本 就 会 吞掉 毛利 。",
          true
        ),
      ],
      [
        s(
          "The competitive landscape is steadier than last year. The intensity of the price war is easing.",
          "竞争格局 比 去年 更 稳 ， 价格战 的 强度 在 下降 。"
        ),
        s(
          "It is an operating choice, and also a result of a changed regulatory environment.",
          "这 是 经营 选择 ， 也 是 监管 环境 变化 之后 的 结果 。"
        ),
      ],
      [
        s(
          "For investors, order growth and profit quality need to be read separately.",
          "对 投资人 来说 ， 订单 增长 和 利润 质量 要 分开 看 。"
        ),
        s(
          "In a market where penetration is already high, the story has to move from increment to efficiency.",
          "渗透率 已经 不 低 的 市场 ， 故事 要 从 增量 改成 效率 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Contribution profit is now in the language investors will audit.",
        cn: "贡献利润进了对外口径，计算方式会被追问。",
      },
      {
        en: "Cheaper acquisition is not healthy unit economics by itself.",
        cn: "获客成本下降，不等于单位经济健康。",
      },
      {
        en: "If order value stalls, fulfillment cost eats gross profit.",
        cn: "客单价上不去，履约成本会吞掉毛利。",
      },
      {
        en: "High penetration means the story is efficiency, not increment.",
        cn: "渗透率已经不低，故事要从增量改成效率。",
      },
    ],
    investor: {
      facts: [
        "Subsidies are described as no longer the only growth tool in Meituan’s market.",
        "Contribution profit is in external language, and the calculation is being questioned.",
        "The price war’s intensity is described as easing versus last year.",
      ],
      inferences: [
        "The shift is both an operating choice and a regulatory result. The piece states both causes; it does not assign weights.",
        "Order growth can still coexist with weak profit quality. They have to be read apart.",
      ],
      relevance: [
        {
          label: "Unit economics",
          kind: "fact",
          text: "Acquisition cost down does not imply healthy unit economics.",
        },
        {
          label: "Margins",
          kind: "fact",
          text: "Fulfillment cost can consume gross profit if average order value stalls.",
        },
        {
          label: "Competition",
          kind: "inference",
          text: "A steadier landscape may be the condition for talking about profit at all.",
        },
      ],
      watch: [
        "The definition behind any contribution-profit number.",
        "Average order value beside fulfillment cost.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What are investors asking after contribution profit enters the language?",
        ["How it is calculated", "The office address", "A model rank", "The logo color"],
        0,
        "他们追问计算方式。",
        "平台把贡献利润写进对外口径，投资人则追问计算方式。",
        "贡献利润"
      ),
      q(
        "vocabulary",
        "获客成本下降一定带来健康的单位经济吗？",
        ["一定", "不一定", "只在周一一定", "只在补贴上升时一定"],
        1,
        "不一定。",
        "获客成本下降，不一定带来健康的单位经济。",
        "获客成本"
      ),
      q(
        "business",
        "客单价上不去时，什么会吞掉毛利？",
        ["履约成本", "备案", "样机", "训练集群"],
        0,
        "履约成本。",
        "如果客单价上不去，履约成本就会吞掉毛利。",
        "客单价"
      ),
      q(
        "recognition",
        "渗透率已经不低时，故事要改成什么？",
        ["效率", "更多补贴", "更多演示", "更大参数"],
        0,
        "从增量改成效率。",
        "渗透率已经不低的市场，故事要从增量改成效率。",
        "渗透率"
      ),
      q(
        "context",
        "订单增长和利润质量应该怎样看？",
        ["当成一件事", "分开看", "只看补贴", "只看罚款"],
        1,
        "分开看。",
        "对投资人来说，订单增长和利润质量要分开看。",
        "订单"
      ),
    ],
  },
  {
    id: "ev-margins",
    titleCn: "价格战的第二年，谁的毛利率先站稳",
    titleEn: "Year two of the price war: whose gross margin stabilizes first",
    sourceId: "yicai",
    publishedAt: "2026-10-16T07:25:00+08:00",
    category: "ev",
    subcategory: "Margins",
    tags: ["Price war", "Gross margin", "Mix"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "BYD and Li Auto are not in the same price war. A stable gross margin says more than delivery growth. Involution is a slogan; the margin is the test.",
    summaryCn: "比亚迪和理想汽车不是同一类价格战。毛利率站稳比交付增长更能说明问题。内卷是说法，毛利率才是检验。",
    whyItMatters:
      "Next quarter, watch guidance rather than a launch event. Read cash from collections, not from order headlines.",
    lingo: ["价格战", "毛利率", "交付", "现金流", "回款", "竞争格局", "内卷", "指引"],
    entityIds: ["byd", "li", "catl"],
    relatedIds: ["ev-adas", "consumer-brand"],
    paragraphs: [
      [
        s(
          "BYD and Li Auto are not facing the same kind of price war.",
          "比亚迪 和 理想汽车 面对 的 不是 同一 类 价格战 。",
          true
        ),
        s(
          "One competes on scale and cost. The other competes on product mix and options. The competitive structure is not the same.",
          "一个 拼 规模 和 成本 ， 一个 拼 产品 结构 和 选配 ， 竞争格局 也 不同 。"
        ),
      ],
      [
        s(
          "A stable gross margin says more about profitability than delivery growth does.",
          "毛利率 站稳 ， 比 交付 增长 更能 说明 盈利能力 。"
        ),
        s(
          "If prices keep falling, the cost reduction from scale can still be eaten away.",
          "如果 价格 继续 下降 ， 规模 带来 的 降本 也 可能 被 吃掉 。",
          true
        ),
      ],
      [
        s(
          "People call the price war involution. Investors should still test whether gross margin can hold.",
          "有人 把 价格战 说成 内卷 ， 投资人 仍 要 检验 毛利率 能否 站住 。"
        ),
        s(
          "Upstream, CATL still has stronger bargaining power than some of the automakers’ suppliers.",
          "产业链 上游 的 宁德时代 ， 议价 能力 仍然 强于 一部分 整车 供应商 。"
        ),
      ],
      [
        s(
          "Read cash flow from collections, not only from order headlines.",
          "现金流 要 看 回款 ， 不要 只 看 订单 新闻 。",
          true
        ),
        s(
          "Next quarter, investors should watch guidance, not launch events.",
          "下一季 ， 投资人 要 看 的 是 指引 ， 而 不是 发布会 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Scale-and-cost and mix-and-options are different price wars.",
        cn: "拼规模成本和拼产品结构，不是同一类价格战。",
      },
      {
        en: "Gross margin stability beats delivery growth as evidence.",
        cn: "毛利率站稳，比交付增长更能说明盈利能力。",
      },
      {
        en: "Involution is the nickname. The test is whether margin holds.",
        cn: "内卷是说法，检验仍是毛利率能否站住。",
      },
      {
        en: "Collections and guidance outrank order headlines and launch events.",
        cn: "看回款和指引，不要只看订单新闻和发布会。",
      },
    ],
    investor: {
      facts: [
        "BYD and Li Auto are described as facing different price wars.",
        "Scale-driven cost cuts can still be eaten by further price declines.",
        "CATL’s bargaining power is described as stronger than some vehicle suppliers.",
      ],
      inferences: [
        "A niche with a clearer structure may deserve a steadier valuation than a narrative brand. The piece points at guidance as the next evidence, not a multiple.",
        "Calling the industry involution does not replace a margin test.",
      ],
      relevance: [
        {
          label: "Margins",
          kind: "fact",
          text: "Gross-margin stability is the profitability evidence, ahead of delivery growth.",
        },
        {
          label: "Competition",
          kind: "fact",
          text: "Product mix and options are a different contest from scale and cost.",
        },
        {
          label: "Cash flow",
          kind: "inference",
          text: "Order headlines can flatter cash if collections lag.",
        },
      ],
      watch: [
        "Next quarter’s guidance, not the launch.",
        "Whether scale savings survive the next price cut.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "Why are BYD and Li Auto not in the same price war?",
        [
          "One competes on scale and cost, the other on mix and options",
          "They sell the same car",
          "Neither has suppliers",
          "Both ignore gross margin",
        ],
        0,
        "规模成本对产品结构和选配。",
        "一个拼规模和成本，一个拼产品结构和选配。",
        "价格战"
      ),
      q(
        "vocabulary",
        "什么比交付增长更能说明盈利能力？",
        ["毛利率站稳", "发布会", "口号", "办公室"],
        0,
        "毛利率站稳。",
        "毛利率站稳，比交付增长更能说明盈利能力。",
        "毛利率"
      ),
      q(
        "business",
        "内卷在文中不能替代什么？",
        ["对毛利率的检验", "公司名称", "季度", "供应商这个词"],
        0,
        "说法不能替代毛利率能否站住。",
        "有人把价格战说成内卷，投资人仍要检验毛利率能否站住。",
        "内卷"
      ),
      q(
        "recognition",
        "现金流要看什么，不要只看什么？",
        ["看回款，不要只看订单新闻", "只看发布会", "只看参数", "只看补贴"],
        0,
        "回款，而不是订单新闻。",
        "现金流要看回款，不要只看订单新闻。",
        "回款"
      ),
      q(
        "context",
        "下一季更该看什么？",
        ["指引", "发布会", "样机颜色", "演示次数"],
        0,
        "看指引，不是发布会。",
        "下一季，投资人要看的是指引，而不是发布会。",
        "指引"
      ),
    ],
  },
  {
    id: "ev-adas",
    titleCn: "智驾供应商的订单好看，回款才是估值锚",
    titleEn: "For intelligent-driving suppliers, collections — not orders — are the valuation anchor",
    sourceId: "zhidx",
    publishedAt: "2026-10-16T04:50:00+08:00",
    category: "ev",
    subcategory: "Intelligent driving",
    tags: ["Orders", "Collections", "Outbound"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Large orders can sit on strict revenue recognition. Chip companies and software stacks are not one business, and overseas orders bring certification cost.",
    summaryCn: "订单金额可以很大，确认收入的条件却很严。芯片公司和软件方案不是一种生意。出海会带来认证成本。",
    whyItMatters:
      "If penetration rises faster than collections, the supplier’s cash flow deteriorates first.",
    lingo: ["订单", "回款", "估值", "收入确认", "渗透率", "现金流", "出海", "本地化", "毛利率"],
    entityIds: ["chenglu", "horizon"],
    relatedIds: ["ev-margins", "outbound-adas"],
    paragraphs: [
      [
        s(
          "Chenglu Technology’s order value is large, but the conditions for recognizing revenue are strict.",
          "澄路科技 的 订单 金额 很 大 ， 收入确认 的 条件 却 很 严 。",
          true
        ),
        s(
          "Automakers tie acceptance, yield, and feature milestones together.",
          "车厂 把 验收 、 良率 和 功能 里程碑 绑在 一起 。"
        ),
      ],
      [
        s(
          "Intelligent driving is part of vehicle differentiation, and part of capex.",
          "智驾 是 整车 差异化 的 一部分 ， 也 是 资本开支 的 一部分 。"
        ),
        s(
          "If penetration rises faster than collections, the supplier’s cash flow deteriorates first.",
          "如果 渗透率 提升 快于 回款 ， 供应商 的 现金流 会 先 变 差 。",
          true
        ),
      ],
      [
        s(
          "Chip companies such as Horizon Robotics and software-stack companies are not the same business.",
          "地平线机器人 这样 的 芯片 公司 ， 和 软件 方案 公司 不是 一种 生意 。"
        ),
        s(
          "Valuing them as one track tends to overestimate software gross margin.",
          "把 它们 放在 一个 赛道 里 估值 ， 容易 高估 软件 的 毛利率 。"
        ),
      ],
      [
        s(
          "Investors should separate the data loop from dependence on the automaker.",
          "投资人 应 把 数据 闭环 和 对 车厂 的 依赖 分开 看 。"
        ),
        s(
          "Going overseas can bring new orders, and also localization and certification costs.",
          "出海 能 带来 新 订单 ， 也 会 带来 本地化 和 认证 成本 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "A large order can still have strict revenue recognition.",
        cn: "订单可以很大，收入确认的条件仍然很严。",
      },
      {
        en: "Penetration ahead of collections hurts supplier cash first.",
        cn: "渗透率快于回款时，供应商现金流先变差。",
      },
      {
        en: "A chip company and a software stack are not one valuation.",
        cn: "芯片公司和软件方案不是一种生意，放在一起容易高估软件毛利率。",
      },
      {
        en: "Overseas orders arrive with localization and certification costs.",
        cn: "出海的新订单带着本地化和认证成本。",
      },
    ],
    investor: {
      facts: [
        "In the demo case, order value is large and recognition conditions are strict.",
        "Acceptance, yield, and feature milestones are tied together.",
        "Overseas expansion adds localization and certification cost.",
      ],
      inferences: [
        "Grouping chip vendors and software stacks in one multiple likely flatters software margin.",
        "Dependence on the automaker can matter more than a celebrated data loop. The piece says to separate them.",
      ],
      relevance: [
        {
          label: "Monetization",
          kind: "fact",
          text: "Revenue waits on acceptance, not on the order announcement.",
        },
        {
          label: "Cash flow",
          kind: "inference",
          text: "Faster penetration than collections is a cash risk for the supplier.",
        },
        {
          label: "Competition",
          kind: "fact",
          text: "Horizon-like chip businesses and software schemes are different businesses.",
        },
      ],
      watch: [
        "The recognition clause, not the order headline.",
        "Certification cost on any overseas order.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What is the valuation anchor in the headline’s argument?",
        ["The order headline", "Collections", "A launch event", "Parameter count"],
        1,
        "回款才是估值锚。",
        "澄路科技的订单金额很大，收入确认的条件却很严。",
        "回款"
      ),
      q(
        "vocabulary",
        "渗透率提升快于回款时，谁的现金流先变差？",
        ["供应商", "无关的零售店", "出版社", "没有人"],
        0,
        "供应商先变差。",
        "如果渗透率提升快于回款，供应商的现金流会先变差。",
        "渗透率"
      ),
      q(
        "business",
        "把芯片公司和软件方案放在一个赛道里，容易高估什么？",
        ["软件毛利率", "办公室租金", "关税为零", "良率已经完成"],
        0,
        "容易高估软件毛利率。",
        "把它们放在一个赛道里估值，容易高估软件的毛利率。",
        "毛利率"
      ),
      q(
        "recognition",
        "车厂把哪三件事绑在一起？",
        ["验收、良率和功能里程碑", "logo、口号和颜色", "补贴、罚款和昵称", "城市、天气和班次"],
        0,
        "验收、良率、功能里程碑。",
        "车厂把验收、良率和功能里程碑绑在一起。",
        "验收"
      ),
      q(
        "context",
        "出海带来新订单的同时，还带来什么？",
        ["本地化和认证成本", "自动的利润", "取消的验收", "更短的法律意见书"],
        0,
        "本地化和认证成本。",
        "出海能带来新订单，也会带来本地化和认证成本。",
        "出海"
      ),
    ],
  },
  {
    id: "consumer-brand",
    titleCn: "下沉市场不再只是渠道故事，品牌集中度在上升",
    titleEn: "Lower-tier markets are no longer only a channel story. Brand concentration is rising.",
    sourceId: "qdaily",
    publishedAt: "2026-10-15T18:30:00+08:00",
    category: "consumer",
    subcategory: "Brands",
    tags: ["Lower-tier", "Repeat purchase", "M&A"],
    difficulty: "foundational",
    readingMinutes: 7,
    summaryEn:
      "Channels can still open. Concentration decides who keeps the profit. Investors used to pay for penetration; they are more willing to pay for repeat purchase.",
    summaryCn: "渠道还能铺开，集中度决定谁留下利润。投资人过去为渗透率付钱，现在更愿意为复购付钱。",
    whyItMatters:
      "In fragmented categories, M&A may beat organic growth — but a brand without cash flow is rarely the buyer.",
    lingo: ["下沉市场", "集中度", "渗透率", "复购", "客单价", "毛利率", "并购", "现金流"],
    entityIds: ["popmart"],
    relatedIds: ["instant-retail", "outbound-consumer"],
    paragraphs: [
      [
        s(
          "Growth in lower-tier markets is still there, but customer acquisition is no longer cheap.",
          "下沉市场 的 增长 还 在 ， 但 获客 已经 不 便宜 。",
          true
        ),
        s(
          "Channels can be rolled out. Brand concentration decides who keeps the profit.",
          "渠道 可以 铺开 ， 品牌 集中度 才 决定 谁 留得下 利润 。"
        ),
      ],
      [
        s(
          "What Pop Mart demonstrates is product power and repeat purchase, not channel density itself.",
          "泡泡玛特 证明 的 是 产品力 和 复购 ， 不是 渠道 密度 本身 。"
        ),
        s(
          "If average order value depends on promotions, gross margin shows itself the next quarter.",
          "如果 客单价 依靠 促销 ， 毛利率 会 在 下一季 露出 来 。",
          true
        ),
      ],
      [
        s(
          "Investors used to pay for penetration. They are now more willing to pay for repeat purchase.",
          "投资人 过去 愿意 为 渗透率 付钱 ， 现在 更 愿意 为 复购 付钱 。"
        ),
        s(
          "This is a change in method, not the disappearance of demand.",
          "这 是 方法 的 变化 ， 不是 需求 消失 。"
        ),
      ],
      [
        s(
          "In fragmented categories, M&A will be more common than organic growth.",
          "竞争格局 分散 的 品类 ， 并购 会 比 内生 增长 更 常见 。"
        ),
        s(
          "A brand without cash flow is unlikely to be the buyer.",
          "没有 现金流 的 品牌 ， 很难 成为 并购 里 的 买方 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Lower-tier growth remains, but acquisition is no longer cheap.",
        cn: "下沉市场还有增长，获客已经不便宜。",
      },
      {
        en: "Concentration, not doors opened, decides who keeps profit.",
        cn: "决定利润的是集中度，不是渠道铺开本身。",
      },
      {
        en: "The paid-for metric is shifting from penetration to repeat purchase.",
        cn: "投资人从为渗透率付钱，转向为复购付钱。",
      },
      {
        en: "Fragmented categories invite M&A. Cash flow decides who can buy.",
        cn: "分散品类里并购更常见，没有现金流就很难当买方。",
      },
    ],
    investor: {
      facts: [
        "Lower-tier growth is described as still present, with acquisition no longer cheap.",
        "Pop Mart is cited for product power and repeat purchase, not channel density.",
        "Promotion-led order value is said to reveal gross margin the next quarter.",
      ],
      inferences: [
        "Paying for repeat purchase rather than penetration is a change in method. The piece does not claim demand disappeared.",
        "In fragmented categories the likely buyer is the one with cash flow, so many brands are sellers, not acquirers.",
      ],
      relevance: [
        {
          label: "Competition",
          kind: "fact",
          text: "Brand concentration decides who keeps profit after channels are opened.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Promotion-supported order value is a weak guide to next quarter’s gross margin.",
        },
        {
          label: "M&A",
          kind: "inference",
          text: "Fragmentation raises the odds of deals; cash decides the buyer.",
        },
      ],
      watch: [
        "Repeat purchase, not doors opened.",
        "Next quarter’s gross margin if promotions carried the order value.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What decides who keeps the profit after channels open?",
        ["Brand concentration", "The number of press releases", "Office size", "A slogan"],
        0,
        "集中度决定谁留下利润。",
        "渠道可以铺开，品牌集中度才决定谁留得下利润。",
        "集中度"
      ),
      q(
        "vocabulary",
        "泡泡玛特在文中证明的是什么？",
        ["产品力和复购", "渠道密度本身", "补贴永远有效", "资本开支为零"],
        0,
        "产品力和复购，不是渠道密度本身。",
        "泡泡玛特证明的是产品力和复购，不是渠道密度本身。",
        "复购"
      ),
      q(
        "business",
        "投资人现在更愿意为什么付钱？",
        ["复购", "只为渗透率", "只为发布会", "只为口号"],
        0,
        "更愿意为复购付钱。",
        "投资人过去愿意为渗透率付钱，现在更愿意为复购付钱。",
        "渗透率"
      ),
      q(
        "recognition",
        "客单价依靠促销时，下一季会露出什么？",
        ["毛利率", "一个新logo", "备案编号", "样机"],
        0,
        "毛利率会露出来。",
        "如果客单价依靠促销，毛利率会在下一季露出来。",
        "毛利率"
      ),
      q(
        "context",
        "没有现金流的品牌，在并购里通常很难成为什么？",
        ["买方", "一个名词", "一个季度", "一个渠道"],
        0,
        "很难成为买方。",
        "没有现金流的品牌，很难成为并购里的买方。",
        "并购"
      ),
    ],
  },
  {
    id: "instant-retail",
    titleCn: "即时零售的单均成本，终于被问到小数点",
    titleEn: "Instant retail’s cost per order is finally being questioned at the decimal place",
    sourceId: "huxiu",
    publishedAt: "2026-10-16T06:30:00+08:00",
    category: "consumer",
    subcategory: "Instant retail",
    tags: ["Unit economics", "Fulfillment", "Subsidies"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "Orders are still growing. Cost per order is no longer waved through. Penetration alone overestimates profitability.",
    summaryCn: "订单还在增长，单均成本不再被放过。只看渗透率，会高估这个模式的盈利能力。",
    whyItMatters:
      "After subsidies recede, the judgment returns to contribution profit — not to pre-subsidy growth.",
    lingo: ["即时零售", "单均成本", "补贴", "单位经济", "渗透率", "盈利能力", "贡献利润", "降本增效"],
    entityIds: ["meituan"],
    relatedIds: ["local-profit", "consumer-brand"],
    paragraphs: [
      [
        s(
          "Instant-retail orders are still growing. Cost per order is no longer being waved through.",
          "即时零售 的 订单 还 在 增长 ， 单均成本 却 不再 被 放过 。",
          true
        ),
        s(
          "After subsidies receded, unit economics moved to the first page of the call.",
          "补贴 退潮 之后 ， 单位经济 被 放到 电话会 的 第一 页 。"
        ),
      ],
      [
        s(
          "Fulfillment cost, spoilage, and average order value have to be read together.",
          "履约 成本 、 损耗 和 客单价 ， 要 放在 一起 看 。"
        ),
        s(
          "If you look only at penetration, you will overestimate the model’s profitability.",
          "如果 只 看 渗透率 ， 你 会 高估 这个 模式 的 盈利能力 。",
          true
        ),
      ],
      [
        s(
          "Meituan’s scale is an advantage, and it also magnifies the efficiency question for the whole industry.",
          "美团 的 规模 是 优势 ， 也 把 效率 问题 放大 给 整个 行业 看 。"
        ),
        s(
          "If a smaller platform cannot cut cost and raise efficiency, cash flow breaks before the story does.",
          "小 平台 如果 不能 降本增效 ， 现金流 会 比 故事 先 断裂 。"
        ),
      ],
      [
        s(
          "Regulation has not disappeared. It has moved from a fines narrative to operating constraints.",
          "监管 并 没有 消失 ， 只是 从 罚款 叙事 转到 了 经营 约束 。"
        ),
        s(
          "The judgment should return to contribution profit, not to pre-subsidy growth.",
          "投资 判断 应 回到 贡献利润 ， 而 不是 回到 补贴 前 的 增长 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "Cost per order is now a first-page question.",
        cn: "单均成本被放到了电话会的第一页。",
      },
      {
        en: "Fulfillment, spoilage, and order value belong in one view.",
        cn: "履约成本、损耗和客单价要放在一起看。",
      },
      {
        en: "Penetration alone overestimates profitability.",
        cn: "只看渗透率会高估盈利能力。",
      },
      {
        en: "Return the judgment to contribution profit.",
        cn: "判断应回到贡献利润，而不是补贴前的增长。",
      },
    ],
    investor: {
      facts: [
        "Orders are still growing, and cost per order is no longer ignored.",
        "Unit economics moved to the first page after subsidies receded.",
        "Regulation is described as shifting from fines to operating constraints.",
      ],
      inferences: [
        "Meituan’s scale makes the efficiency question visible for smaller platforms. That is an industry reading, not a forecast of any one company’s cash balance.",
        "A smaller platform that cannot improve efficiency may run out of cash before the story ends.",
      ],
      relevance: [
        {
          label: "Unit economics",
          kind: "fact",
          text: "Fulfillment, spoilage, and order value have to be read together.",
        },
        {
          label: "Margins",
          kind: "inference",
          text: "Penetration is a poor proxy for profitability in this model.",
        },
        {
          label: "Regulation",
          kind: "fact",
          text: "The constraint is operational, not only a fine.",
        },
      ],
      watch: [
        "Cost per order at the decimal, not the order-growth headline.",
        "Contribution profit versus any pre-subsidy growth chart.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What moved to the first page of the call?",
        ["Unit economics", "A logo review", "Parameter rank", "Office design"],
        0,
        "补贴退潮后，单位经济到了第一页。",
        "补贴退潮之后，单位经济被放到电话会的第一页。",
        "单位经济"
      ),
      q(
        "vocabulary",
        "只看渗透率会怎样？",
        ["高估盈利能力", "自动看清现金流", "取消损耗", "提高良率"],
        0,
        "会高估盈利能力。",
        "如果只看渗透率，你会高估这个模式的盈利能力。",
        "渗透率"
      ),
      q(
        "business",
        "哪三样要放在一起看？",
        ["履约成本、损耗和客单价", "口号、颜色和城市", "参数、演示和排名", "罚款、备案和样机"],
        0,
        "履约、损耗、客单价。",
        "履约成本、损耗和客单价，要放在一起看。",
        "客单价"
      ),
      q(
        "recognition",
        "小平台不能降本增效时，什么会先断裂？",
        ["现金流", "故事的标题", "行业名称", "电话会的页码"],
        0,
        "现金流比故事先断裂。",
        "小平台如果不能降本增效，现金流会比故事先断裂。",
        "降本增效"
      ),
      q(
        "context",
        "投资判断应该回到哪里？",
        ["贡献利润", "补贴前的增长", "只看订单标题", "只看罚款叙事"],
        0,
        "回到贡献利润。",
        "投资判断应回到贡献利润，而不是回到补贴前的增长。",
        "贡献利润"
      ),
    ],
  },
  {
    id: "outbound-adas",
    titleCn: "一家智驾公司在东南亚的本地化账本",
    titleEn: "A Chinese intelligent-driving company’s localization ledger in Southeast Asia",
    sourceId: "36kr",
    publishedAt: "2026-10-16T08:05:00+08:00",
    category: "outbound",
    subcategory: "Mobility",
    tags: ["Localization", "Cash", "Terms"],
    difficulty: "advanced",
    readingMinutes: 8,
    summaryEn:
      "Southeast Asia is an operating curve, not a brand campaign. New orders improve the story and consume cash first. Do not extrapolate domestic gross margin.",
    summaryCn: "东南亚是一条经营曲线，不是品牌宣传。新订单先消耗现金流。国内毛利率不能外推。",
    whyItMatters:
      "The memo should break out overseas cash burn. Channel control and technology control are different lines in the terms.",
    lingo: ["出海", "本地化", "现金流", "回款", "单位经济", "毛利率", "关税", "控制权", "条款"],
    entityIds: ["chenglu", "pony"],
    relatedIds: ["ev-adas", "outbound-consumer"],
    paragraphs: [
      [
        s(
          "Chenglu Technology treats Southeast Asia as its first overseas operating curve, not as brand publicity.",
          "澄路科技 把 东南亚 当成 第一 条 出海 曲线 ， 而 不是 品牌 宣传 。",
          true
        ),
        s(
          "Localization cost sits in certification, service, and data compliance, not in the launch event.",
          "本地化 的 成本 在 认证 、 售后 和 数据 合规 ， 不 在 发布会 。"
        ),
      ],
      [
        s(
          "New orders can improve the growth story, and they consume cash flow first.",
          "新 订单 能 改善 增长 故事 ， 却 会 先 消耗 现金流 。",
          true
        ),
        s(
          "If the collection cycle is longer than at home, unit economics have to be rebuilt.",
          "如果 回款 周期 长于 国内 ， 单位经济 要 单独 重算 。"
        ),
      ],
      [
        s(
          "Whether partners care more about channel control or technology control gets written into the terms.",
          "合伙人 更 在意 渠道 控制权 ， 还是 技术 控制权 ， 会 写进 条款 。"
        ),
        s(
          "Tariffs and local assembly change gross margin. Domestic gross margin should not be extrapolated.",
          "关税 和 本地 组装 会 改变 毛利率 ， 不能 用 国内 毛利率 外推 。"
        ),
      ],
      [
        s(
          "Companies such as Pony.ai have already shown that going overseas is an operating problem.",
          "小马智行 一类 公司 已经 说明 ， 出海 是 运营 问题 。",
          true
        ),
        s(
          "The memo should break out overseas cash burn. Do not fold it into the group narrative.",
          "备忘录 应 单列 海外 现金 消耗 ， 不要 并进 集团 故事 。"
        ),
      ],
    ],
    takeaways: [
      {
        en: "Treat the overseas market as an operating curve, not publicity.",
        cn: "出海曲线是经营，不是品牌宣传。",
      },
      {
        en: "Localization cost sits in certification, service, and data compliance.",
        cn: "本地化成本在认证、售后和数据合规。",
      },
      {
        en: "New orders consume cash first. Rebuild unit economics if collections are slower.",
        cn: "新订单先消耗现金；回款更长就要重算单位经济。",
      },
      {
        en: "Break out overseas cash burn. Do not extrapolate domestic gross margin.",
        cn: "海外现金消耗要单列，国内毛利率不能外推。",
      },
    ],
    investor: {
      facts: [
        "In the demo case, Southeast Asia is framed as an operating curve.",
        "Localization cost is placed in certification, service, and data compliance.",
        "Tariffs and local assembly are said to change gross margin.",
      ],
      inferences: [
        "A longer collection cycle means domestic unit economics do not travel. That follows from the piece; it is not a measured regional average.",
        "Channel control and technology control can diverge inside one partnership. The terms are where that shows up.",
      ],
      relevance: [
        {
          label: "Cash flow",
          kind: "fact",
          text: "New orders consume cash before they improve the story’s substance.",
        },
        {
          label: "Margins",
          kind: "fact",
          text: "Domestic gross margin is the wrong extrapolator once tariffs and local assembly enter.",
        },
        {
          label: "Deal terms",
          kind: "inference",
          text: "Who controls the channel versus the technology will decide the partnership’s economics.",
        },
      ],
      watch: [
        "A separate overseas cash line in the memo.",
        "Whether the collection cycle is actually longer than at home.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "Where does localization cost actually sit?",
        [
          "In certification, service, and data compliance",
          "In the launch event",
          "Only in the logo",
          "In domestic gross margin automatically",
        ],
        0,
        "在认证、售后和数据合规，不在发布会。",
        "本地化的成本在认证、售后和数据合规，不在发布会。",
        "本地化"
      ),
      q(
        "vocabulary",
        "新订单对现金流的第一作用是什么？",
        ["先消耗", "立刻转正且无需重算", "取消关税", "替代验收"],
        0,
        "先消耗现金流。",
        "新订单能改善增长故事，却会先消耗现金流。",
        "现金流"
      ),
      q(
        "business",
        "回款周期长于国内时，单位经济要怎样？",
        ["单独重算", "继续用国内数字", "忽略", "改成补贴"],
        0,
        "要单独重算。",
        "如果回款周期长于国内，单位经济要单独重算。",
        "单位经济"
      ),
      q(
        "recognition",
        "条款里会写清合伙人更在意什么？",
        ["渠道控制权还是技术控制权", "办公室颜色", "演示时长", "参数昵称"],
        0,
        "渠道控制权还是技术控制权。",
        "合伙人更在意渠道控制权，还是技术控制权，会写进条款。",
        "控制权"
      ),
      q(
        "context",
        "为什么不能用国内毛利率外推？",
        ["关税和本地组装会改变毛利率", "因为毛利率没有定义", "因为没有订单", "因为监管已经取消"],
        0,
        "关税和本地组装会改变它。",
        "关税和本地组装会改变毛利率，不能用国内毛利率外推。",
        "关税"
      ),
    ],
  },
  {
    id: "outbound-consumer",
    titleCn: "消费品牌出海：关税、渠道押金和本地团队",
    titleEn: "Consumer brands going overseas: tariffs, channel deposits, and local teams",
    sourceId: "chinaventure",
    publishedAt: "2026-10-15T17:20:00+08:00",
    category: "outbound",
    subcategory: "Consumer",
    tags: ["Tariffs", "Channel", "Repeat purchase"],
    difficulty: "intermediate",
    readingMinutes: 7,
    summaryEn:
      "The lesson from Anker is a local supply chain, not a marketplace storefront. Channel deposits happen before revenue, and tariffs hit gross margin directly.",
    summaryCn: "安克创新的启示是本地供应链，不是一个平台店铺。渠道押金先于收入，关税直接打到毛利率。",
    whyItMatters:
      "Do not fill in the valuation before two quarters of repeat purchase. Overseas revenue mix understates early cash pressure.",
    lingo: ["出海", "关税", "渠道", "毛利率", "现金流", "复购", "并购", "控制权", "估值"],
    entityIds: ["anker", "anji"],
    relatedIds: ["consumer-brand", "outbound-adas"],
    paragraphs: [
      [
        s(
          "The lesson Anker offers later arrivals is not a marketplace storefront. It is a local supply chain.",
          "安克创新 给 后来者 的 启示 ， 不是 一个 平台 店铺 ， 而是 本地 供应链 。",
          true
        ),
        s(
          "When Anji Brands enters a new market, channel deposits happen before revenue.",
          "岸集品牌 进入 新 市场 时 ， 渠道 押金 先于 收入 发生 。"
        ),
      ],
      [
        s(
          "A rise in tariffs hits gross margin directly. Promotions do not earn it back.",
          "关税 上升 会 直接 打到 毛利率 ， 促销 补 不 回来 。",
          true
        ),
        s(
          "If the local team has no pricing power, the headquarters brand story gets distorted.",
          "如果 本地 团队 没有 定价权 ， 总部 的 品牌 故事 就 会 失真 。"
        ),
      ],
      [
        s(
          "Investors should split overseas expansion into three schedules: channel, product, and compliance.",
          "投资人 应 把 出海 分成 渠道 、 产品 和 合规 三 张 表 。"
        ),
        s(
          "Looking only at the overseas revenue mix underestimates early cash-flow pressure.",
          "只 看 海外 收入 占比 ， 会 低估 前期 现金流 压力 。"
        ),
      ],
      [
        s(
          "Buying a local channel is one path. Control and integration are not cheap.",
          "并购 当地 渠道 是 一条 路 ， 但 控制权 和 整合 都 不 便宜 。"
        ),
        s(
          "Before two quarters of repeat purchase are visible, the valuation should not be filled in.",
          "在 看到 两个 季度 的 复购 之前 ， 估值 不宜 给满 。",
          true
        ),
      ],
    ],
    takeaways: [
      {
        en: "A storefront is not a local supply chain.",
        cn: "平台店铺不是本地供应链。",
      },
      {
        en: "Channel deposits precede revenue, and tariffs hit gross margin directly.",
        cn: "渠道押金先于收入，关税直接打到毛利率。",
      },
      {
        en: "Without local pricing power, the brand story from headquarters goes false.",
        cn: "本地团队没有定价权，总部的品牌故事会失真。",
      },
      {
        en: "Wait for two quarters of repeat purchase before filling in the valuation.",
        cn: "看到两个季度的复购之前，估值不宜给满。",
      },
    ],
    investor: {
      facts: [
        "Anker is cited for a local supply chain, not a storefront.",
        "In the demo case, channel deposits occur before revenue.",
        "Tariffs are said to hit gross margin directly, with promotions unable to earn it back.",
      ],
      inferences: [
        "Overseas revenue mix will understate early cash pressure. That is the article’s warning.",
        "Buying a channel does not price control and integration. Those costs are easy to leave out.",
      ],
      relevance: [
        {
          label: "Cash flow",
          kind: "fact",
          text: "Deposits and working capital arrive before revenue.",
        },
        {
          label: "Margins",
          kind: "fact",
          text: "Tariffs go straight to gross margin.",
        },
        {
          label: "M&A",
          kind: "inference",
          text: "Control and integration can erase the appeal of a local-channel acquisition.",
        },
      ],
      watch: [
        "Two quarters of repeat purchase before a full valuation.",
        "Whether the local team actually has pricing power.",
      ],
    },
    quiz: [
      q(
        "comprehension",
        "What is the lesson attributed to Anker?",
        [
          "A local supply chain, not a marketplace storefront",
          "Publicity is enough",
          "Tariffs do not affect margin",
          "Deposits come after profit",
        ],
        0,
        "启示是本地供应链。",
        "安克创新给后来者的启示，不是一个平台店铺，而是本地供应链。",
        "供应链"
      ),
      q(
        "vocabulary",
        "渠道押金和收入谁先发生？",
        ["押金先于收入", "收入先于押金", "同时等于利润", "押金等于关税"],
        0,
        "押金先于收入。",
        "岸集品牌进入新市场时，渠道押金先于收入发生。",
        "渠道"
      ),
      q(
        "business",
        "关税上升时，促销能把毛利率补回来吗？",
        ["不能", "总能", "只在国内能", "只在复购为零时能"],
        0,
        "促销补不回来。",
        "关税上升会直接打到毛利率，促销补不回来。",
        "关税"
      ),
      q(
        "recognition",
        "本地团队没有定价权时，什么会失真？",
        ["总部的品牌故事", "季度名称", "供应链这个词的拼音", "电话会页码"],
        0,
        "品牌故事会失真。",
        "如果本地团队没有定价权，总部的品牌故事就会失真。",
        "定价权"
      ),
      q(
        "context",
        "看到什么之前，估值不宜给满？",
        ["两个季度的复购", "一次发布会", "一个店铺截图", "一份口号"],
        0,
        "两个季度的复购。",
        "在看到两个季度的复购之前，估值不宜给满。",
        "复购"
      ),
    ],
  },
];
