import {
  html,
  defineElement,
  useAttribute,
  useState,
  useEffect,
  useMemo
} from "fuco";
import { repeat } from "lit-html/directives/repeat";
import { cache } from "lit-html/directives/cache";
import { fetchList, View, Item } from "./api";
import { useStyleString } from "./utils";
import style from "./hnpwa-list.css";

function List() {
  useStyleString(style);

  const view = useAttribute("view") as View;
  const page = useAttribute("page", value => Number(value) || 1);

  const [list, setList] = useState<Item[]>([]);
  useEffect(() => {
    fetchList(view, page).then(setList);
  }, [view, page]);

  const start = useMemo(() => {
    return 30 * (page - 1) + 1;
  }, [page]);

  return html`
    <ol start=${start}>
      ${repeat(
        list,
        item => item.id,
        item => html`
          <li class="item">
            ${cache(
              item.domain
                ? html`
                    <a
                      class="title"
                      href=${item.url}
                      rel="noopener"
                      target="_target"
                    >
                      ${item.title}
                    </a>
                    <small class="domain">(${item.domain})</small>
                  `
                : html`
                    <a class="title" href="#/items/${item.id}">
                      ${item.title}
                    </a>
                  `
            )}
            <div class="detail">
              <small>
                ${item.points} points by ${item.user} ${item.time_ago} |
                <a href="#/items/${item.id}" class="comments">
                  ${item.comments_count} comments
                </a>
              </small>
            </div>
          </li>
        `
      )}
    </ol>
  `;
}

defineElement("hnpwa-list", List);
