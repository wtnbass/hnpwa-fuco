import { html, defineElement, useProperty } from "fuco";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { Comment } from "./api";
import { useStyleString } from "./utils";
import style from "./hnpwa-comments.css";

function Comments() {
  useStyleString(style);

  const comments = useProperty<Comment[]>("comments");
  return html`
    <ul>
      ${repeat(
        comments,
        comment => comment.id,
        comment => html`
          <li>
            <details open>
              <summary>${comment.user} ${comment.time_ago}</summary>
              <p>
                ${html`
                  ${unsafeHTML(comment.content)}
                `}
              </p>
              <hnpwa-comments .comments=${comment.comments}></hnpwa-comments>
            </details>
          </li>
        `
      )}
    </ul>
  `;
}

defineElement("hnpwa-comments", Comments);
