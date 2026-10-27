import { lexemes } from "@/lib/data/lexicon";
import type { Lexeme } from "@/lib/types";

export type Token = {
  text: string;
  pinyin: string;
  english: string;
  business?: Lexeme;
};

type Entry = { pinyin: string; english: string };

const PUNCT = /^[\s，。、：；？！（）()【】《》〈〉「」『』“”‘’—…·,.!?;:、\-[\]"']$/u;

let dictionary = new Map<string, Entry>();

export function setDictionary(entries: Map<string, Entry>) {
  dictionary = entries;
}

const businessByWord = new Map(lexemes.filter((lex) => lex.kind === "business").map((lex) => [lex.chinese, lex]));
const entityByWord = new Map(lexemes.filter((lex) => lex.category === "entity").map((lex) => [lex.chinese, lex]));
const knownByWord = new Map(lexemes.filter((lex) => lex.kind !== "function").map((lex) => [lex.chinese, lex]));

export function lookupWord(word: string) {
  return knownByWord.get(word);
}

export function segmentText(text: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    if (PUNCT.test(char)) {
      tokens.push({ text: char, pinyin: "", english: "" });
      index += 1;
      continue;
    }
    let size = 1;
    const max = Math.min(text.length, index + 12);
    for (let end = max; end > index + 1; end -= 1) {
      const slice = text.slice(index, end);
      if (businessByWord.has(slice) || entityByWord.has(slice) || dictionary.has(slice)) {
        size = end - index;
        break;
      }
    }
    const word = text.slice(index, index + size);
    const business = businessByWord.get(word);
    const entity = entityByWord.get(word);
    const cedict = dictionary.get(word);
    const known = knownByWord.get(word);
    tokens.push({
      text: word,
      pinyin: business?.pinyin || entity?.pinyin || known?.pinyin || cedict?.pinyin || "",
      english: business?.english || entity?.english || known?.english || cedict?.english || "",
      business,
    });
    index += size;
  }
  return tokens;
}

export function splitSentences(text: string) {
  return text
    .split(/(?<=[。！？\n])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}
