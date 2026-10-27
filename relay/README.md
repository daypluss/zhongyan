# Zhongyan relay

A small Cloudflare Worker that lets the public Zhongyan site read a fixed list of feeds and article pages. Those sites do not send CORS headers, so the browser cannot fetch them directly.

The Worker does not store articles. It checks the host, fetches once, and can keep the response at the edge for about five minutes. Nothing is written to a database.

Allowed source hosts:

- `www.36kr.com`, `36kr.com`
- `www.tmtpost.com`, `tmtpost.com`
- `www.zhidx.com`, `zhidx.com`
- `www.199it.com`, `199it.com`
- `www.yicai.com`, `yicai.com`
- `feed.xyzfm.space`
- `www.xiaoyuzhoufm.com`, `xiaoyuzhoufm.com` (the 乱翻书 show page)

Requests must come from `https://daypluss.github.io` or from `localhost` / `127.0.0.1`. Any other origin is rejected.

## Deploy

From this folder:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Wrangler prints a URL like `https://zhongyan-relay.<account>.workers.dev`. Paste that URL into Zhongyan **Settings**. Do not put it in the git repo.

Optional shared token:

```bash
npx wrangler secret put RELAY_TOKEN
```

Type a long random string. Put the same string in Settings. If you skip this, the Worker accepts calls with no token.

The free Workers plan is enough. This app does not need a custom domain.

## Local check

```bash
npx wrangler dev
```

Then, from another terminal, call a feed with a localhost origin:

```bash
curl -sS -H "Origin: http://127.0.0.1:3847" \
  "http://127.0.0.1:8787/v1/feed?url=https%3A%2F%2Fwww.36kr.com%2Ffeed"
```

`/v1/article?url=` fetches one article page and returns the main text when Readability can see it. If the page is a script shell, the response is `extraction_failed` and the app shows the feed excerpt, or an empty state, plus the original link.

`/v1/ai` forwards one study request to OpenAI or DeepSeek. The key stays in the browser and is sent only for that request. The Worker does not save it. Gemini is not proxied: the app calls Google from the browser. A body of `{ "probe": true }` checks an OpenAI or DeepSeek key with a one-word request and stores nothing.

第一财经's JSON endpoint is unofficial. If it changes, that source fails on its own and the others still load.
