import axios from 'axios';
import * as yup from 'yup';
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

function findParentByClass(node, className) {
  if (!node) return null;
  if (node.classList.contains(className)) return node;
  if (node === document.body) return null;
  return findParentByClass(node.parentNode, className);
}

class ContactForm {
  constructor() {
    this.node_form = document.querySelector('form#contact-form');
    if (!this.node_form) return;

    // init form state object
    this.form_state = this.get_initial_form_state();
    this.update_ui();

    // init a form validator object
    this.validator = new ContactFormValidator();

    // update UI of the form while user consume form fields
    [...this.node_form.querySelectorAll('.form-field')].forEach(
      node => new FormFieldStateObserver(
        node.querySelector('.form-field__label'),
        node.querySelector('.form-field__input'),
        node
      )
    );

    // register events listener
    this.register_events();
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
      id_dirty: false,
    };
  }

  register_events() {

    [...this.node_form.querySelectorAll('.form-field__input')].forEach(node => node.addEventListener('input', async (e) => {
      const form_field_name = e.currentTarget.name;
      const form_field_value = e.currentTarget.value;
      this.form_state.form_data[form_field_name] = form_field_value;

      if (this.form_state.form_fields_touched[form_field_name]) {
        const { is_valid, error } = await this.validator.validate_single_field(form_field_name, form_field_value);
        this.form_state.form_fields_errors[form_field_name] = is_valid ? '' : error;
        this.update_ui();
      }
    }));

    [...this.node_form.querySelectorAll('.form-field__input')].forEach(node => node.addEventListener('blur', async (e) => {
      const form_field_name = e.currentTarget.name;
      const form_field_value = this.form_state.form_data[form_field_name];

      if (form_field_value !== '') {
        this.form_state.form_fields_touched[form_field_name] = true;
        if (!this.form_state.id_dirty) this.form_state.id_dirty = true;
      }

      if (this.form_state.form_fields_touched[form_field_name]) {
        const { is_valid, error } = await this.validator.validate_single_field(form_field_name, form_field_value);
        this.form_state.form_fields_errors[form_field_name] = is_valid ? '' : error;
        this.update_ui();
      }
    }));

    this.node_form.addEventListener('reset', async (e) => {
      this.form_state = this.get_initial_form_state();
      this.update_ui();
    });

    this.node_form.addEventListener('submit', async (e) => {
      e.preventDefault();

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
    });
  }

  update_ui() {

    const { form_data, form_fields_errors } = this.form_state;

    // update form fields helper text...
    Object.entries(form_data).forEach(([field_name]) => {
      const node_field = findParentByClass(this.node_form.querySelector(`[name="${field_name}"]`), 'form-field');
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
      if (!this.form_state.id_dirty) {
        node_button_submit.classList.toggle('button--is-disabled', true);
        node_button_reset.style.visibility = 'hidden';
        return;
      }
      node_button_submit.classList.toggle('button--is-disabled', false);
      node_button_reset.style.visibility = '';
    })(
      this.node_form.querySelector('[type="submit"]'),
      this.node_form.querySelector('[type="reset"]')
    );

  }

  async submit_data_to_server(form_data) {
    const data = {
      contact__name: form_data.contact__name,
      contact__email: form_data.contact__email,
      contact__message: form_data.contact__message,
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