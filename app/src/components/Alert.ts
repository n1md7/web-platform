import {ToastPosition, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export enum AlertType {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
}

export default function Alert(message: string, type: AlertType = AlertType.INFO, time: number = 5): void {
  const options = {
    position: "top-right" as ToastPosition,
    autoClose: time * 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  toast[type](`${type.toUpperCase()}: ${message}`, options);
}
