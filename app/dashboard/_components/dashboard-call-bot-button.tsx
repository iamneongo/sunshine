"use client";

import { useMemo, useRef, useState } from "react";

type DashboardCallBotButtonProps = {
  leadId: string;
  returnTo: string;
  className: string;
  disabled?: boolean;
  disabledReason?: string;
  idleLabel?: string;
  pendingLabel?: string;
  confirmMessage?: string;
};

export function DashboardCallBotButton({
  leadId,
  returnTo,
  className,
  disabled = false,
  disabledReason = "",
  idleLabel = "Call bot",
  pendingLabel = "Đang gửi...",
  confirmMessage = "Đẩy lead này vào kịch bản call bot tự động ngay bây giờ?"
}: DashboardCallBotButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDisabled = disabled || isSubmitting;
  const title = useMemo(() => {
    if (isSubmitting) {
      return pendingLabel;
    }

    return disabledReason || idleLabel;
  }, [disabledReason, idleLabel, isSubmitting, pendingLabel]);

  function handleClick() {
    if (isDisabled) {
      return;
    }

    if (typeof window !== "undefined" && !window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form ref={formRef} action={`/api/dashboard/leads/${leadId}/call-bot`} method="post" className="hidden">
        <input type="hidden" name="returnTo" value={returnTo} />
      </form>
      <button type="button" className={className} disabled={isDisabled} title={title} onClick={handleClick}>
        <i className={`fa-solid ${isSubmitting ? "fa-circle-notch fa-spin" : "fa-robot"} mr-2`}></i>
        {isSubmitting ? pendingLabel : idleLabel}
      </button>
    </>
  );
}
