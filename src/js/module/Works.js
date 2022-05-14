import gsap from "gsap";

export default class Works {
  constructor() {
    this.node_container = document.querySelector('.works');
    if (!this.node_container) return;
    this.animation = new WorksPanelAnimation(this.node_container);
    this.register_events();
  }
  register_events() {
    document.querySelectorAll('[data-js="works-toggler"]').forEach(node => {
      node.addEventListener('click', (e) => {
        document.body.classList.toggle('works--visible');
        this.animation.TOGGLE();
      });
    });

    document.addEventListener('keyup', (e) => {
      // on "esc" press
      if (e.keyCode === 27) {
        document.body.classList.toggle('works--visible', false);
        this.animation.FADE_OUT();
      }
    })
  }
}

class WorksPanelAnimation {
  constructor(node) {
    this.node = node;
    this.is_visible = false;
    this.timeline = this.build_animation(this.node);
    this.FADE_OUT();
  }
  build_animation(domNode) {

    const duration = 0.4;
    const ease = "ease";

    return gsap.timeline(
      {
        paused: true,
        defaults: { duration, ease }
      })
      .from(domNode, {
        transform: 'scaleX(0)'
      })
      .from([...domNode.children], {
        stagger: duration,
        opacity: 0
      });

  }
  FADE_IN() {
    this.timeline.play();
    this.is_visible = true;
  }
  FADE_OUT() {
    this.timeline.reverse();
    this.is_visible = false;
  }
  TOGGLE() {
    if (this.is_visible) {
      this.FADE_OUT();
    } else {
      this.FADE_IN();
    }
  }
}