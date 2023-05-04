import { basename } from 'node:path';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { differenceInSeconds, parse } from 'date-fns';
import { e as error } from './index-39e97e00.js';
import { mkdir, stat, readdir, rm, readFile, writeFile } from 'node:fs/promises';
import { parse as parse$1 } from 'node-html-parser';
import Parser from 'rss-parser';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { C as Counter } from './counter-b37d52dc.js';
import { L as Logger } from './logger-515117da.js';

const ENABLED = private_env.NEWS_ENABLED === "1";
const SIMPLE_DETAILS = private_env.NEWS_SIMPLE_DETAILS === "1";
const CACHE_TIME = Number(private_env.NEWS_CACHE_TIME);
const CACHE_PATH = "data/news";
const DESCRIPTION_MATCHER = /<img src="https:\/\/www.srf.ch\/static\/cms\/images\/(.*?)".*?>(.*)/;
const logger = new Logger("NEWS");
const feeds = /* @__PURE__ */ new Map();
async function getFeed(feedId) {
  if (!ENABLED) {
    throw error(400, { message: "News module is disabled", key: "news.disabled" });
  }
  let feed = feeds.get(feedId);
  if (feed && differenceInSeconds(/* @__PURE__ */ new Date(), feed.cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached feed", feedId);
    return feed;
  }
  logger.info("Fetching feed", feedId);
  const startTime = process.hrtime.bigint();
  try {
    await mkdir(`${CACHE_PATH}/${feedId}`, { recursive: true });
    const { text } = await superagent.get(`https://www.srf.ch/news/bnf/rss/${feedId}`);
    const parser = new Parser({ customFields: { item: ["description"] } });
    const xmlFeed = await parser.parseString(text);
    const items = [];
    const rawItems = xmlFeed.items.filter((item) => !item.description.includes("Hier finden Sie")).slice(0, 10);
    for (const item of rawItems) {
      if (!item.guid || !item.title || !item.link) {
        continue;
      }
      const match = DESCRIPTION_MATCHER.exec(item.description);
      if (!match) {
        continue;
      }
      const id = createHash("shake256", { outputLength: 8 }).update(item.guid).digest("hex");
      const [, imgUrl, content] = match;
      const date = item.pubDate ? parse(item.pubDate.substring(5), "dd MMM yyyy HH:mm:ss x", /* @__PURE__ */ new Date()) : /* @__PURE__ */ new Date();
      await mkdir(`${CACHE_PATH}/${feedId}/${id}`, { recursive: true });
      const imgFileName = `${feedId}/${id}/${basename(imgUrl)}`;
      const imgFilePath = `${CACHE_PATH}/${imgFileName}`;
      if (!await stat(imgFilePath).catch(() => null)) {
        const stream = createWriteStream(imgFilePath);
        superagent.get(`https://www.srf.ch/static/cms/images/${imgUrl}`).pipe(stream);
        await new Promise((resolve) => stream.on("finish", () => resolve()));
      }
      items.push({
        id,
        ts: date,
        title: item.title,
        link: item.link,
        content: content || "",
        image: imgFileName
      });
    }
    const articles = await readdir(`${CACHE_PATH}/${feedId}`);
    for (const fileName of articles) {
      if (!items.some((item) => item.id === fileName)) {
        await rm(`${CACHE_PATH}/${feedId}/${fileName}`, { recursive: true, force: true });
      }
    }
    feed = { cachedAt: /* @__PURE__ */ new Date(), items, counter: feed?.counter || new Counter() };
    feed.counter.max = items.length;
    feeds.set(feedId, feed);
    return feed;
  } catch (err) {
    throw logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
async function getArticle(feedId, articleId) {
  if (!ENABLED) {
    throw error(400, { message: "News module is disabled", key: "news.disabled" });
  }
  const article = feeds.get(feedId)?.items.find((item) => item.id === articleId);
  if (!article) {
    throw error(404, {
      message: `Article ${articleId} in feed ${feedId} could not be found`,
      key: "news.articleNotFound",
      params: { feedId, articleId }
    });
  }
  logger.debug("Updating article", feedId, articleId);
  const startTime = process.hrtime.bigint();
  try {
    let page = "";
    const filePath = `${CACHE_PATH}/${feedId}/${articleId}/article.html`;
    if (await stat(filePath).catch(() => null)) {
      logger.debug("Using cached article file", feedId, articleId);
      page = await readFile(filePath, "utf-8");
    } else {
      logger.debug("Downloading article file", feedId, articleId);
      const { text } = await superagent.get(article.link);
      await writeFile(filePath, text, "utf-8");
      page = text;
    }
    const html = parse$1(page);
    const head = html.getElementsByTagName("head")[0];
    for (const script of head.getElementsByTagName("script")) {
      script.remove();
    }
    const body = html.getElementsByTagName("body")[0];
    const main = body.getElementsByTagName("main")[0];
    const title = main.getElementsByTagName("header")[0];
    const section = main.getElementsByTagName("section")[0];
    if (SIMPLE_DETAILS) {
      for (const div of body.getElementsByTagName("div")) {
        div.replaceWith('<span class="badge bg-dark mb-3">Element entfernt</span>');
      }
      for (const figure of body.getElementsByTagName("figure")) {
        figure.replaceWith('<span class="badge bg-dark mb-3">Bild/Video entfernt</span>');
      }
      title.getElementById("skiplink__contentlink")?.remove();
      body.childNodes = [title, section];
    } else {
      const header = main.getElementsByTagName("div")[0];
      const section2 = main.getElementsByTagName("section")[0];
      const config = body.getElementById("config__js");
      const scripts = body.getElementsByTagName("script");
      body.childNodes = [header, title, section2, config, ...scripts];
    }
    return { head: head.innerHTML, body: body.innerHTML.toString() };
  } catch (err) {
    throw logger.toSvelteError(err, { embedded: true });
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated article", feedId, articleId, diffTime, "ms");
  }
}

export { ENABLED as E, SIMPLE_DETAILS as S, getArticle as a, getFeed as g };
//# sourceMappingURL=news-95ed7b26.js.map
