import Swal from 'sweetalert2';

interface ToastMessage {
  type: 'success' | 'error';
  title?: string;
  body?: string;
  timer?: number;
  confirmButtonText?: string;
}


export default class Toast {
  show_message(message: ToastMessage) {
    const { type, title, body, timer, confirmButtonText } = message;

    if (type === 'success') {
      Swal.fire({
        icon: 'success',
        text: body,
        ...(title && { title }),
        ...(timer && {
          timer,
          timerProgressBar: true,
        }),
        ...(confirmButtonText && { confirmButtonText }),
      });

      return;
    }

    if (type === 'error') {
      Swal.fire({
        icon: 'error',
        ...(title && { title }),
        ...(timer && {
          timer,
          timerProgressBar: true,
        }),
        ...(confirmButtonText && { confirmButtonText }),
      });

      return;
    }

    throw new Error(`Toast Type: "${type}" is not implemented`);
  }
}