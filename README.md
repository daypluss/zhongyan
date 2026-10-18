# Zhongyan 中研

A China business briefing that teaches professional Chinese. The morning loop is the product: a relevant story, the Chinese text, the business term in context, a short quiz, and a review that still knows the sentence you saved it from.

This edition is original study copy in the register of a China technology and investment desk. It is not live news, not a scrape, and not a filing. Deal stories use demo companies. Real companies appear only as landscape context. Anything labeled inference is inference.

## Deploy

### Local

```bash
npm install
npm run dev
```

The dev server listens on port 3847. The app uses the same `/zhongyan` base path as the public site. Open [http://127.0.0.1:3847/zhongyan/](http://127.0.0.1:3847/zhongyan/).

```bash
npm run build
```

`npm run build` writes a static export to `out/` (`output: "export"` in `next.config.ts`). Page and asset URLs are prefixed with `/zhongyan`. To preview that folder, serve `out` with any static file server and open `/zhongyan/`.

Progress, saved vocabulary, and reader settings stay in this browser (`localStorage`, key `zhongyan.v1`). There is no account. No environment variables are required.

### GitHub Pages

The live site is [https://daypluss.github.io/zhongyan/](https://daypluss.github.io/zhongyan/).

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow builds the static export and publishes `out/` with the official Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`). You can also run it from the Actions tab with **Run workflow**.

`next.config.ts` sets `basePath` and `assetPrefix` to `/zhongyan`, `images.unoptimized`, and `trailingSlash`. Article, topic, and company pages are pre-rendered from the seed data. The export includes `.nojekyll` so Pages serves the `_next` assets.

If the site is not publishing yet, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. GitHub Pages hosts the files; there is no production port or host to configure.

## How to use it

1. **Briefing** — Friday 16 October 2026 edition, grouped by sector. Filter by difficulty, unread, or saved. `j` / `k` / Enter move through the list.
2. **Read** — the full library, filterable by sector and level.
3. Open a story. Chinese is the body. Turn on **Pinyin** (word by word, bound to the word), **English** (sentence gloss, off by default), **Audio** (browser speech for key sentences), and **Learning mode** (business term, vocabulary, entity).
4. Click a word for pinyin, English, business usage, collocations, and an example. Save it.
5. Work through **Key Business Lingo**, the fact-versus-inference note, takeaways in English or 中文, and the quiz.
6. **Learn** holds the vault. **Daily review** cycles Chinese to English, English to Chinese, pinyin, audio, cloze, and usage.
7. **Explore** follows topics and companies. **Progress** shows domain proficiency only where you have actually read or saved something.

`⌘K` searches the edition. `?` lists shortcuts.

## What is in the box

Twenty Simplified Chinese articles across AI, venture and private equity, internet and software, semiconductors, EVs, consumer, robotics, policy, macro, and outbound activity. Vocabulary is segmented in the source so pinyin attaches to words such as 供应链 and 毛利率, not to each character.

AI helpers (summary, quiz, segmentation, examples) are typed mocks in `lib/ai`. A future news feed would implement `ArticleIngestionAdapter` in `lib/ingestion`. Research dossiers in `lib/research` return linked stories and terms, and say clearly that a live dossier is not enabled.

## Deferred

Live ingestion, a real research agent, scored pronunciation, accounts, company financials, and historical timelines are out of this edition on purpose.
