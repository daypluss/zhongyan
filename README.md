# Zhongyan 中研

A China business briefing for personal reading. The morning loop is a live article or a pasted one, the Chinese text, the business term in context, and a review that still knows the sentence you saved it from.

Articles are fetched through a relay you configure, or pasted on Import. They stay in this browser. The public site does not ship article text.

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

Progress, saved vocabulary, sector preferences, and reader settings stay in this browser (`localStorage`, key `zhongyan.v1`). There is no account. No environment variables are required to build.

Live articles and pasted imports are cached in IndexedDB (`zhongyan-live`) on this browser. The relay URL, optional relay token, and optional model API key are in `localStorage` under `zhongyan.connection`. None of those values are in the repository.

### GitHub Pages

The live site is [https://daypluss.github.io/zhongyan/](https://daypluss.github.io/zhongyan/).

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow builds the static export and publishes `out/` with the official Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`). You can also run it from the Actions tab with **Run workflow**.

`next.config.ts` sets `basePath` and `assetPrefix` to `/zhongyan`, `images.unoptimized`, and `trailingSlash`. The reader is a static page at `/read/?id=…` that loads the article from this browser. The export includes `.nojekyll` so Pages serves the `_next` assets.

If the site is not publishing yet, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. GitHub Pages hosts the files; there is no production port or host to configure.

## How to use it

1. **Settings** — save a relay URL. Optional: a relay token, a study-model key, and **Sectors**.
2. **Briefing** — **Fetch latest** loads the six sources through that relay. Sector chips show what you cover. **Edit sectors** (also under Settings → Sectors) changes the ranking and the “Your sectors” filter. With no relay, the briefing points at Settings.
3. **Read** — everything stored in this browser. Open an item at `/read/?id=…`.
4. **Import** — paste Chinese text. No relay required.
5. Open an article. Turn on **Pinyin**, **English**, **Audio**, and **Learning mode**. Click a word to save it.
6. **Learn** holds the vault. **Daily review** cycles the saved terms.
7. **Explore** lists the ten sectors, companies named in stored articles, the business lexicon, opened items, and the source catalog.
8. **Progress** fills in only from articles you finish and terms you review.

`⌘K` searches this browser’s articles plus the lexicon. `?` lists shortcuts.

## Sectors

Sector preferences live in `localStorage` (`zhongyan.v1`, field `interests`). Onboarding sets them. After that, change them in either place:

- Briefing header: the sector chips and **Edit sectors**
- Settings: the **Sectors** section and **Edit sectors**

Both open the same picker. **Save** writes the selection. **Reset to defaults** restores AI, Semiconductors, VC & PE, and EV. **Redo onboarding** opens the full desk setup. The briefing reorders and filters as soon as the selection is saved.

## Live reading

Until you save a relay URL in **Settings**, the briefing explains that nothing is fetched. After you save one, **Fetch latest** loads the six sources below. Each item shows its real source, publish time, and a link to the original.

Opening an item asks the relay for the article page and runs the text through the reader: word segmentation, word-level pinyin, clickable definitions, and the business lexicon. If the page does not yield a readable article, the reader shows the feed text when the feed included it, or an excerpt, and always offers **Open original**. It does not fill in missing text.

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

Imported pieces, and live items you have opened, appear under **Saved / Imported** on Explore → Saved, and every stored item is on Read. Delete removes them from this browser.

## Study layer on real text

Segmentation is a forward longest match against the business lexicon and [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cc-cedict). The compact dictionary is `public/cedict.txt.gz`, loaded in the browser. CC-CEDICT is CC BY-SA 4.0. Attribution is in [`public/CEDICT-LICENSE.txt`](public/CEDICT-LICENSE.txt) and at the bottom of the reader.

Click a word for pinyin and a gloss. Business terms use the lexicon. **Save to vault** puts the word on the review schedule. A word that is only in CC-CEDICT keeps its gloss on the saved term so review can still show it.

Sentence translation, takeaways, **Why this matters**, names in the text, and a quiz run only if you add an API key in Settings. Gemini is the recommended default (`gemini-3.8-flash`) and is called from this browser, so it does not need the relay. OpenAI and DeepSeek still go through the relay. The key stays in `localStorage`. Nothing in the app stores or logs it. The browser drops lines that are not supported by the article text, drops names that are not in the text, and labels inferences separately from reported facts. Without a key, those sections ask you to add one. They do not invent a summary. Word glosses and business lingo do not use the key.

Companies on Explore are names found in stored articles: a lexicon entry whose category is an entity, or a name returned by the study model that actually occurs in the text.

## Personal use

This is for one person's reading. Do not republish fetched articles, and do not commit article text. `node scripts/check-no-fetched-content.mjs` (also run by the Pages workflow after the static export) fails the build if a fetched fixture path or a marker string lands in the app, the relay source, or `out/`. Feed addresses in the source are public URLs, not article bodies.

## What stays in the repo

The source catalog, the ten sector categories, the business lexicon, and CC-CEDICT. None of those files contain fetched articles.

## Deferred

A research agent, scored pronunciation, accounts, company financials, and historical timelines are out of scope on purpose.
