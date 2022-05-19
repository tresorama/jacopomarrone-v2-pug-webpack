import axios from 'axios';
import Swal from 'sweetalert2';
import FloatingPanelAnimation from "./FloatingPanelAnimation";

export default class ContactMe {
  constructor() {
    // return;
    this.node_container = document.querySelector('.contact');
    if (!this.node_container) return;
    this.animation = new FloatingPanelAnimation(this.node_container, {
      onAnimationEvent: (event) => {
        if (event === "fade-in-start") {
          document.body.classList.toggle('contact--visible', true);
          return;
        }
        if (event === "fade-out-end") {
          document.body.classList.toggle('contact--visible', false);
          return;
        }
      }
    });
    this.form = new ContactForm(this.node_container);
    this.register_events();
  }
  register_events() {
    document.querySelectorAll('[data-js="contact-toggler"]').forEach(node => {
      node.addEventListener('click', (e) => {
        // document.body.classList.toggle('contact--visible');
        this.animation.TOGGLE();
      });
    });

    document.addEventListener('keyup', (e) => {
      // on "esc" press
      if (e.keyCode === 27) {
        this.animation.FADE_OUT();
        // document.body.classList.toggle('contact--visible', false);
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