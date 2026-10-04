"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function ToastError() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMsg = searchParams.get("message");
  const successMsg = searchParams.get("success");

  useEffect(() => {
    if (errorMsg || successMsg) {
      if (errorMsg) {
        toast.error(errorMsg, {
          position: "top-center",
          duration: 5000,
        });
      }
      if (successMsg) {
        toast.success(successMsg, {
          position: "top-center",
          duration: 5000,
        });
      }

      // Clear the search param after showing the toast so it doesn't reappear on refresh
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("message");
      newSearchParams.delete("success");
      const newPathname = window.location.pathname;
      router.replace(`${newPathname}?${newSearchParams.toString()}`);
    }
  }, [errorMsg, successMsg, searchParams, router]);

  return null;
}
