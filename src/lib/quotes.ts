import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { QuotesData, Quote, QuoteAuthor } from "./types";

let cachedData: QuotesData | null = null;

function loadQuotes(): QuotesData {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), "quotes.yaml");
  if (!fs.existsSync(filePath)) {
    return { authors: [], quotes: [] };
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = yaml.load(raw) as QuotesData;
  cachedData = data;
  return data;
}

export function getAllQuotes(): Quote[] {
  return loadQuotes().quotes || [];
}

export function getAllAuthors(): QuoteAuthor[] {
  return loadQuotes().authors || [];
}

export function getAuthorById(id: string): QuoteAuthor | undefined {
  return getAllAuthors().find((a) => a.id === id);
}

export function getRandomQuote(): { quote: Quote; author: QuoteAuthor | undefined } | null {
  const quotes = getAllQuotes();
  if (quotes.length === 0) return null;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const author = getAuthorById(quote.author);
  return { quote, author };
}

export function getQuotesByAuthor(authorId: string): Quote[] {
  return getAllQuotes().filter((q) => q.author === authorId);
}
