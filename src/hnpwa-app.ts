import { html, defineElement, useState, useEffect, useMemo } from "fuco";
import { cache } from "lit-html/directives/cache";
import { View } from "./api";
import { useStyleString } from "./utils";
import style from "./hnpwa-app.css";

const getPathParams = () => {
  const paths = location.hash
    .slice(1)
    .replace(/^\//, "")
    .split("/");
  const view = (paths[0] || "news") as View;
  const page = paths[1];
  return { view, page };
};

function App() {
  useStyleString(style);

  const [param, setParam] = useState(getPathParams);
  useEffect(() => {
    const navigate = () => setParam(getPathParams());
    window.addEventListener("hashchange", navigate);
    navigate();
  }, []);

  useEffect(() => {
    if (param.view !== "items") import("./hnpwa-list");
    else import("./hnpwa-item");
  }, [param.view]);

  const currentPage = useMemo(() => {
    return Number(param.page) || 1;
  }, [param.page]);

  const prevLink = useMemo(() => {
    if (currentPage <= 2) return `#/${param.view}`;
    return `#/${param.view}/${currentPage - 1}`;
  }, [param.view, currentPage]);

  const nextLink = useMemo(() => {
    return `#/${param.view}/${currentPage + 1}`;
  }, [param.view, currentPage]);

  return html`
    <header class="header">
      <h1 class="header-logo">
        <a class="header-link" href="#/">
          <span>HN</span>
          <span>PWA</span>
        </a>
      </h1>
      <nav class="header-nav">
        <ul>
          <li class="header-tab"><a class="header-link" href="#/">Top</a></li>
          <li class="header-tab">
            <a class="header-link" href="#/newest">New</a>
          </li>
          <li class="header-tab">
            <a class="header-link" href="#/show">Show</a>
          </li>
          <li class="header-tab">
            <a class="header-link" href="#/ask">Ask</a>
          </li>
          <li class="header-tab">
            <a class="header-link" href="#/jobs">Jobs</a>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      ${cache(
        param.view !== "items"
          ? html`
              <hnpwa-list view=${param.view} page=${param.page}></hnpwa-list>
            `
          : html`
              <hnpwa-item item-id=${param.page}></hnpwa-item>
            `
      )}
    </main>
    <footer>
      ${cache(
        param.view !== "items"
          ? html`
              <nav class="pagenation">
                ${cache(
                  currentPage > 1
                    ? html`
                        <a class="pagenation-link" href=${prevLink}>
                          &lt;Prev
                        </a>
                      `
                    : html`
                        <span class="pagenation-link disable"> &lt;Prev </span>
                      `
                )}
                <a class="pagenation-link" href=${nextLink}>Next&gt;</a>
              </nav>
            `
          : html``
      )}
    </footer>
  `;
}

defineElement("hnpwa-app", App);
