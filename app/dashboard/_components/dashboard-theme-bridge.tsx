"use client";

import { useEffect } from "react";

type DashboardThemeBridgeProps = {
  bodyClassName?: string;
};

export function DashboardThemeBridge({ bodyClassName }: DashboardThemeBridgeProps) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlFlag = html.getAttribute("data-dashboard-ui");
    const previousBodyFlag = body.getAttribute("data-dashboard-ui");

    html.setAttribute("data-dashboard-ui", "true");
    body.setAttribute("data-dashboard-ui", "true");

    if (bodyClassName) {
      for (const className of bodyClassName.split(/\s+/).filter(Boolean)) {
        body.classList.add(className);
      }
    }

    return () => {
      if (previousHtmlFlag === null) {
        html.removeAttribute("data-dashboard-ui");
      } else {
        html.setAttribute("data-dashboard-ui", previousHtmlFlag);
      }

      if (previousBodyFlag === null) {
        body.removeAttribute("data-dashboard-ui");
      } else {
        body.setAttribute("data-dashboard-ui", previousBodyFlag);
      }

      if (bodyClassName) {
        for (const className of bodyClassName.split(/\s+/).filter(Boolean)) {
          body.classList.remove(className);
        }
      }
    };
  }, [bodyClassName]);

  return null;
}
