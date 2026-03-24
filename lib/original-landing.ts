import fs from "node:fs";
import path from "node:path";
import {
  CHATBOT_PLACEHOLDER,
  DEFAULT_QUICK_ACTIONS,
  INITIAL_CHAT_MESSAGE,
  WELCOME_MESSAGE
} from "./chatbot-config";

type Chunk =
  | {
      type: "html";
      content: string;
    }
  | {
      type: "script";
      content: string;
    };

type OriginalLanding = {
  bodyClassName: string;
  bodyChunks: Chunk[];
  headStyle: string;
  htmlClassName: string;
  title: string;
  tailwindConfig: string;
};

let cachedLanding: OriginalLanding | null = null;

const SCRIPT_TAG_REGEX = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;

function normalizeContent(content: string): string {
  return content.replace(/\r\n?/g, "\n");
}

function matchOrThrow(content: string, regex: RegExp, label: string): string {
  const match = content.match(regex);

  if (!match?.[1]) {
    throw new Error(`Unable to extract ${label} from original HTML.`);
  }

  return match[1].trim();
}

function buildStaticSuggestionButtons(): string {
  return DEFAULT_QUICK_ACTIONS.map(
    (action) =>
      `                <button class="chat-suggestion" onclick="pushSuggestion('${action.prompt.replace(/'/g, "&#39;")}')">${action.label}</button>`
  ).join("\n");
}

function transformHtmlChunk(content: string): string {
  let html = normalizeContent(content);

  html = html.replace(
    /Xin chào![\s\S]*?\*\*Sunshine Bay Retreat\*\*\./,
    INITIAL_CHAT_MESSAGE
  );

  html = html.replace(
    /<div id="chat-suggestions" class="px-5 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">[\s\S]*?<\/div>/,
    `<div id="chat-suggestions" class="px-5 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">\n${buildStaticSuggestionButtons()}\n            </div>`
  );

  html = html.replace(
    'placeholder="Hỏi về Sunshine Bay..."',
    `placeholder="${CHATBOT_PLACEHOLDER}"`
  );

  html = html.replace(/Kiến tạo\s+di sản nghỉ dưỡng/, "Giỏ hàng nội bộ đang mở bán");

  html = html.replace(
    /<h1[\s\S]*?class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 hero-title tracking-tight uppercase">[\s\S]*?<\/h1>/,
    `<h1
                            class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 hero-title tracking-tight uppercase">
                            Căn Hộ Biển <br /> <span class="italic font-light">Vũng Tàu</span> Chỉ Từ 1,2 Tỷ
                        </h1>`
  );

  html = html.replace(
    /<p class="text-white\/70 text-base md:text-lg max-w-xl mb-6 sm:mb-8 font-medium leading-\[1\.6\]">[\s\S]*?<\/p>/,
    `<p class="text-white/80 text-base md:text-lg max-w-xl mb-5 sm:mb-6 font-medium leading-[1.6]">
                            Dòng căn hộ biển dễ vào tiền, phù hợp cả đầu tư lẫn nghỉ dưỡng. Giỏ hàng hiện ưu tiên các căn
                            view đẹp, dễ khai thác và đang được hỏi nhiều trong hôm nay.
                        </p>

                        <div class="flex flex-wrap gap-2.5 sm:gap-3 mb-6 sm:mb-8 max-w-2xl">
                            <div
                                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                <i class="fa-solid fa-sack-dollar text-primary-container"></i>
                                <span>Khai thác kỳ vọng 8-12%/năm</span>
                            </div>
                            <div
                                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                <i class="fa-solid fa-chart-line text-primary-container"></i>
                                <span>Tăng giá kỳ vọng 15%/năm</span>
                            </div>
                            <div
                                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                <i class="fa-solid fa-fire text-primary-container"></i>
                                <span>Chỉ còn 27 căn view biển đẹp</span>
                            </div>
                        </div>`
  );

  html = html.replace("Giá chỉ từ</div>", "Chỉ từ</div>");

  html = html.replace(
    `6x <span class="text-xs sm:text-sm not-italic font-bold ml-0.5">tr/m²</span>`,
    `1,2 TỶ
                                            <span class="block text-[10px] sm:text-xs not-italic font-bold text-white/70 mt-1">
                                                (Tương đương 6x triệu/m²)
                                            </span>`
  );

  html = html.replace(/Tiêu chuẩn<\/div>/, "Tình trạng</div>");
  html = html.replace(/5 SAO FULL<\/div>/, "ĐÃ BÁN 73%</div>");

  html = html.replace(
    /<div class="text-\[9px\] sm:text-\[10px\] text-white\/90 font-medium leading-\[1\.4\]">Bàn[\s\S]*?<\/div>/,
    `<div class="text-[9px] sm:text-[10px] text-white/90 font-medium leading-[1.4]">
                                        Giỏ nội bộ hôm nay: <br /> <span
                                            class="text-primary-container font-black text-[10px] sm:text-[11px] tracking-wide">CHỈ CÒN 27 CĂN ĐẸP</span>
                                    </div>`
  );

  html = html.replace(
    `<button onclick="toggleChatbot()"
                                class="gold-button flex-1 py-3 px-4 sm:px-8 sm:py-4 rounded-full text-white font-black shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                <div class="relative shrink-0">
                                    <img src="./ai_avatar_vn.png"
                                        class="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border border-white/30"
                                        alt="AI Avatar" />
                                    <div
                                        class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-primary sm:hidden">
                                    </div>
                                </div>
                                <span
                                    class="text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap leading-none mt-0.5">Tư
                                    vấn AI</span>
                            </button>`,
    `<button onclick="openSalesChat('Nhận bảng giá nội bộ')"
                                class="gold-button flex-1 py-3 px-4 sm:px-8 sm:py-4 rounded-full text-white font-black shadow-2xl flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-transform">
                                <i class="fa-solid fa-file-invoice-dollar text-sm sm:text-base"></i>
                                <span
                                    class="text-[11px] sm:text-sm uppercase tracking-[0.18em] whitespace-nowrap leading-none mt-0.5">Nhận
                                    Bảng Giá Nội Bộ</span>
                            </button>`
  );

  html = html.replace(
    `<button onclick="openVRImage()"
                                class="flex-none flex items-center justify-center gap-2 group bg-white/10 backdrop-blur-md sm:bg-transparent sm:border-none border border-white/20 pr-4 sm:pr-0 pl-1 py-1 sm:p-0 rounded-full transition-all hover:bg-white/20">
                                <div
                                    class="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/40 sm:bg-transparent border border-white/20 sm:border-2 sm:border-white/20 flex items-center justify-center text-white text-xs sm:text-lg group-hover:bg-primary-container group-hover:border-primary-container transition-all shrink-0">
                                    <i class="fa-solid fa-play ml-0.5"></i>
                                </div>
                                <span
                                    class="text-white font-black text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap leading-none mt-0.5 pr-1 sm:pr-0">360°
                                    VR</span>
                            </button>`,
    `<button onclick="openVideoSalesFlow()"
                                class="flex-none flex items-center justify-center gap-2 group bg-white/10 backdrop-blur-md border border-white/20 pr-4 sm:pr-5 pl-1 py-1 rounded-full transition-all hover:bg-white/20">
                                <div
                                    class="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/40 border border-white/20 sm:border-2 sm:border-white/20 flex items-center justify-center text-white text-xs sm:text-lg group-hover:bg-primary-container group-hover:border-primary-container transition-all shrink-0">
                                    <i class="fa-solid fa-play ml-0.5"></i>
                                </div>
                                <span
                                    class="text-white font-black text-[11px] sm:text-sm uppercase tracking-[0.18em] whitespace-nowrap leading-none mt-0.5 pr-1 sm:pr-0">Xem
                                    Video Căn Đẹp Nhất</span>
                            </button>`
  );

  html = html.replace(/>Từ 6x triệu\/m²/g, ">Từ 1,2 tỷ/căn");

  return html;
}

function transformScriptContent(content: string): string {
  let script = normalizeContent(content).trim();

  script = script.replace('price: "6x triệu/m²",', 'price: "Từ 1,2 tỷ/căn",');
  script = script.replace("price: 'Từ 6x triệu/m²',", "price: 'Từ 1,2 tỷ/căn',");

  script = script.replace(
    'window.addEventListener("load", reveal);',
    `if (document.readyState === "complete") {
            reveal();
        } else {
            window.addEventListener("load", reveal, { once: true });
        }`
  );

  script = script.replace(
    "window.addEventListener('load', () => {",
    "const runWelcomeScript = () => {"
  );

  script = script.replace(
    `        function toggleChatbot() {
            chatbotState.isOpen = !chatbotState.isOpen;
            chatbotPanel.classList.toggle('open', chatbotState.isOpen);
        }`,
    `        function toggleChatbot() {
            chatbotState.isOpen = !chatbotState.isOpen;
            chatbotPanel.classList.toggle('open', chatbotState.isOpen);
        }

        function openSalesChat(prompt) {
            const wasOpen = chatbotState.isOpen;
            if (!wasOpen) {
                toggleChatbot();
            }

            setTimeout(() => {
                pushSuggestion(prompt);
            }, wasOpen ? 0 : 280);
        }

        function openVideoSalesFlow() {
            const section = document.getElementById('tvc');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            setTimeout(() => {
                openSalesChat('Xem video căn đẹp');
            }, 450);
        }`
  );

  script = script.replace(
    `        });

        // Trigger AI on Enter key`,
    `        };

        if (document.readyState === "complete") {
            runWelcomeScript();
        } else {
            window.addEventListener("load", runWelcomeScript, { once: true });
        }

        // Trigger AI on Enter key`
  );

  script = script.replace(
    "bubble.innerHTML = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');",
    "bubble.innerHTML = formatChatMessage(text);"
  );

  script = script.replace(
    "function appendMessage(role, text) {",
    `function escapeChatHtml(text) {
            return text.replace(/[&<>\"']/g, (char) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\"': '&quot;',
                "'": '&#39;'
            }[char] || char));
        }

        function formatChatMessage(text) {
            return escapeChatHtml(text)
                .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                .replace(/\\n/g, '<br />');
        }

        function appendMessage(role, text) {`
  );

  script = script.replace(
    "btn.textContent = s.label;",
    "const suggestionLabel = typeof s === 'string' ? s : s.label;\n                btn.textContent = suggestionLabel;"
  );

  script = script.replace(
    "handleUserInput(s.label);",
    "handleUserInput(suggestionLabel);"
  );

  script = script.replace(
    /async function handleAIResponse\(text\) \{[\s\S]*?\n        \}/,
    `async function handleAIResponse(text) {
            showTyping();
            try {
                const response = await getChatResponse(text);
                hideTyping();
                appendMessage('bot', response);
            } catch (error) {
                console.error('Chatbot API error:', error);
                hideTyping();
                appendMessage('bot', 'Dạ em đang xử lý hơi chậm một chút. Anh/chị để lại **SĐT/Zalo**, em sẽ gửi ngay bảng giá nội bộ và video căn đẹp nhất ạ.');
                appendSuggestions(${JSON.stringify(DEFAULT_QUICK_ACTIONS.map((item) => item.prompt))});
            }
        }`
  );

  script = script.replace(
    /const welcomeMsg = ".*?";/,
    `const welcomeMsg = ${JSON.stringify(WELCOME_MESSAGE)};`
  );

  script = script.replace(
    /appendMessage\('bot', "Dưới đây là một số thông tin bạn có thể đang quan tâm:", true\);[\s\S]*?sessionStorage\.setItem\('seen_sunshine_welcome_v2', 'true'\);/,
    `appendMessage('bot', "Anh/chị muốn xem phần nào trước ạ?");
                        appendSuggestions(${JSON.stringify(DEFAULT_QUICK_ACTIONS.map((item) => item.prompt))});

                    }, 1200);

                    sessionStorage.setItem('seen_sunshine_welcome_v3', 'true');`
  );

  script = script.replace(/seen_sunshine_welcome_v2/g, "seen_sunshine_welcome_v3");
  script = script.replace("}, 1000); // Appear faster (1s after load)", "}, 6000);");

  script = script.replace(
    /async function handleSendMessage\(\) \{[\s\S]*?\n        \}/,
    `async function handleSendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage('user', text);
            chatInput.value = "";

            showTyping();

            try {
                const response = await getChatResponse(text);
                hideTyping();
                appendMessage('bot', response);
            } catch (error) {
                console.error('Chatbot send error:', error);
                hideTyping();
                appendMessage('bot', 'Dạ em có thể hỗ trợ anh/chị nhận bảng giá nội bộ, video căn đẹp hoặc đặt lịch xem dự án. Anh/chị để lại **SĐT/Zalo** giúp em nhé.');
                appendSuggestions(${JSON.stringify(DEFAULT_QUICK_ACTIONS.map((item) => item.prompt))});
            }
        }`
  );

  const legacyChatResponseStart = script.indexOf("async function getChatResponse(query) {");
  const legacyVrMarker = script.indexOf("        // --- VR 360 INTERACTIVE EXPERIENCE ---");

  if (legacyChatResponseStart !== -1 && legacyVrMarker !== -1) {
    const replacement = `async function getChatResponse(query) {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: query,
                    history: chatbotState.history
                        .filter(item => item.role === 'user' || item.role === 'bot')
                        .slice(-10)
                        .map(item => ({
                            role: item.role === 'bot' ? 'assistant' : 'user',
                            text: item.text
                        }))
                })
            });

            if (!response.ok) {
                throw new Error('Chatbot API returned ' + response.status);
            }

            const data = await response.json();

            if (Array.isArray(data.suggestions) && data.suggestions.length) {
                setTimeout(() => appendSuggestions(data.suggestions), 250);
            }

            if (typeof data.reply === 'string' && data.reply.trim()) {
                return data.reply.trim();
            }

            return getLocalFallbackResponse(query);
        }

        function getLocalFallbackResponse(query) {
            const normalized = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (/(gia|bao nhieu|bang gia|1,2 ty|1.2 ty|tong tien)/.test(normalized)) {
                return "Dạ hiện giỏ hàng đang có các căn **từ 1,2 tỷ/căn** tùy vị trí và thời điểm. Anh/chị để lại **SĐT/Zalo**, em gửi ngay **bảng giá nội bộ** và căn đẹp nhất hôm nay ạ.";
            }

            if (/(video|can dep|view dep|hinh anh|thuc te|vr)/.test(normalized)) {
                return "Dạ em có video ngắn và hình thực tế của các căn đang được quan tâm nhất. Anh/chị muốn xem nhóm **đầu tư giá tốt** hay **view đẹp nghỉ dưỡng**, rồi để lại **SĐT/Zalo** giúp em để em gửi đúng căn ạ.";
            }

            if (/(dau tu|sinh loi|dong tien|cho thue|tang gia)/.test(normalized)) {
                return "Dạ với nhu cầu đầu tư, em đang ưu tiên nhóm căn dễ vào tiền từ **1,2 tỷ**, có thể khai thác cho thuê và có biên độ tăng giá tốt. Anh/chị cho em xin **SĐT/Zalo**, em lọc ngay giỏ hàng phù hợp ạ.";
            }

            if (/(phap ly|so hong|giay to|chu dau tu)/.test(normalized)) {
                return "Dạ em có thể gửi thông tin pháp lý, chính sách bán hàng và tài liệu giới thiệu dự án. Anh/chị để lại **SĐT/Zalo**, em gửi ngay file phù hợp ạ.";
            }

            return "Dạ em có thể hỗ trợ anh/chị xem **bảng giá nội bộ**, **video căn đẹp**, **pháp lý** hoặc **đặt lịch xem dự án**. Anh/chị muốn em gửi phần nào trước ạ?";
        }`;

    script =
      script.slice(0, legacyChatResponseStart) +
      replacement +
      "\n\n" +
      script.slice(legacyVrMarker);
  }

  return script;
}

function splitBodyIntoChunks(bodyContent: string): Chunk[] {
  const chunks: Chunk[] = [];
  const normalizedBody = normalizeContent(bodyContent);
  let cursor = 0;

  for (const match of normalizedBody.matchAll(SCRIPT_TAG_REGEX)) {
    const start = match.index ?? 0;
    const fullMatch = match[0];
    const scriptContent = match[1]?.trim() ?? "";

    if (start > cursor) {
      const htmlContent = normalizedBody.slice(cursor, start).trim();

      if (htmlContent) {
        chunks.push({
          type: "html",
          content: transformHtmlChunk(htmlContent)
        });
      }
    }

    if (scriptContent) {
      chunks.push({
        type: "script",
        content: transformScriptContent(scriptContent)
      });
    }

    cursor = start + fullMatch.length;
  }

  const trailingHtml = normalizedBody.slice(cursor).trim();

  if (trailingHtml) {
    chunks.push({
      type: "html",
      content: transformHtmlChunk(trailingHtml)
    });
  }

  return chunks;
}

export function getOriginalLanding(): OriginalLanding {
  if (cachedLanding) {
    return cachedLanding;
  }

  const sourcePath = path.join(process.cwd(), "index.html");
  const html = normalizeContent(fs.readFileSync(sourcePath, "utf8"));

  const title = matchOrThrow(html, /<title>([\s\S]*?)<\/title>/i, "title");
  const htmlClassName = matchOrThrow(
    html,
    /<html[^>]*class="([^"]*)"[^>]*>/i,
    "html class"
  );
  const bodyClassName = matchOrThrow(
    html,
    /<body[^>]*class="([^"]*)"[^>]*>/i,
    "body class"
  );
  const tailwindConfig = matchOrThrow(
    html,
    /<script[^>]*id="tailwind-config"[^>]*>([\s\S]*?)<\/script>/i,
    "tailwind config"
  );
  const headStyle = matchOrThrow(
    html,
    /<style>([\s\S]*?)<\/style>/i,
    "head style"
  );
  const bodyContent = matchOrThrow(html, /<body[^>]*>([\s\S]*?)<\/body>/i, "body");

  cachedLanding = {
    title,
    htmlClassName,
    bodyClassName,
    tailwindConfig,
    headStyle,
    bodyChunks: splitBodyIntoChunks(bodyContent)
  };

  return cachedLanding;
}


