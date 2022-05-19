import FloatingPanelAnimation from "./FloatingPanelAnimation";

export default class Works {
  constructor() {
    this.node_container = document.querySelector('.works');
    if (!this.node_container) return;
    this.animation = new FloatingPanelAnimation(
      this.node_container,
      {
        onAnimationEvent: (event) => {
          if (event === "fade-in-start") {
            document.body.classList.toggle('works--visible', true);
            return;
          }
          if (event === "fade-out-end") {
            document.body.classList.toggle('works--visible', false);
            return;
          }
        }
      }
    );
    this.register_events();
  }

  register_events() {
    document.querySelectorAll('[data-js="works-toggler"]').forEach(node => {
      node.addEventListener('click', (e) => {
        this.animation.TOGGLE();
      });
    });

    document.addEventListener('keyup', (e) => {
      // on "esc" press
      if (e.keyCode === 27) {
        this.animation.FADE_OUT();
      }
    })
  }
}
