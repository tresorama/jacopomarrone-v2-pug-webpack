import gsap from "gsap";

export default class FloatingPanelAnimation {
  constructor(node, options = {}) {
    this.node = node;
    this.options = {};
    if (options.onAnimationEvent) {
      this.options.onAnimationEvent = options.onAnimationEvent;
    }

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
        defaults: { duration, ease },
        onStart: () => this.dispatchAnimationEvent("fade-in-start"),
        onComplete: () => this.dispatchAnimationEvent("fade-in-end"),
        onReverseComplete: () => this.dispatchAnimationEvent("fade-out-end"),
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
  }
  FADE_OUT() {
    this.dispatchAnimationEvent("fade-out-start");
    this.timeline.reverse();
  }
  TOGGLE() {
    if (this.is_visible) {
      this.FADE_OUT();
    } else {
      this.FADE_IN();
    }
  }
  dispatchAnimationEvent(event) {
    if (event === "fade-in-start") {
      this.is_visible = true;
      this.options?.onAnimationEvent?.(event);
      return;
    }

    if (event === "fade-in-end") {
      this.options?.onAnimationEvent?.(event);
      return;
    }

    if (event === "fade-out-start") {
      this.options?.onAnimationEvent?.(event);
      return;
    }

    if (event === "fade-out-end") {
      this.is_visible = false;
      this.options?.onAnimationEvent?.(event);
      return;
    }

    throw new Error("Unknown event");

  }
}