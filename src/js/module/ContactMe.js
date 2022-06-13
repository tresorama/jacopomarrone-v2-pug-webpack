import axios from 'axios';
import * as yup from 'yup';
import FloatingPanelAnimation from "./FloatingPanelAnimation";
import Toast from './Toast';

export default class ContactMe {
  constructor() {
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

// Utility function that traverses the DOM startinting from 'node' and returns the first parent node that matches the 'className'
function findParentByClass(node, className) {
  if (!node) return null;
  if (node.classList.contains(className)) return node;
  if (node === document.body) return null;
  return findParentByClass(node.parentNode, className);
}

// Contact Form Controller, who has the form state and triggers the form events
class ContactForm {
  constructor() {
    // Ensure form exists in DOM
    this.node_form = document.querySelector('form#contact-form');
    if (!this.node_form) return;

    // Bind methods to this
    this.dispatcher = this.dispatcher.bind(this);

    // init form state object
    this.form_state = this.get_initial_form_state();
    // init form view 
    this.view = new ContactFormView(this.node_form, this.dispatcher);
    this.view_toast = new Toast();
    // init a form validator object
    this.validator = new ContactFormValidator();

    // update the view to reflect the initial state
    this.update_ui();

  }

  get_initial_form_state() {
    return {
      form_data: {
        contact__name: '',
        contact__email: '',
        contact__message: '',
      },
      form_fields_errors: {
        contact__name: '',
        contact__email: '',
        contact__message: '',
      },
      form_fields_touched: {
        contact__name: false,
        contact__email: false,
        contact__message: false,
      },
      is_dirty: false,
    };
  }

  async dispatcher({ event, payload }) {
    if (event === 'form-field-change-value') {
      const { form_field_name, form_field_value } = payload;
      this.form_state.form_data[form_field_name] = form_field_value;

      if (this.form_state.form_fields_touched[form_field_name]) {
        const { is_valid, error } = await this.validator.validate_single_field(form_field_name, form_field_value);
        this.form_state.form_fields_errors[form_field_name] = is_valid ? '' : error;
        this.update_ui();
      }
      return;
    }

    if (event === 'form-field-blur') {
      const { form_field_name } = payload;
      const form_field_value = this.form_state.form_data[form_field_name];

      if (form_field_value !== '') {
        this.form_state.form_fields_touched[form_field_name] = true;
        if (!this.form_state.is_dirty) this.form_state.is_dirty = true;
      }

      if (this.form_state.form_fields_touched[form_field_name]) {
        const { is_valid, error } = await this.validator.validate_single_field(form_field_name, form_field_value);
        this.form_state.form_fields_errors[form_field_name] = is_valid ? '' : error;
        this.update_ui();
      }
      return;
    }

    if (event === 'form-reset') {
      this.form_state = this.get_initial_form_state();
      this.update_ui();
      return;
    }

    if (event === 'form-submit') {
      // extract form data
      const { form_data } = this.form_state;

      // check if form data is valid
      const { is_valid, errors } = await this.validator.validate_all_fields(form_data);

      // update the UI to notify user that there are or there are no errors
      this.form_state.form_fields_errors = { ...this.form_state.form_fields_errors, ...errors };
      this.update_ui();

      // if form data is NOT valid, abort
      if (!is_valid) {
        return;
      }

      // if form data is valid, submit the form
      this.submit_data_to_server(form_data);

      return;
    }

    throw new Error('Unknown event in ContactForm.dispatcher, event: ' + event);

  }

  update_ui() {
    this.view.update_ui(this.form_state);
  }

  async submit_data_to_server(form_data) {
    const data = {
      contact__name: form_data.contact__name,
      contact__email: form_data.contact__email,
      contact__message: form_data.contact__message,
      source: window.location.href,
      source_name: "portfolio-contact-form",
      timestamp: Date.now(),
      date: new Date().toLocaleString(),
    };

    try {
      // const response = await new Promise(resolve => setTimeout(() => { resolve({ status: 200 }) }, 1000));
      const response = await axios.post('/api/contact-me', data);

      if (response.status === 200) {
        this.onSubmitSuccess({ request_data: data });
        return;
      }

      throw new Error('Form data not submitted to server. Something went wrong');

    } catch (error) {
      this.onSubmitFailure({ request_data: data, error });
    }
  }

  onSubmitSuccess({ request_data }) {
    console.info('Form data sent to server');

    this.node_form.reset();
    this.view_toast.show_message({
      type: 'success',
      title: 'Message sent !',
      body: 'Thank you for your message. I will get back to you as soon as possible. You should receive a copy of the message in your email inbox.',
    });
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong with submission, please retry !',
        icon: 'error',
        confirmButtonText: 'I understand'
    });
  }

  onSubmitFailure({ request_data, error }) {
    console.error(error);

    this.view_toast.show_message({
      type: 'error',
      title: 'Error',
      body: 'Something went wrong with the form submission. Please try again.',
      confirmButtonText: 'I understand',
    });
  }

}

// Contact Form Validator, who validates the form data
class ContactFormValidator {
  constructor() {
    this.schema = yup.object().shape({
      contact__name: yup.string().required('Name is required'),
      contact__email: yup.string().email('Invalid email address').required('Email is required'),
      contact__message: yup.string().required('Message is required'),
    });
  }

  async validate_single_field(field_name, field_value) {
    try {
      await yup.reach(this.schema, field_name).validate(field_value)
      return { is_valid: true }
    } catch (error) {
      return { is_valid: false, error: error.message }
    }
  }

  async validate_all_fields(form_data) {
    try {
      await this.schema.validate(form_data, { abortEarly: false });
      return { is_valid: true }
    } catch (error) {
      return {
        is_valid: false,
        errors: Object.assign({}, ...error.inner.map(err => ({ [err.path]: err.message })))
      }
    }
  }

}

// Contact Form View, who update the ui of the form, and dispatch events to ContactForm
class ContactFormView {
  constructor(node_form, dispatch) {
    this.node_form = document.querySelector('form#contact-form');
    if (!this.node_form) return;
    this.dispatch = dispatch;
    this.register_events();
    this.register_automatic_ui_update();
  }

  register_automatic_ui_update() {
    // update UI of the form while user consume form fields
    [...this.node_form.querySelectorAll('.form-field')].forEach(
      node => new FormFieldStateObserver(
        node.querySelector('.form-field__label'),
        node.querySelector('.form-field__input'),
        node
      )
    );
  }

  register_events() {
    [...this.node_form.querySelectorAll('.form-field__input')].forEach(node => node.addEventListener('input', async (e) => {
      const form_field_name = e.currentTarget.name;
      const form_field_value = e.currentTarget.value;
      this.dispatch({ event: 'form-field-change-value', payload: { form_field_name, form_field_value } });
    }));

    [...this.node_form.querySelectorAll('.form-field__input')].forEach(node => node.addEventListener('blur', async (e) => {
      const form_field_name = e.currentTarget.name;
      this.dispatch({ event: 'form-field-blur', payload: { form_field_name } });
    }));

    this.node_form.addEventListener('reset', async (e) => {
      this.dispatch({ event: 'form-reset' });
    });

    this.node_form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.dispatch({ event: 'form-submit' });
    });
  }

  update_ui(form_state) {
    const { form_data, form_fields_errors, is_dirty } = form_state;
    const { node_form } = this;

    // update form fields helper text...
    Object.entries(form_data).forEach(([field_name]) => {
      const node_field = findParentByClass(node_form.querySelector(`[name="${field_name}"]`), 'form-field');
      const node_helper_text = node_field.querySelector('.form-field__helper-text');
      if (form_fields_errors[field_name]) {
        node_field.classList.toggle('form-field--is-invalid', true);
        node_helper_text.innerHTML = form_fields_errors[field_name];
        return;
      }
      node_field.classList.toggle('form-field--is-invalid', false);
      node_helper_text.innerHTML = '';
    });

    // update form submit button
    ((
      node_button_submit,
      node_button_reset
    ) => {
      if (!is_dirty) {
        node_button_submit.classList.toggle('button--is-disabled', true);
        node_button_reset.style.visibility = 'hidden';
        return;
      }
      node_button_submit.classList.toggle('button--is-disabled', false);
      node_button_reset.style.visibility = '';
    })(
      node_form.querySelector('[type="submit"]'),
      node_form.querySelector('[type="reset"]')
    );


  }
}
class FormFieldStateObserver {
  constructor(node_label, node_control, node_field) {
    this.node_label = node_label; // <label></label>
    this.node_control = node_control; // <input>|<textarea>|<select> ...
    this.node_field = node_field; // <div class="field">  <label></label>  <input>  </div>
    this.register_events();
  }
  register_events() {
    // this.node_control.addEventListener('focus', (e) => {
    //   this.node_field.classList.toggle('form-field--is-focused', true);
    // });
    // this.node_control.addEventListener('blur', (e) => {
    //   this.node_field.classList.toggle('form-field--is-focused', false);
    // });

    ['input', 'change'].forEach(event => {
      this.node_control.addEventListener(event, (e) => {
        const value = this.node_control.value;
        this.node_field.classList.toggle('form-field--has-value', value?.length > 0);
      });
    });
  }
}