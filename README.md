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

Progress, saved vocabulary, and reader settings stay in this browser (`localStorage`, key `zhongyan.v1`). There is no account. No environment variables are required to build or run the demo edition.

Live articles and pasted imports are cached in IndexedDB (`zhongyan-live`) on this browser. The relay URL, optional relay token, and optional model API key are in `localStorage` under `zhongyan.connection`. None of those values are in the repository.

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

## Live reading

The briefing has a **Live** section. Until you save a relay URL in **Settings**, that section explains that nothing is fetched. After you save one, Live loads the six sources below and becomes the top of the desk. Each item shows its real source, publish time, and a link to the original.

The **Demo** section is the original study edition. It stays labeled Demo, and a toggle hides it. Topic follows and interests still sort both the demo desk and the live items.

Opening a live item asks the relay for the article page and runs the text through the reader: word segmentation, word-level pinyin, clickable definitions, and the business lexicon. If the page does not yield a readable article, the reader shows the feed text when the feed included it, or an excerpt, and always offers **Open original**. It does not fill in missing text.

乱翻书 is a podcast. The item has an audio player and show notes, not an article body.

| Source | Feed |
| --- | --- |
| 36氪 | `https://www.36kr.com/feed` |
| 钛媒体 | `https://www.tmtpost.com/rss.xml` |
| 智东西 | `https://www.zhidx.com/rss` |
| 199IT | `https://www.199it.com/feed` |
| 第一财经 | `https://www.yicai.com/api/ajax/getlatest?page=1&pagesize=30` (unofficial JSON; a failure stays on this source) |
| 乱翻书 | `https://feed.xyzfm.space/yxuruh3f9mc4` |

These sites do not send CORS headers, so the public site cannot fetch them. A small Cloudflare Worker in [`relay/`](relay/) does. Deploy steps are in [`relay/README.md`](relay/README.md):

```bash
cd relay
npm install
npx wrangler login
npx wrangler deploy
```

Paste the printed `workers.dev` URL into **Settings**. Do not commit it. An optional shared token is `npx wrangler secret put RELAY_TOKEN` in `relay/`, then the same string in Settings.

The worker allowlists those hosts (and the article-page hosts they link to), accepts only `https://daypluss.github.io` plus localhost, caches successful feed and article responses at the edge for about five minutes, and stores nothing. It is not an open proxy.

## Import

**Import** in the nav takes pasted Chinese text, plus an optional title, source, and original URL. Pasting works with no relay. **Try the link** uses the relay when one is set; WeChat often refuses automated fetching, so the paste is the reliable path.

Imported pieces, and live items you have opened, appear under **Saved / Imported** on Read and on Explore → Saved. Delete removes them from this browser.

## Study layer on real text

Segmentation is a forward longest match against the business lexicon and [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cc-cedict). The compact dictionary is `public/cedict.txt.gz`, loaded in the browser. CC-CEDICT is CC BY-SA 4.0. Attribution is in [`public/CEDICT-LICENSE.txt`](public/CEDICT-LICENSE.txt) and at the bottom of the live reader.

Click a word for pinyin and a gloss. Business terms use the existing lexicon. **Save to vault** and daily review use the same schedule as the demo stories. A word that is only in CC-CEDICT keeps its gloss on the saved term so review can still show it.

Sentence translation, takeaways, **Why this matters**, and a quiz run only if you add an OpenAI or DeepSeek API key in Settings. The key stays in `localStorage`. The relay sends one fixed study prompt to that provider and does not store the key. The browser drops lines that are not supported by the article text, and labels inferences separately from reported facts. Without a key, those sections ask you to add one. They do not invent a summary.

## Personal use

This is for one person's reading. Do not republish fetched articles, and do not commit article text. `node scripts/check-no-fetched-content.mjs` (also run by the Pages workflow after the static export) fails the build if a fetched fixture path or a marker string lands in the app, the relay source, or `out/`. Feed addresses in the source are public URLs, not article bodies.

## What is in the box

Twenty Simplified Chinese articles across AI, venture and private equity, internet and software, semiconductors, EVs, consumer, robotics, policy, macro, and outbound activity. Vocabulary is segmented in the source so pinyin attaches to words such as 供应链 and 毛利率, not to each character.

Demo AI helpers (summary, quiz, segmentation, examples) are typed mocks in `lib/ai`. Research dossiers in `lib/research` return linked stories and terms, and say clearly that a live dossier is not enabled. Live study notes are separate: they call a provider only when a key is saved in Settings.

## Deferred

A research agent, scored pronunciation, accounts, company financials, and historical timelines are out of this edition on purpose.
