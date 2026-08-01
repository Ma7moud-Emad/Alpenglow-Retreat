import { toast } from "react-toastify";

const options = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Toasts are themed by GlobalStyles rather than react-toastify's own light and
 * dark themes, so they follow the app's tokens automatically.
 */
const notify = {
  success: (message) => toast.success(message, options),
  error: (message) => toast.error(message, { ...options, autoClose: 6000 }),
  info: (message) => toast.info(message, options),
  warning: (message) => toast.warning(message, options),
};

export default notify;
