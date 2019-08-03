import { html, defineElement, useAttribute, useState, useEffect } from "fuco";
import { cache } from "lit-html/directives/cache";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { fetchItem, Item } from "./api";
import { useStyleString } from "./utils";
import style from "./hnpwa-item.css";

import "./hnpwa-comments";

function Item() {
  useStyleString(style);

  const itemId = useAttribute("item-id");
  const [item, setItem] = useState<Item | null>(null);
  useEffect(() => {
    if (itemId != null) {
      fetchItem(itemId).then(setItem);
    }
  }, [itemId]);

  if (item == null) return html``;

  return html`
    <h3 class="title">
      ${cache(
        item.content
          ? item.title
          : html`
              <a
                class="title"
                href="${item.url}"
                rel="noopener"
                target="_blank"
              >
                ${item.title}
              </a>
            `
      )}
    </h3>
    <small class="detail">
      ${item.points} points by ${item.user} ${item.time_ago} |
      ${item.comments_count} comments
    </small>
    ${cache(
      item.content
        ? html`
            <p>${unsafeHTML(item.content)}</p>
          `
        : html``
    )}
    <hnpwa-comments .comments=${item.comments}></hnpwa-comments>
  `;
}

defineElement("hnpwa-item", Item);
