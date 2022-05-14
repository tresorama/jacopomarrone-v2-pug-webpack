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
    if (this.earlyAbort()) return;
    this.config = config;
    this.buildNodes();
    this.injectToDom();
    this.subscribeEvents();
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
  buildNodes() {
    this.nodeCSS = createNodeByHTMLString(`<style>${this.css}</style>`);
    this.node = createNodeByHTMLString(this.html);
  }
  injectToDom() {
    document.body.appendChild(this.nodeCSS);
    document.body.appendChild(this.node);
  }
  subscribeEvents() {
    window.addEventListener("mousemove", this.onMove.bind(this));
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
    base: ".cursor",
  };
  html = `<div class="cursor"></div>`;

  css = `
.cursor {
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
  padding-bottom: var(--height, 100%);
  justify-self: stretch;
  z-index: -1;
}
.cursor::after {
  content: var(--text, "I'm a cursor");
}
  `;
}
