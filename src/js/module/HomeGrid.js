import gsap from 'gsap';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default class HomeGrid {
  constructor() {
    this.node_container = document.querySelector('.home-grid');
    if (!this.node_container) return;
    this.animation = new HomeGridAnimation();
    wait(1000).then(() => this.animation.FADE_IN());
  }
}

class HomeGridAnimation {
  constructor() {
    this.is_visible = false;
    this.timeline = this.build_animation_timeline(this.node);
  }
  FADE_IN() {
    this.is_visible = true;
    this.timeline.play();
  }
  FADE_OUT() {
    this.is_visible = false;
    this.timeline.reverse();
  }
  TOGGLE() {
    if (this.is_visible) {
      this.FADE_OUT();
    }
    else {
      this.FADE_IN();
    }
  }
  build_animation_timeline(domNode) {
    const ease = "power4.out";
    const duration = 2;

    const timeline = gsap
      .timeline({
        paused: true,
        defaults: { ease, duration, stagger: duration * 0.25 },
        onStart: () => this.deactived_transition(),
        onComplete: () => this.reactivate_transition()
      })
      .from([...document.querySelectorAll('.home-grid-animate.animate-from-left')], { opacity: 0, x: '-50vw' })
      .from([...document.querySelectorAll('.home-grid-animate:not(.animate-from-left)')], { opacity: 0, x: '50vw' }, '<+0.5');

    return timeline;
  }
  deactived_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', true);
  }
  reactivate_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', false);
  }


}