import Cursor from "../lib/Cursor"

export default class FloatingCursor {
  constructor() {
    // new WithStaticHue();
    // new WithStaticHueGreyScale();
    new WithTriangle();
    // new WithDotOnly();
    // new WithRotatingHue();
  }
}


class WithStaticHue {
  constructor() {
    new Cursor({
      delay: 0,
      afterMount: (node_cursor_container) => {
        node_cursor_container.style.setProperty('--cursor-bg', 'var(--cursor-bg-with-static-color)');
        node_cursor_container.style.setProperty('--cursor-bg-with-static-color', 'teal');
      }
    });
  }
}
class WithStaticHueGreyScale {
  constructor() {
    new Cursor({
      delay: 0,
      afterMount: (node_cursor_container) => {
        node_cursor_container.style.setProperty('--cursor-bg', 'var(--cursor-bg-with-static-color)');
        node_cursor_container.style.setProperty('--cursor-bg-with-static-color', 'rgba(0,0,0,0.5)');
        node_cursor_container.style.setProperty('--cursor-bg-with-static-color', `
        radial-gradient(
          hsla(0, 0%,50%, 1),
          transparent
        )
        `);
        node_cursor_container.style.setProperty('mix-blend-mode', 'exclusion');
      }
    });
  }
}
class WithTriangle {
  constructor() {
    new Cursor({
      delay: 0,
      cursorHTML: `<div class="cursor cursor-triangle"></div>`,
      afterMount: (node_cursor_container) => {
        document.body.classList.add('cursor-with-triangle');
      }
    });
  }
}
class WithDotOnly {
  constructor() {
    new Cursor({
      delay: 0,
      cursorHTML: `<div class="cursor cursor-dot-only"></div>`,
      afterMount: (node_cursor_container) => {
        document.body.insertAdjacentHTML('beforeend', `
        <style>
          .cursor-dot-only::before,
          .cursor-dot-only::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            background: red;
          }
          .cursor-dot-only::before {
            background: blue;
          }
        </style>
        `);
        node_cursor_container.style.setProperty('--cursor-bg', 'var(--cursor-bg-with-static-color)');
        // node_cursor_container.style.setProperty('--cursor-bg-with-static-color', 'rgba(0,0,0,0.5)');
        // node_cursor_container.style.setProperty('--cursor-bg-with-static-color', `
        // radial-gradient(
        //   hsla(0, 0%,50%, 1),
        //   transparent
        // )
        // `);
        // node_cursor_container.style.setProperty('mix-blend-mode', 'exclusion');
      }
    });
  }
}
class WithRotatingHue {
  constructor() {
    new Cursor({
      delay: 0,
      afterMount: (node_cursor_container) => {
        node_cursor_container.style.setProperty('--cursor-bg', 'var(--cursor-bg-with-rotating-color)');
        node_cursor_container.style.setProperty('--cursor-bg-with-rotating-color', `
        radial-gradient(
          hsla(var(--cursor-bg-hue, 200), 100%,25%, 0.9),
          transparent
        );
        `);
        node_cursor_container.style.mixBlendMode = 'multiply';
        node_cursor_container._interval_bg_hue = setInterval(() => {
          const currentHue = parseInt(node_cursor_container.style.getPropertyValue("--cursor-bg-hue") || 0);
          node_cursor_container.style.setProperty('--cursor-bg-hue', (currentHue + 1) % 360);
        }, 50);
      },
      beforeUnMount: (node_cursor_container) => {
        clearInterval(node_cursor_container._interval_bg_hue);
      }
    });
  }
}