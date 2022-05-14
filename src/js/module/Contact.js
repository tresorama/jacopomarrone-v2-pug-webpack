import gsap from "gsap";
import axios from 'axios';
import Swal from 'sweetalert2';

export default class Contact {
  constructor() {
    this.node_container = document.querySelector('.contact');
    if (!this.node_container) return;
    this.animation = new ContactPanelAnimation(this.node_container);
    this.form = new ContactForm(this.node_container);
    this.register_events();
  }
  register_events() {
    document.querySelectorAll('[data-js="contact-toggler"]').forEach(node => {
      node.addEventListener('click', (e) => {
        document.body.classList.toggle('contact--visible');
        this.animation.TOGGLE();
      });
    });

    document.addEventListener('keyup', (e) => {
      // on "esc" press
      if (e.keyCode === 27) {
        document.body.classList.toggle('contact--visible', false);
        this.animation.FADE_OUT();
      }
    })
  }
}

class ContactForm {
  constructor() {
    this.node_form = document.querySelector('form#contact-form');
    if (!this.node_form) return;
    this.register_events();
  }
  register_events() {
    this.node_form.addEventListener('submit', (e) => {
      debugger;
      e.preventDefault();
      this.submit();
    });
  }
  async submit() {
    const formData = new FormData(this.node_form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      source: window.location.href,
      timestamp: Date.now(),
      date: new Date().toLocaleString(),
    };

    try {
      // const response = await axios.post('/api/contact', data);
      const response = await new Promise(resolve => setTimeout(() => { resolve({ status: 200 }) }, 1000));

      if (response.status === 200) {
        this.node_form.reset();
        Swal.fire(
          'Thank you !',
          "I'll be right back to you as soon as possible!",
          'success'
        );
      }
      else {
        throw new Error('Something went wrong');
      }

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong with submission, please retry !',
        icon: 'error',
        confirmButtonText: 'I understand'
      })

    }
  }

}

class ContactPanelAnimation {
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