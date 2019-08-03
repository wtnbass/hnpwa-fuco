export type View = "news" | "newest" | "show" | "ask" | "jobs" | "items";

export interface Item {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: string;
  comments_count: number;
  type: "link" | "ask" | "job";
  url: string;
  domain?: string;
  content?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  level: number;
  user: string;
  time: number;
  time_ago: string;
  content: string;
  comments: Comment[];
}

const ENDPOINT = "https://node-hnapi.herokuapp.com";

export async function fetchList(view: View, page: number = 1) {
  const res = await fetch(`${ENDPOINT}/${view}?page=${page}`);
  const list = (await res.json()) as Item[];
  return list;
}

export async function fetchItem(itemId: string) {
  const res = await fetch(`${ENDPOINT}/item/${itemId}`);
  const item = (await res.json()) as Item;
  return item;
}
