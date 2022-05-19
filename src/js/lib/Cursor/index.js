const dontIndent = (str) => {
  return ("" + str).replace(/(\n)\s+/g, "$1");
};
const createNodeByHTMLString = (htmlString) => {
  document.body.insertAdjacentHTML("beforeend", htmlString);
  const node = [...document.body.children].reverse()[0];
  document.body.removeChild(node);
  return node;
};

export default class Cursor {
  constructor(config = {}) {
    if (document.querySelector(this.selectors.base)) {
      console.error('Cursor already present in DOM. Do you called "new Cursor()" twice in the page ???');
      return;
    }
    this.config = config;
    // one time only init
    this.injectCSS();
    this.crateNodes();
    // multiple times init
    this.media_query_watcher = new MediaQueryWatcher(
      this.config.mediaQueryString ?? "(min-width: 768px)",
      (isTruthy) => {
        if (isTruthy) {
          this.injectNodesToDom();
          this.subscribeEvents();
          this.config.afterMount?.(this.node);
          return;
        }
        this.beforeUnMount?.(this.node);
        this.subscribeEvents(false);
        this.injectNodesToDom(false);
      }
    );
  }
  crateNodes() {
    this.node = createNodeByHTMLString(
      this.createCursorHTML(this.config.cursorHTML)
    );
  }
  injectCSS() {
    this.nodeCSS = createNodeByHTMLString(`<style>${this.css}</style>`);
    document.body.appendChild(this.nodeCSS);
  }
  injectNodesToDom(force = true) {
    if (force) {
      document.body.classList.add(this.classes.cursor_active);
      document.body.appendChild(this.node);
    }
    else {
      document.body.classList.remove(this.classes.cursor_active);
      this.node?.parentElement?.removeChild(this.node);
    }
  }
  subscribeEvents(force = true) {
    if (force) {
      window.addEventListener("mousemove", this.onMove.bind(this));
    }
    else {
      window.removeEventListener("mousemove", this.onMove.bind(this));
    }
  }
  onMove(e) {
    // get node and configration
    const { node } = this;
    const { delay = 0 } = this.config;

    //get coordinates from event
    const { clientX: x, clientY: y } = e;

    //build custom properties
    const cssProps = [
      ["clientX", `${x}px`],
      ["clientY", `${y}px`],
    ];

    // inject props
    setTimeout(() => {
      cssProps.forEach(([name, value]) => {
        node.style.setProperty(`--${name}`, value);
      });
    }, delay);
  }

  //
  selectors = {
    base: ".cursor-container",
  };
  createCursorHTML = (cursorHTML) => `
  <div class="cursor-container">
    ${cursorHTML ?? `<div class="cursor"></div>`}
    <div class="cursor-dot"></div>
  </div>
  `;

  classes = {
    cursor_active: 'cursor-active'
  };

  css = `
  body.cursor-active,
  body.cursor-active * {
    cursor: none;
  }
  .cursor-container,
  .cursor,
  .cursor-dot {
    pointer-events: none;
  }
  .cursor-container {
    position: fixed;
    top: var(--clientY);
    left: var(--clientX);
    transform: translate(-50%, -50%);

    --cursor-width: 40vw;
    --cursor-height: var(--cursor-width);
    --cursor-bg: pink;
    --cursor-border-radius: 50%;
    --cursor-text: "I'm a cursor";
    
    --cursor-dot-bg: white;
    --cursor-dot-width: 5px;
    --cursor-dot-height: var(--cursor-dot-width);

  }

  .cursor-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--cursor-dot-bg);
    width: var(--cursor-dot-width);
    height: var(--cursor-dot-height);
    border-radius: var(--cursor-border-radius);
  }

  .cursor {
    width: var(--cursor-width);
    background: var(--cursor-bg);
    border-radius: var(--cursor-border-radius);
    overflow: hidden;
    display: grid;
    pointer-events: none;
  }

  .cursor::before, .cursor::after {
    grid-row: 1;
    grid-column: 1;
    justify-self: center;
    align-self: center;
    min-width: 0;
    min-height: 0;
  }
  .cursor::before {
    content: "";
    padding-bottom: var(--cursor-height);
    justify-self: stretch;
    z-index: -1;
  }
  .cursor::after {
    content: var(--cursor-text);
  }
  `;
}

class MediaQueryWatcher {
  constructor(mediaQueryString, callback) {
    this.callback = callback;
    this.mqw = window.matchMedia(mediaQueryString);
    this.mqw.addListener(this.onChange.bind(this));
    this.callback(this.mqw.matches);
  }
  onChange(mq) {
    this.callback(mq.matches);
  }
}
