import { type ExternalToast, toast as sonnerToast } from "sonner";

import { CustomToast, ToastProps } from "../ui/CustomToast";

export function customToast(toast: string | Omit<ToastProps, "id">, options?: ExternalToast) {
  if (typeof toast === "string") {
    toast = {
      title: toast,
    };
  }

  return sonnerToast.custom((id) => <CustomToast id={id} {...toast} />, options);
}
