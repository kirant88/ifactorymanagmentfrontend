import toast from "react-hot-toast";

/** App-wide toast helpers: success / error / info */
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) =>
    toast(message, {
      style: {
        border: "1px solid #93c5fd",
        background: "#eff6ff",
        color: "#1e3a5f",
      },
    }),
};

export default notify;
