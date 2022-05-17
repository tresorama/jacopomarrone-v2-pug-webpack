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
    this.config = config;
    if (this.earlyAbort()) return;
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
          return;
        }
        this.subscribeEvents(false);
        this.injectNodesToDom(false);
      }
    );
  }
  earlyAbort() {
    let error = null;

    if (document.querySelector(this.selectors.base)) {
      error =
        'Cursor already present in DOM. Do you called "new Cursor()" twice in the page ???';
    }

    if (error) {
      console.log(`Cursor -> Aborted Initialization !! - ${error}`);
      return true;
    }

    return false;
  }
  crateNodes() {
    this.node = createNodeByHTMLString(this.config.cursorHTML ?? this.cursorHTML);
  }
  injectCSS() {
    this.nodeCSS = createNodeByHTMLString(`<style>${this.css}</style>`);
    document.body.appendChild(this.nodeCSS);
  }
  injectNodesToDom(force = true) {
    if (force) {
      document.body.appendChild(this.node);
    }
    else {
      this.node.parentElement.removeChild(this.node);
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
  cursorHTML = `
  <div class="cursor-container">
    <div class="cursor"></div>
  </div>`;
  css = `
.cursor-container {
  position: fixed;
  top: var(--clientY);
  left: var(--clientX);
  transform: translate(-50%, -50%);
  width: var(--width, 40vw);
  background-color: var(--bg-color, pink);
  border-radius: var(--border-radius, 50%);
  overflow: hidden;
  display: grid;
  pointer-events: none;
}
.cursor-container::before, .cursor-container::after {
  grid-row: 1;
  grid-column: 1;
  justify-self: center;
  align-self: center;
  min-width: 0;
  min-height: 0;
}
.cursor-container::before {
  content: "";
  padding-bottom: var(--height, 100%);
  justify-self: stretch;
  z-index: -1;
}
.cursor-container::after {
  content: var(--text, "I'm a cursor");
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
