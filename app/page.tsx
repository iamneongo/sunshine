import Script from "next/script";
import NativeOriginalLanding from "@/app/_components/native-original-landing";
import {
  CHATBOT_PLACEHOLDER,
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
const initialMessages = [INITIAL_CHAT_MESSAGE, "Anh/chị muốn xem phần nào trước ạ?"];
const welcomeMessages = [WELCOME_MESSAGE, "Anh/chị muốn xem phần nào trước ạ?"];

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

const chatbotBridgeScript = `
(() => {
  const defaultSuggestions = ${JSON.stringify(defaultSuggestions)};
  const initialMessages = ${JSON.stringify(initialMessages)};
  const welcomeMessages = ${JSON.stringify(welcomeMessages)};
  const inputPlaceholder = ${JSON.stringify(CHATBOT_PLACEHOLDER)};
  const legacyWelcomeKey = "seen_sunshine_welcome_v2";
  const feedbackWelcomeKey = "seen_sunshine_feedback_welcome_v1";
  const feedbackPriceAnchor = ${JSON.stringify(PROJECT_CONTEXT.priceAnchor)};

  try {
    sessionStorage.setItem(legacyWelcomeKey, "true");
  } catch (error) {
    console.warn("Unable to update legacy chatbot welcome state", error);
  }

  function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
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

    dedupeSuggestions(items).forEach((label) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-suggestion";
      button.textContent = label;
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

  async function submitChat(rawText) {
    const text = normalizeText(rawText);
    const { input } = getNodes();

    if (!text) {
      return null;
    }

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

    const state = getState();
    resetConversation(welcomeMessages);

    if (window.innerWidth >= 1024 && typeof toggleChatbot === "function" && !state.isOpen) {
      toggleChatbot();
    }
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

    initChat();

    if (document.readyState === "complete") {
      window.setTimeout(openFeedbackWelcome, 2400);
    } else {
      window.addEventListener(
        "load",
        () => {
          window.setTimeout(openFeedbackWelcome, 2400);
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
      <Script id="native-landing-main" strategy="afterInteractive">
        {NATIVE_LANDING_MAIN_SCRIPT}
      </Script>
      <Script id="native-inline-event-bridge" strategy="afterInteractive">
        {inlineEventBridgeScript}
      </Script>
      <Script id="chatbot-feedback-bridge" strategy="afterInteractive">
        {chatbotBridgeScript}
      </Script>
    </>
  );
}

