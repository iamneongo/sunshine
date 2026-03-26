import Script from "next/script";
import NativeOriginalLanding from "@/app/_components/native-original-landing";
import {
  CHATBOT_FOLLOW_UP_10M_MESSAGE,
  CHATBOT_MOBILE_TEASER_MESSAGE,
  CHATBOT_PLACEHOLDER,
  CHATBOT_RETURNING_MESSAGE,
  DEFAULT_QUICK_ACTIONS,
  INITIAL_CHAT_MESSAGE,
  PROJECT_CONTEXT,
  WELCOME_MESSAGE
} from "@/lib/chatbot-config";
import {
  NATIVE_LANDING_CONFIG_SCRIPT,
  NATIVE_LANDING_MAIN_SCRIPT
} from "@/lib/native-original-scripts";

const defaultSuggestions = DEFAULT_QUICK_ACTIONS.map((item) => item.prompt);
const initialMessages = [INITIAL_CHAT_MESSAGE, "Hiện có căn từ 626 triệu, phù hợp nhóm khách muốn vào tiền sớm và khai thác nghỉ dưỡng."];
const welcomeMessages = [WELCOME_MESSAGE, "Anh/chị muốn xem bảng giá 626 triệu hay căn thực tế giá tốt trước ạ?"];
const followUpSuggestions = ["GỬI GIÁ 626", "Xem căn thực tế", "Xem pháp lý"];
const returningSuggestions = ["GỬI GIÁ 626", "Xem căn thực tế", "Xem pháp lý"];
const suggestionDisplayMap = {
  "Nhận bảng giá nội bộ": "Nhận giá 626",
  "Nhận bảng giá": "Nhận giá 626",
  "Nhận bảng giá 626 triệu": "Nhận giá 626",
  "GỬI GIÁ 626": "Nhận giá 626",
  "Xem video căn đẹp": "Xem căn thực tế",
  "Xem căn thực tế giá tốt": "Xem căn thực tế"
};

const inlineEventBridgeScript = String.raw`
(() => {
  if (window.__nativeLandingHandlersBound) {
    return;
  }

  window.__nativeLandingHandlersBound = true;

  const bindings = [
    ["click", "data-onclick"],
    ["submit", "data-onsubmit"],
    ["keypress", "data-onkeypress"],
    ["change", "data-onchange"],
    ["input", "data-oninput"]
  ];

  function runInlineHandler(code, event) {
    if (!code) {
      return undefined;
    }

    try {
      return new Function("event", "with(window){" + code + "}").call(window, event);
    } catch (error) {
      console.error("Native landing inline handler failed", code, error);
      return undefined;
    }
  }

  bindings.forEach(([eventName, attributeName]) => {
    document.querySelectorAll("[" + attributeName + "]").forEach((element) => {
      element.addEventListener(eventName, (event) => {
        const result = runInlineHandler(element.getAttribute(attributeName), event);
        if (result === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    });
  });
})();
`;
const vrTourBridgeScript = `
(() => {
  const sources = {
    tour360: "https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO3LAKC7E1M&uri=%2Fpub%2Fsaas%2Fapps%2Fproject%2Fdetail%2F3FO3LAKC7E1M%3Fuid%3D3FO4LFQWLUM9&locale=en_US",
    panorama: "https://api2.enscape3d.com/v3/view/41cd2967-6eaa-409e-b46a-b8eaba9680ae",
    interior: "https://www.coohom.com/pub/tool/panorama/viewer?obsPicId=3FO8VO266YX8&locale=vi"
  };

  const activeClasses = [
    "border-primary-container/20",
    "bg-primary-container",
    "text-primary",
    "shadow-lg",
    "shadow-primary-container/20"
  ];
  const inactiveClasses = [
    "border-white/12",
    "bg-white/8",
    "text-white"
  ];

  function setTabState(activeKey) {
    document.querySelectorAll("[data-vr-tab]").forEach((element) => {
      const isActive = element.getAttribute("data-vr-tab") === activeKey;
      activeClasses.forEach((className) => element.classList.toggle(className, isActive));
      inactiveClasses.forEach((className) => element.classList.toggle(className, !isActive));
    });
  }

  window.switchVrTour = function switchVrTour(key) {
    const nextKey = Object.prototype.hasOwnProperty.call(sources, key) ? key : "tour360";
    const nextUrl = sources[nextKey];
    const frame = document.getElementById("vr-tour-frame");
    const startLink = document.getElementById("vr-tour-start");
    const openCurrentLink = document.getElementById("vr-tour-open-current");

    if (frame && frame.getAttribute("src") !== nextUrl) {
      frame.setAttribute("src", nextUrl);
    }

    if (startLink) {
      startLink.setAttribute("href", nextUrl);
    }

    if (openCurrentLink) {
      openCurrentLink.setAttribute("href", nextUrl);
    }

    setTabState(nextKey);
    return false;
  };

  const init = () => {
    if (typeof window.switchVrTour === "function") {
      window.switchVrTour("tour360");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
`;

const chatbotBridgeScript = `
(() => {
  const defaultSuggestions = ${JSON.stringify(defaultSuggestions)};
  const initialMessages = ${JSON.stringify(initialMessages)};
  const welcomeMessages = ${JSON.stringify(welcomeMessages)};
  const inputPlaceholder = ${JSON.stringify(CHATBOT_PLACEHOLDER)};
  const legacyWelcomeKey = "seen_sunshine_welcome_v2";
  const feedbackWelcomeKey = "seen_sunshine_feedback_welcome_v1";
  const feedbackPriceAnchor = ${JSON.stringify(PROJECT_CONTEXT.priceAnchor)};
  const mobileTeaserMessage = ${JSON.stringify(CHATBOT_MOBILE_TEASER_MESSAGE)};
  const followUp10MinuteMessage = ${JSON.stringify(CHATBOT_FOLLOW_UP_10M_MESSAGE)};
  const returningMessage = ${JSON.stringify(CHATBOT_RETURNING_MESSAGE)};
  const followUpSuggestions = ${JSON.stringify(followUpSuggestions)};
  const returningSuggestions = ${JSON.stringify(returningSuggestions)};
  const suggestionDisplayMap = ${JSON.stringify(suggestionDisplayMap)};
  const desktopWelcomeDelayMs = 6000;
  const idleFollowUpDelayMs = 10 * 60 * 1000;
  const returnVisitDelayMs = 24 * 60 * 60 * 1000;
  const feedbackSessionIdKey = "sunshine_feedback_chat_session_v1";
  const feedbackLastActivityKey = "sunshine_feedback_last_chat_activity_v1";
  const feedbackLeadCapturedKey = "sunshine_feedback_lead_captured_v1";
  const feedbackReturnFollowUpKey = "sunshine_feedback_return_follow_up_v1";
  const feedbackIdleShownKey = "sunshine_feedback_idle_follow_up_v1";

  try {
    sessionStorage.setItem(legacyWelcomeKey, "true");
  } catch (error) {
    console.warn("Unable to update legacy chatbot welcome state", error);
  }

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function resolveSuggestionDisplayLabel(value) {
    const label = normalizeText(value);
    return suggestionDisplayMap[label] || label;
  }

  function escapeHtml(value) {
    return normalizeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatRichText(value) {
    return escapeHtml(value)
      .replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>")
      .replace(/\\n/g, "<br />");
  }

  function dedupeSuggestions(items) {
    const result = [];
    const seen = new Set();

    for (const item of Array.isArray(items) ? items : []) {
      const label = normalizeText(
        typeof item === "string" ? item : item && typeof item.label === "string" ? item.label : ""
      );

      if (!label) {
        continue;
      }

      const key = label.toLowerCase();
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      result.push(label);

      if (result.length === 4) {
        break;
      }
    }

    return result.length ? result : defaultSuggestions;
  }

  function getState() {
    if (typeof chatbotState !== "undefined" && chatbotState) {
      return chatbotState;
    }

    if (!window.__chatbotStateFallback) {
      window.__chatbotStateFallback = {
        isOpen: false,
        history: [],
        loadingNode: null
      };
    }

    return window.__chatbotStateFallback;
  }

  function getNodes() {
    return {
      messages:
        typeof chatMessages !== "undefined" && chatMessages
          ? chatMessages
          : document.getElementById("chat-messages"),
      input:
        typeof chatInput !== "undefined" && chatInput
          ? chatInput
          : document.getElementById("chat-input"),
      panel:
        typeof chatbotPanel !== "undefined" && chatbotPanel
          ? chatbotPanel
          : document.getElementById("chatbot-panel"),
      suggestions: document.getElementById("chat-suggestions")
    };
  }

  function getSessionId() {
    try {
      const existing = sessionStorage.getItem(feedbackSessionIdKey);
      if (existing) {
        return existing;
      }

      const next = "chat_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(feedbackSessionIdKey, next);
      return next;
    } catch (error) {
      return "chat_" + Date.now();
    }
  }

  function recordEvent(name, metadata) {
    try {
      void fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          source: "chatbot",
          sessionId: getSessionId(),
          path: window.location.pathname,
          metadata: metadata || {}
        }),
        cache: "no-store"
      });
    } catch (error) {
      console.warn("Unable to record chatbot event", error);
    }
  }

  function hasLeadCaptured() {
    try {
      return localStorage.getItem(feedbackLeadCapturedKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function markLeadCaptured(source, leadId) {
    clearIdleFollowUpTimer();
    hideMiniTeaser();

    try {
      localStorage.setItem(feedbackLeadCapturedKey, "true");
    } catch (error) {
      console.warn("Unable to persist chatbot lead captured state", error);
    }

    recordEvent("chatbot_lead_captured", {
      source: normalizeText(source) || "unknown",
      leadId: normalizeText(leadId)
    });
  }

  function getLastActivityAt() {
    try {
      const raw = localStorage.getItem(feedbackLastActivityKey) || "0";
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    } catch (error) {
      return 0;
    }
  }

  function persistChatActivity(reason) {
    const timestamp = String(Date.now());

    try {
      localStorage.setItem(feedbackLastActivityKey, timestamp);
      sessionStorage.removeItem(feedbackIdleShownKey);
    } catch (error) {
      console.warn("Unable to persist chatbot activity", error);
    }

    recordEvent("chatbot_activity", {
      reason: normalizeText(reason) || "interaction"
    });
  }

  function getMiniTeaserNodes() {
    return {
      wrapper: document.getElementById("chatbot-mini-teaser"),
      text: document.getElementById("chatbot-mini-teaser-text"),
      cta: document.getElementById("chatbot-mini-teaser-cta")
    };
  }

  function hideMiniTeaser() {
    const teaser = getMiniTeaserNodes().wrapper;
    if (!teaser) {
      return;
    }

    teaser.classList.add("hidden");
    teaser.classList.remove("block");

    if (window.__chatbotMiniTeaserTimer) {
      window.clearTimeout(window.__chatbotMiniTeaserTimer);
      window.__chatbotMiniTeaserTimer = null;
    }
  }

  function showMiniTeaser(message, ctaLabel) {
    const nodes = getMiniTeaserNodes();
    if (!nodes.wrapper) {
      return;
    }

    if (nodes.text) {
      nodes.text.textContent = normalizeText(message) || mobileTeaserMessage;
    }

    if (nodes.cta) {
      nodes.cta.textContent = normalizeText(ctaLabel) || "Nhận giá 626";
    }

    nodes.wrapper.classList.remove("hidden");
    nodes.wrapper.classList.add("block");

    if (window.__chatbotMiniTeaserTimer) {
      window.clearTimeout(window.__chatbotMiniTeaserTimer);
    }

    window.__chatbotMiniTeaserTimer = window.setTimeout(() => {
      hideMiniTeaser();
    }, 12000);
  }

  function clearIdleFollowUpTimer() {
    if (window.__chatbotIdleTimer) {
      window.clearTimeout(window.__chatbotIdleTimer);
      window.__chatbotIdleTimer = null;
    }
  }

  function triggerIdleFollowUp() {
    if (hasLeadCaptured()) {
      return;
    }

    try {
      if (sessionStorage.getItem(feedbackIdleShownKey) === "true") {
        return;
      }
      sessionStorage.setItem(feedbackIdleShownKey, "true");
    } catch (error) {
      console.warn("Unable to persist idle follow-up state", error);
    }

    window.appendMessage("bot", followUp10MinuteMessage);
    renderSuggestionBar(followUpSuggestions);
    recordEvent("chatbot_follow_up_10m", {
      device: window.innerWidth >= 1024 ? "desktop" : "mobile"
    });

    showMiniTeaser("Dạ em vẫn giữ sẵn bảng giá 626 triệu và căn thực tế giá tốt cho anh/chị ạ.", "Nhận giá 626");
  }

  function scheduleIdleFollowUp() {
    clearIdleFollowUpTimer();

    if (hasLeadCaptured()) {
      return;
    }

    const state = getState();
    const hasUserTurn = Array.isArray(state.history) && state.history.some((item) => item.role === "user");
    if (!hasUserTurn) {
      return;
    }

    window.__chatbotIdleTimer = window.setTimeout(() => {
      const lastActivity = getLastActivityAt();
      if (!lastActivity || Date.now() - lastActivity < idleFollowUpDelayMs - 1500) {
        return;
      }

      triggerIdleFollowUp();
    }, idleFollowUpDelayMs);
  }

  function syncScroll() {
    const { messages } = getNodes();
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function renderSuggestionBar(items) {
    const { suggestions } = getNodes();
    if (!suggestions) {
      return;
    }

    suggestions.innerHTML = "";
    const seenDisplayLabels = new Set();

    dedupeSuggestions(items).forEach((label) => {
      const displayLabel = resolveSuggestionDisplayLabel(label);
      const displayKey = displayLabel.toLowerCase();

      if (!displayLabel || seenDisplayLabels.has(displayKey)) {
        return;
      }

      seenDisplayLabels.add(displayKey);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-suggestion";
      button.textContent = displayLabel;
      button.onclick = () => {
        window.pushSuggestion(label);
      };
      suggestions.appendChild(button);
    });
  }

  window.appendMessage = function appendMessage(role, text, options) {
    const { messages } = getNodes();
    if (!messages) {
      return;
    }

    const state = getState();
    const normalizedRole = role === "assistant" || role === "model" || role === "bot" ? "bot" : "user";
    const wrapper = document.createElement("div");
    wrapper.className = "chat-message chat-message--role-" + normalizedRole + " chat-message--" + normalizedRole;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble opacity-0 translate-y-2 transition-all duration-300";
    bubble.innerHTML = formatRichText(text);

    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);

    requestAnimationFrame(() => {
      bubble.classList.remove("opacity-0", "translate-y-2");
    });

    const skipHistory = options === true || (options && options.skipHistory === true);
    if (!skipHistory) {
      state.history.push({ role: normalizedRole, text: normalizeText(text) });
    }

    syncScroll();
  };

  window.appendSuggestions = function appendSuggestions(items) {
    renderSuggestionBar(
      Array.isArray(items)
        ? items.map((item) =>
            typeof item === "string" ? item : item && typeof item.label === "string" ? item.label : ""
          )
        : defaultSuggestions
    );
  };

  function resetConversation(messages) {
    const { messages: messagesNode } = getNodes();
    const state = getState();

    if (!messagesNode) {
      return;
    }

    messagesNode.innerHTML = "";
    state.history = [];
    state.loadingNode = null;

    messages.forEach((message) => {
      window.appendMessage("bot", message);
    });

    renderSuggestionBar(defaultSuggestions);
  }

  function getApiHistory(currentMessage) {
    const state = getState();
    const history = Array.isArray(state.history)
      ? state.history.map((item) => ({
          role: item.role === "bot" ? "assistant" : "user",
          text: normalizeText(item.text)
        }))
      : [];

    if (
      history.length > 0 &&
      history[history.length - 1].role === "user" &&
      history[history.length - 1].text === currentMessage
    ) {
      history.pop();
    }

    return history;
  }

  async function requestReply(message) {
    const response = await fetch("/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history: getApiHistory(message)
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Chatbot bridge failed with status " + response.status);
    }

    return response.json();
  }

  async function persistLeadCapture(payload) {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Lead capture failed with status " + response.status);
    }

    return response.json();
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  function readFieldValue(id) {
    const field = getElement(id);
    return field && typeof field.value === "string" ? normalizeText(field.value) : "";
  }

  function clearFormNotice(id) {
    const notice = getElement(id);
    if (!notice) {
      return;
    }

    notice.className = "hidden mt-4 rounded-2xl border px-4 py-3 text-sm leading-6";
    notice.textContent = "";
  }

  function renderFormNotice(id, tone, text) {
    const notice = getElement(id);
    if (!notice) {
      return;
    }

    const palette = {
      success: ["border-emerald-200", "bg-emerald-50", "text-emerald-700"],
      error: ["border-rose-200", "bg-rose-50", "text-rose-700"],
      neutral: ["border-slate-200", "bg-slate-50", "text-slate-600"]
    };

    notice.className = "mt-4 rounded-2xl border px-4 py-3 text-sm leading-6 block";
    (palette[tone] || palette.neutral).forEach((className) => notice.classList.add(className));
    notice.textContent = text;
  }

  function setButtonLoading(button, loading, idleHtml) {
    if (!button) {
      return;
    }

    if (loading) {
      button.disabled = true;
      button.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang gửi...';
      return;
    }

    button.disabled = false;
    button.innerHTML = idleHtml;
  }

  function resolveLeadHotness(need, budget) {
    const normalizedNeed = normalizeText(need).toLowerCase();
    const normalizedBudget = normalizeText(budget).toLowerCase();

    if (normalizedNeed.includes("đầu tư") || normalizedNeed.includes("giá") || normalizedNeed.includes("pháp lý")) {
      return "hot";
    }

    if (normalizedBudget.includes("1,5") || normalizedBudget.includes("trên 2")) {
      return "hot";
    }

    return "warm";
  }

  async function submitChat(rawText) {
    const text = normalizeText(rawText);
    const { input } = getNodes();

    if (!text) {
      return null;
    }

    hideMiniTeaser();
    clearIdleFollowUpTimer();
    persistChatActivity("user_message");

    if (input) {
      input.value = "";
    }

    window.appendMessage("user", text);
    if (typeof window.showTyping === "function") {
      window.showTyping();
    }

    try {
      const payload = await requestReply(text);
      if (typeof window.hideTyping === "function") {
        window.hideTyping();
      }
      window.appendMessage("bot", payload.reply);
      renderSuggestionBar(payload.suggestions || defaultSuggestions);

      if (payload && payload.leadCaptured) {
        markLeadCaptured("chatbot", payload.leadId);
      } else {
        scheduleIdleFollowUp();
      }

      recordEvent("chatbot_reply_rendered", {
        source: normalizeText(payload && payload.source ? payload.source : "unknown")
      });

      return payload;
    } catch (error) {
      console.error("Landing chatbot bridge error", error);
      if (typeof window.hideTyping === "function") {
        window.hideTyping();
      }
      window.appendMessage(
        "bot",
        "Dạ em có thể hỗ trợ anh/chị nhận **bảng giá nội bộ**, **video căn đẹp**, **pháp lý** hoặc **đặt lịch xem dự án**. Anh/chị để lại SĐT/Zalo giúp em để em gửi đúng phần mình cần nhé."
      );
      renderSuggestionBar(defaultSuggestions);
      scheduleIdleFollowUp();
      return null;
    }
  }

  function initChat() {
    const { input } = getNodes();
    if (!input) {
      return;
    }

    input.placeholder = inputPlaceholder;

    if (window.AI_CONFIG && window.AI_CONFIG.project) {
      window.AI_CONFIG.project.price = feedbackPriceAnchor;
    }

    resetConversation(initialMessages);
  }

  function openFeedbackWelcome() {
    try {
      if (sessionStorage.getItem(feedbackWelcomeKey)) {
        return;
      }
      sessionStorage.setItem(feedbackWelcomeKey, "true");
    } catch (error) {
      console.warn("Unable to persist chatbot welcome state", error);
    }

    resetConversation(welcomeMessages);
    renderSuggestionBar(defaultSuggestions);
    recordEvent("chatbot_welcome_shown", {
      device: window.innerWidth >= 1024 ? "desktop" : "mobile"
    });

    showMiniTeaser(mobileTeaserMessage, "Nhận giá 626");
  }

  function maybeShowReturningPrompt() {
    if (hasLeadCaptured()) {
      return false;
    }

    const lastActivity = getLastActivityAt();
    if (!lastActivity || Date.now() - lastActivity < returnVisitDelayMs) {
      return false;
    }

    try {
      const lastShown = Number(localStorage.getItem(feedbackReturnFollowUpKey) || "0");
      if (lastShown && Date.now() - lastShown < 12 * 60 * 60 * 1000) {
        return false;
      }

      localStorage.setItem(feedbackReturnFollowUpKey, String(Date.now()));
    } catch (error) {
      console.warn("Unable to persist returning chatbot state", error);
    }

    resetConversation([returningMessage, "Anh/chị muốn em gửi lại bảng giá 626 triệu hay căn thực tế giá tốt trước ạ?"]);
    renderSuggestionBar(returningSuggestions);
    recordEvent("chatbot_follow_up_1d", {
      device: window.innerWidth >= 1024 ? "desktop" : "mobile"
    });

    showMiniTeaser("Mình muốn nhận lại giá 626 hay xem căn thực tế ạ?", "Nhận giá 626");

    return true;
  }

  function openInitialChatPrompt() {
    if (maybeShowReturningPrompt()) {
      return;
    }

    openFeedbackWelcome();
  }

  function installBridge() {
    const nodes = getNodes();
    if (!nodes.messages || !nodes.input || typeof toggleChatbot !== "function") {
      return false;
    }

    if (window.__nativeLandingChatBridgeReady) {
      return true;
    }

    window.__nativeLandingChatBridgeReady = true;

    const nativeToggleChatbot = window.toggleChatbot;
    window.toggleChatbot = function toggleChatbotWithFeedback() {
      const stateBefore = getState();
      const wasOpen = Boolean(stateBefore && stateBefore.isOpen);
      hideMiniTeaser();
      const result = nativeToggleChatbot();
      const stateAfter = getState();
      const isOpen = Boolean(stateAfter && stateAfter.isOpen);

      if (!wasOpen && isOpen) {
        persistChatActivity("open_chatbot");
        recordEvent("chatbot_opened", {
          device: window.innerWidth >= 1024 ? "desktop" : "mobile"
        });
      }

      if (wasOpen && !isOpen) {
        recordEvent("chatbot_closed", {
          device: window.innerWidth >= 1024 ? "desktop" : "mobile"
        });
      }

      return result;
    };

    window.getChatResponse = async function getChatResponse(query) {
      const payload = await requestReply(normalizeText(query));
      renderSuggestionBar(payload.suggestions || defaultSuggestions);
      return payload.reply;
    };

    window.handleUserInput = function handleUserInput(text) {
      return submitChat(text);
    };

    window.handleAIResponse = function handleAIResponse(text) {
      return submitChat(text);
    };

    window.pushSuggestion = function pushSuggestion(text) {
      return submitChat(text);
    };

    window.handleSendMessage = function handleSendMessage() {
      const { input } = getNodes();
      return submitChat(input ? input.value : "");
    };

    window.startChatFromLanding = function startChatFromLanding(prompt) {
      const state = getState();
      const nextPrompt = normalizeText(prompt) || defaultSuggestions[0];

      if (typeof toggleChatbot === "function" && !state.isOpen) {
        toggleChatbot();
      }

      return submitChat(nextPrompt);
    };

    window.submitLeadForm = async function submitLeadForm(event) {
      event.preventDefault();
      clearFormNotice("lead-form-notice");

      const fullName = readFieldValue("lead-full-name");
      const phoneOrZalo = readFieldValue("lead-contact");
      const need = readFieldValue("lead-need");
      const budget = readFieldValue("lead-budget");
      const contactPreference = readFieldValue("lead-contact-preference");
      const submitButton = getElement("lead-submit-btn");
      const form = getElement("lead-capture-form");

      if (!fullName || !phoneOrZalo) {
        renderFormNotice("lead-form-notice", "error", "Anh/chị vui lòng để lại họ tên và ít nhất một cách liên hệ để hệ thống gửi đúng phần mình cần.");
        return false;
      }

      setButtonLoading(submitButton, true, "Nhận thông tin dự án");

      try {
        const leadResponse = await persistLeadCapture({
          source: "landing_form",
          fullName,
          phoneOrZalo,
          need,
          budget,
          contactPreference,
          hotness: resolveLeadHotness(need, budget),
          notes: "Khách để lại thông tin từ form landing để nhận bảng giá, video hoặc pháp lý.",
          metadata: {
            entryPoint: "landing_lead_form"
          }
        });

        markLeadCaptured("landing_form", leadResponse && leadResponse.lead ? leadResponse.lead.id : "");
        recordEvent("landing_lead_form_submitted", {
          contactPreference,
          need,
          budget
        });

        if (form && typeof form.reset === "function") {
          form.reset();
        }

        renderFormNotice("lead-form-notice", "success", "Thông tin đã được ghi nhận. Thông tin anh/chị đang quan tâm sẽ được gửi trong ít phút tới.");
      } catch (error) {
        console.error("Landing lead form submit error", error);
        renderFormNotice("lead-form-notice", "error", "Hệ thống đang bận một chút. Anh/chị vui lòng thử lại sau hoặc nhắn qua chatbot để được hỗ trợ ngay.");
      } finally {
        setButtonLoading(submitButton, false, "Nhận thông tin dự án");
      }

      return false;
    };

    window.submitBooking = async function submitBooking(event) {
      event.preventDefault();
      clearFormNotice("booking-form-notice");

      const fullName = readFieldValue("booking-full-name");
      const phoneOrZalo = readFieldValue("booking-contact");
      const need = readFieldValue("booking-need");
      const budget = readFieldValue("booking-budget");
      const contactPreference = readFieldValue("booking-contact-preference");
      const productId = readFieldValue("booking-product-id");
      const productNameNode = getElement("booking-product-name");
      const productName = productNameNode ? normalizeText(productNameNode.textContent || "") : "";
      const submitButton = getElement("submit-booking-btn");
      const successLayer = getElement("booking-success");

      if (!fullName || !phoneOrZalo) {
        renderFormNotice("booking-form-notice", "error", "Anh/chị vui lòng để lại họ tên và thông tin liên hệ để hệ thống gửi phần phù hợp của sản phẩm này.");
        return false;
      }

      setButtonLoading(submitButton, true, 'Nhận bảng giá & video <i class="fa-solid fa-arrow-right"></i>');

      try {
        const leadResponse = await persistLeadCapture({
          source: "booking_modal",
          fullName,
          phoneOrZalo,
          need,
          budget,
          contactPreference,
          hotness: resolveLeadHotness(need, budget),
          notes: "Khách xin bảng giá và video từ modal sản phẩm: " + productName,
          metadata: {
            entryPoint: "product_modal",
            productId,
            productName
          }
        });

        markLeadCaptured("booking_modal", leadResponse && leadResponse.lead ? leadResponse.lead.id : "");
        recordEvent("product_modal_lead_submitted", {
          productId,
          productName,
          contactPreference
        });

        if (successLayer) {
          successLayer.classList.remove("opacity-0", "pointer-events-none");
          successLayer.classList.add("opacity-100", "pointer-events-auto");
        }
      } catch (error) {
        console.error("Product modal lead submit error", error);
        renderFormNotice("booking-form-notice", "error", "Hệ thống đang bận một chút. Anh/chị vui lòng thử lại sau hoặc nhắn chatbot để nhận thông tin ngay.");
      } finally {
        setButtonLoading(submitButton, false, 'Nhận bảng giá & video <i class="fa-solid fa-arrow-right"></i>');
      }

      return false;
    };

    if (typeof window.openBookingModal === "function") {
      const nativeOpenBookingModal = window.openBookingModal;
      window.openBookingModal = function openBookingModalWithReset(productId) {
        nativeOpenBookingModal(productId);
        window.setTimeout(() => {
          clearFormNotice("booking-form-notice");
          const submitButton = getElement("submit-booking-btn");
          setButtonLoading(submitButton, false, 'Nhận bảng giá & video <i class="fa-solid fa-arrow-right"></i>');
        }, 360);
      };
    }

    initChat();

    if (document.readyState === "complete") {
      window.setTimeout(openInitialChatPrompt, desktopWelcomeDelayMs);
    } else {
      window.addEventListener(
        "load",
        () => {
          window.setTimeout(openInitialChatPrompt, desktopWelcomeDelayMs);
        },
        { once: true }
      );
    }

    return true;
  }

  if (!installBridge()) {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (installBridge() || attempts > 80) {
        window.clearInterval(timer);
      }
    }, 150);
  }
})();
`;
export default function HomePage() {
  return (
    <>
      <NativeOriginalLanding />
      <Script id="native-landing-config" strategy="afterInteractive">
        {NATIVE_LANDING_CONFIG_SCRIPT}
      </Script>
      <Script id="chatbot-feedback-bridge" strategy="afterInteractive">
        {chatbotBridgeScript}
      </Script>
      <Script id="native-landing-main" strategy="afterInteractive">
        {NATIVE_LANDING_MAIN_SCRIPT}
      </Script>
      <Script id="native-inline-event-bridge" strategy="afterInteractive">
        {inlineEventBridgeScript}
      </Script>
      <Script id="vr-tour-bridge" strategy="afterInteractive">
        {vrTourBridgeScript}
      </Script>
    </>
  );
}












