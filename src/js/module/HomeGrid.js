import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

/**
 * Given ann array of DOM HTML elements nodes, return an array of all children of nodes.
 * @param {HTMLElementNode[]} nodes - Array of parent nodes.
 * @returns
 */
const getChildren = (nodes) => nodes.reduce((acc, curr) => [...acc, ...curr.children], []);

/** Function used to delay some operation. */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default class HomeGrid {
  constructor() {
    this.node_container = document.querySelector('.home-grid');
    if (!this.node_container) return;
    this.animation = new HomeGridAnimation();
    wait(1).then(() => this.animation.FADE_IN());
    //wait(5000).then(() => this.animation.FADE_OUT());
  }
}



class HomeGridAnimation {
  constructor() {
    this.is_visible = false;
  }
  FADE_IN() {
    this.is_visible = true;
    this.animationAtoB();
  }
  FADE_OUT() {
    this.is_visible = false;
    this.animationBtoA();
  }
  TOGGLE() {
    if (this.is_visible) {
      this.FADE_OUT();
    }
    else {
      this.FADE_IN();
    }
  }
  animationAtoB() {
    const nodes = {
      grid_shrinked: document.querySelector('.home-grid.home-grid--shrinked'),
      grid_expanded: document.querySelector('.home-grid.home-grid--expanded'),
      grid_items: [...document.querySelectorAll('.home-grid__box')]
    };

    const duration = 2.6;
    const ease = "power4.out";
    const stagger = {
      each: 0.4
    };


    function expandBoxes() {
      const flipState = Flip.getState(nodes.grid_items);
      nodes.grid_items.forEach((node) => {
        nodes.grid_expanded.appendChild(node);
      });
      return Flip.from(flipState, {
        duration: duration,
        ease,
        stagger,
        absolute: true,
      })
    }
    function fadeBoxes() {
      const tl = gsap.timeline();
      tl.to(nodes.grid_items, {
        autoAlpha: 1,
        duration: duration * 0.5,
        ease,
        stagger
      });

      return tl;
    }
    function fadeBoxesChildren() {
      const tl = gsap.timeline();
      tl.to(getChildren(nodes.grid_items), {
        autoAlpha: 1,
        duration,
        ease,
        stagger
      });
      return tl;
    }

    return gsap
      .timeline({
        paused: false,
        onStart: () => {
          this.deactivate_transition();
          gsap.set([...nodes.grid_items, ...getChildren(nodes.grid_items)], { visibility: 'hidden' });
        },
        onComplete: () => {
          this.reactivate_transition()
        },
      })
      .addLabel('t0', duration * 0)
      .addLabel('t1', duration * 0.5)
      .add(fadeBoxes(), 't0')
      .add(fadeBoxesChildren(), 't1')
      .add(expandBoxes(), 't1');
  }
  animationBtoA() {
    const nodes = {
      grid_shrinked: document.querySelector('.home-grid.home-grid--shrinked'),
      grid_expanded: document.querySelector('.home-grid.home-grid--expanded'),
      grid_items: [...document.querySelectorAll('.home-grid__box')]
    };

    const duration = 2.6;
    const ease = "power4.out";
    const stagger = {
      each: 0.4
    };


    function expandBoxes() {
      const flipState = Flip.getState(nodes.grid_items);
      nodes.grid_items.forEach((node) => {
        nodes.grid_shrinked.appendChild(node);
      });
      return Flip.from(flipState, {
        duration: duration,
        ease,
        stagger,
        absolute: true,
      })
    }
    function fadeBoxes() {
      const tl = gsap.timeline();
      tl.to(nodes.grid_items, {
        autoAlpha: 0,
        duration: duration * 0.5,
        ease,
        stagger
      });

      return tl;
    }
    function fadeBoxesChildren() {
      const tl = gsap.timeline();
      tl.to(getChildren(nodes.grid_items), {
        autoAlpha: 0,
        duration,
        ease,
        stagger
      });
      return tl;
    }

    return gsap
      .timeline({
        paused: false,
        onStart: () => {
          this.deactivate_transition();
        },
        onComplete: () => {
          this.reactivate_transition()
        },
      })
      .addLabel('t0', duration * 0)
      .addLabel('t1', duration * 0.5)
      .add(fadeBoxes(), 't1')
      .add(fadeBoxesChildren(), 't0')
      .add(expandBoxes(), 't0')
  }
  deactivate_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', true);
  }
  reactivate_transition() {
    document.body.classList.toggle('GSAP-IS-ANIMATING', false);
  }

}