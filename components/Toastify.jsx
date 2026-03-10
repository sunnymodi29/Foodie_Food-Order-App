import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toastify = ({ toastType, message }) => {
  if (toast[toastType]) {
    toast[toastType](message);
  }
};

export default Toastify;
