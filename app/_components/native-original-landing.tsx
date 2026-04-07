import { NATIVE_LANDING_FAQS } from "@/lib/native-original-seo";

export default function NativeOriginalLanding() {
    return (
        <>
            <div id="sidebar-overlay" className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-[200] opacity-0 pointer-events-none"
                data-onclick="toggleSidebar()"></div>
            <aside id="mobile-sidebar"
                className="fixed top-0 right-0 w-[80%] max-w-[320px] h-full bg-white z-[300] shadow-2xl translate-x-full">
                <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <div className="text-lg font-black text-primary uppercase leading-tight">
                            Sunshine <br /> <span className="text-primary-container">Retreat</span>
                        </div>
                        <button type="button" data-onclick="toggleSidebar()"
                            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-8">
                        <div>
                            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-primary-container/70">Khám phá</div>
                            <div className="flex flex-col gap-3 text-base font-bold text-primary/80">
                                <a href="#vitri" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">Vị trí</a>
                                <a href="#tienich" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">Tiện ích</a>
                                <a href="#matbang" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">Mặt bằng</a>
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-primary-container/70">Thông tin</div>
                            <div className="flex flex-col gap-3 text-base font-bold text-primary/80">
                                <button type="button" data-onclick="toggleSidebar(); startChatFromLanding('Nhận bảng giá nội bộ')"
                                    className="text-left hover:text-primary-container transition-colors py-1">Bảng giá</button>
                                <button type="button" data-onclick="toggleSidebar(); startChatFromLanding('Xem pháp lý')"
                                    className="text-left hover:text-primary-container transition-colors py-1">Pháp lý</button>
                                <a href="#tiendo" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">Tiến độ</a>
                                <a href="#faq" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">FAQ</a>
                            </div>
                        </div>
                        <div>
                            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.24em] text-primary-container/70">Liên hệ</div>
                            <div className="flex flex-col gap-3 text-base font-bold text-primary/80">
                                <a href="tel:0908345808" className="hover:text-primary-container transition-colors py-1">Gọi ngay</a>
                                <a href="https://zalo.me/0908345808" target="_blank" className="hover:text-primary-container transition-colors py-1">Zalo</a>
                                <a href="#tvc" data-onclick="toggleSidebar()"
                                    className="hover:text-primary-container transition-colors py-1">Xem video</a>
                            </div>
                        </div>
                    </nav>
                    <div className="mt-auto">
                        <div className="flex justify-center gap-3 mb-6">
                            <a href="https://www.facebook.com/share/1GLKHFqTzU/?mibextid=wwXIfr" target="_blank"
                                className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-colors"><i
                                    className="fa-brands fa-facebook-f"></i></a>
                            <a href="https://www.tiktok.com/@dinhngoctuan81?_r=1&_t=ZS-94vChivqKdF" target="_blank"
                                className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-colors"><i
                                    className="fa-brands fa-tiktok"></i></a>
                            <a href="https://www.tiktok.com/@taituan_land?_r=1&_t=ZS-94vCTydDilt" target="_blank"
                                className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-colors"><i
                                    className="fa-brands fa-tiktok"></i></a>
                            <a href="tel:0908345808"
                                className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-colors"><i
                                    className="fa-solid fa-phone"></i></a>
                            <a href="https://zalo.me/0908345808" target="_blank"
                                className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary hover:bg-primary-container hover:text-white transition-colors overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 50 50" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z"
                                        fill="#0068FF" />
                                    <path opacity="0.12" fillRule="evenodd" clipRule="evenodd"
                                        d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z"
                                        fill="#001A33" />
                                    <path fillRule="evenodd" clipRule="evenodd"
                                        d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
                                        fill="white" />
                                    <path
                                        d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
                                        fill="#0068FF" />
                                    <path
                                        d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
                                        fill="#0068FF" />
                                    <path
                                        d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
                                        fill="#0068FF" />
                                    <path
                                        d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
                                        fill="#0068FF" />
                                    <path
                                        d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"
                                        fill="#0068FF" />
                                </svg>
                            </a>
                        </div>
                        <div className="bg-surface-container rounded-2xl p-6 text-center">
                            <div className="text-[10px] font-black text-primary-container uppercase tracking-widest mb-1">Hỗ trợ
                                trực tuyến</div>
                            <div className="text-sm font-bold text-primary mb-4">Trò chuyện với trợ lý AI Sunshine 24/7</div>
                            <button type="button" data-onclick="toggleSidebar(); toggleChatbot();"
                                className="gold-button block py-3 rounded-full text-white font-black text-xs uppercase tracking-widest no-underline shadow-lg w-full">Chat
                                Ngay</button>
                        </div>
                    </div>
                </div>
            </aside>


            <nav id="navbar" className="fixed top-0 w-full z-[150] glass-nav transition-all duration-300 py-3">
                <div className="app-container flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-crown text-primary-container text-xl drop-shadow-sm"></i>
                        <div
                            className="text-lg md:text-xl font-black text-primary tracking-tighter font-headline uppercase leading-none">
                            Sunshine Bay <span className="text-primary-container">Retreat</span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#vitri">
                            Vị trí
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#tienich">
                            Tiện ích
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#matbang">
                            Mặt bằng
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#tiendo">
                            Tiến độ
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#faq">
                            FAQ
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                        <a className="text-primary/70 hover:text-primary font-headline font-bold text-xs tracking-[0.1em] uppercase transition-all relative group"
                            href="#contact">
                            Nhận thông tin
                            <span
                                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-container transition-all group-hover:w-full"></span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="button" data-onclick="toggleChatbot()"
                            className="hidden sm:flex items-center gap-3 bg-primary text-white px-6 py-2.5 rounded-full font-headline font-bold text-[10px] tracking-widest uppercase hover:bg-primary-container transition-all shadow-md group">
                            <img src="./ai_avatar_vn.png"
                                className="w-6 h-6 rounded-full object-cover border border-white/20 group-hover:scale-110 transition-transform"
                                alt="AI Chatbot" />
                            AI tư vấn 24/7
                        </button>
                        <button type="button" data-onclick="toggleSidebar()"
                            className="lg:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary text-lg">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pb-24 md:pb-0">

                <section className="hero-banner-section relative min-h-[100svh] flex items-center overflow-hidden bg-primary">

                    <div className="absolute inset-0 z-0">
                        <img alt="Phối cảnh Sunshine Bay Retreat Vũng Tàu" fetchPriority="high" decoding="async" className="w-full h-full object-cover hero-img opacity-90 scale-105"
                            src="./sunshine-bay-retreat-28.jpg" />
                        <div className="absolute inset-0 animated-gradient-overlay mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
                    </div>

                    <div className="app-container hero-banner-content relative z-10 pt-24 pb-32 sm:pt-24 sm:pb-28 lg:pt-20 lg:pb-20">
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">

                            <div className="reveal animate-fade-in-up hero-copy">
                                <div
                                    className="hero-kicker inline-flex max-w-full items-center gap-2 rounded-full border border-primary-container/30 bg-primary-container/20 px-4 py-2 backdrop-blur-md mb-4 sm:mb-6">
                                    <span className="text-[10px] sm:text-xs">🌏</span>
                                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.16em] sm:tracking-[2.4px] text-white leading-tight">Vũng
                                        Tàu – Điểm Đến Biển Hàng Đầu Châu Á 2025</span>
                                </div>

                                <h1
                                    className="hero-title hero-title--mobile mb-2 text-[2.85rem] font-black uppercase tracking-tight text-white leading-[1.02] sm:mb-3 sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl">
                                    <span className="hero-title-line hero-title-line--eyebrow">Đầu Tư Từ</span>
                                    <span className="hero-title-line hero-title-line--accent">626 Triệu</span>
                                    <span className="hero-title-line hero-title-line--support">Tạo Dòng Tiền Cho Thuê Ổn Định</span>
                                </h1>

                                <div className="hero-award-line mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/90 backdrop-blur-md sm:mb-6">
                                    <span>🏆</span>
                                    <span>World Travel Awards vinh danh</span>
                                </div>

                                <div className="hero-highlights mb-6 flex max-w-xl flex-wrap gap-3 sm:mb-8">
                                    <div className="hero-highlight-chip inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                        <span>📈</span>
                                        Chính sách lợi nhuận dự kiến 12–18%/năm*
                                    </div>
                                    <div className="hero-highlight-chip inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                        <span>🌴</span>
                                        Vừa nghỉ dưỡng – vừa sinh lời bền vững
                                    </div>
                                </div>



                                <div
                                    className="hero-actions mx-auto flex w-full max-w-[360px] flex-col items-stretch gap-3 sm:mx-0 sm:max-w-none sm:flex-row sm:items-center sm:gap-4 lg:w-auto lg:max-w-fit lg:gap-3 xl:gap-3.5">
                                    <button type="button" data-onclick="startChatFromLanding('Nhận bảng giá 03/2026')"
                                        className="gold-button flex-1 py-3 px-4 sm:px-8 sm:py-4 lg:flex-none lg:px-5 lg:py-3.5 xl:px-6 rounded-full text-white font-black shadow-2xl flex items-center justify-center gap-3 lg:gap-2 hover:scale-[1.02] transition-transform">
                                        <i className="fa-solid fa-file-lines text-sm sm:text-base lg:text-sm"></i>
                                        <span
                                            className="text-[11px] sm:text-sm lg:text-[11px] uppercase tracking-[0.12em] lg:tracking-[0.1em] leading-tight text-center mt-0.5">🔥
                                            Nhận bảng giá + suất đẹp hôm nay</span>
                                    </button>
                                    <button type="button" data-onclick="startChatFromLanding('Xem video căn đẹp')"
                                        className="flex-none flex items-center justify-center gap-2 group bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 sm:px-6 lg:px-[1.125rem] lg:py-3.5 rounded-full transition-all hover:bg-white/20">
                                        <div
                                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-9 lg:h-9 rounded-full bg-primary/40 border border-white/20 flex items-center justify-center text-white text-xs sm:text-base lg:text-sm group-hover:bg-primary-container group-hover:border-primary-container transition-all shrink-0">
                                            <i className="fa-solid fa-play ml-0.5"></i>
                                        </div>
                                        <span
                                            className="text-white font-black text-[11px] sm:text-sm lg:text-[11px] uppercase tracking-widest lg:tracking-[0.12em] whitespace-nowrap leading-none mt-0.5">Xem
                                            không gian</span>
                                    </button>
                                </div>


                                <div className="hero-mobile-metric-card lg:hidden relative mt-5 mb-6 sm:mt-6 sm:mb-8 w-full max-w-[340px] mx-auto sm:mx-0 sm:max-w-[360px]">
                                    <div className="absolute -inset-1 bg-primary-container/20 blur-xl rounded-2xl"></div>
                                    <div
                                        className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-2xl">
                                        <div className="flex justify-between items-start mb-4 sm:mb-5">
                                            <div>
                                                <div
                                                    className="text-[8px] sm:text-[9px] text-primary-container font-black uppercase tracking-widest mb-1 sm:mb-1.5 drop-shadow-sm">
                                                    Đầu tư từ</div>
                                                <div
                                                    className="text-2xl sm:text-3xl font-black text-white italic drop-shadow-md leading-none">
                                                    626 <span className="text-xs sm:text-sm not-italic font-bold ml-0.5">triệu</span>
                                                </div>
                                                <div className="mt-1 text-[9px] sm:text-[10px] text-white/70 font-bold">Vừa nghỉ dưỡng, vừa sinh lời</div>
                                            </div>
                                            <div className="text-right pt-1">
                                                <div
                                                    className="text-[7px] sm:text-[8px] text-primary-container font-black uppercase tracking-widest mb-1 sm:mb-1.5 drop-shadow-sm">
                                                    Dự kiến</div>
                                                <div
                                                    className="text-[10px] sm:text-xs font-black text-white drop-shadow-md bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 whitespace-nowrap">
                                                    12-18%/năm*</div>
                                            </div>
                                        </div>
                                        <div
                                            className="w-full h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-4 sm:mb-5">
                                        </div>
                                        <div
                                            className="flex items-center gap-2.5 sm:gap-3 bg-black/20 p-2.5 sm:p-3 rounded-xl border border-white/5">
                                            <div
                                                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs sm:text-sm shrink-0 shadow-inner">
                                                <i className="fa-solid fa-award"></i>
                                            </div>
                                            <div className="text-[9px] sm:text-[10px] text-white/90 font-medium leading-[1.4]">World Travel Awards
                                                <br /> <span
                                                    className="text-primary-container font-black text-[10px] sm:text-[11px] tracking-wide">VINH DANH</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="hero-showcase hidden lg:block relative reveal">
                                <div className="absolute -inset-2 bg-primary-container/20 blur-2xl rounded-2xl"></div>
                                <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-3xl group">
                                    <img src="./sunshine-bay-retreat-9.jpg"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                                        alt="Sky Villa Interior" />
                                    <div
                                        className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-primary/80 to-transparent">
                                        <div
                                            className="text-[10px] text-primary-container font-black uppercase tracking-widest mb-1">
                                            Bảng giá 03/2026</div>
                                        <div className="text-xl text-white font-black italic">THAM KHẢO KHÔNG GIAN DỰ ÁN</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>


                <section id="tvc" className="landing-section bg-surface-container relative overflow-hidden">
                    <div className="app-container">
                        <div className="section-header section-header--center reveal">
                            <span
                                className="section-kicker text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block font-body">Video
                                Tổng Quan</span>
                            <h2
                                className="section-title text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                                Video Tổng Quan <span className="text-primary-container">Sunshine Bay Retreat</span>
                            </h2>
                            <p className="section-description text-base opacity-60 font-body leading-relaxed">
                                Video này giúp nắm nhanh vị trí, tiện ích và không gian dự án trước khi xem tiếp bảng giá,
                                video căn đẹp hoặc tài liệu pháp lý cần đối chiếu kỹ hơn.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto reveal">
                            <div
                                className="relative w-full border-4 border-white aspect-video rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,27,53,0.15)] bg-slate-900 group">
                                <video
                                    className="absolute inset-0 h-full w-full bg-slate-950"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                >
                                    <source
                                        src="https://res.cloudinary.com/du9pdutdd/video/upload/v1774488977/YTDown.com_YouTube_Sunshine-Bay-Retreat-Vung-Tau-Thanh-pho-_Media_oum9PyUrZeg_002_720p_duel4l.mp4"
                                        type="video/mp4"
                                    />
                                    Trình duyệt của anh/chị hiện chưa hỗ trợ phát video này.
                                </video>


                                <div
                                    className="absolute bottom-6 left-6 z-10 pointer-events-none opacity-100 transition-opacity duration-500 group-hover:opacity-0 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20">
                                    <div
                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                                        <i className="fa-solid fa-volume-xmark text-xs"></i>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Video đang phát sẵn, có thể bật âm thanh nếu cần</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="vitri" className="landing-section landing-section--compact bg-white">
                    <div className="app-container">
                        <div className="section-header grid lg:grid-cols-2 gap-6 items-end reveal">
                            <div>
                                <span
                                    className="section-kicker text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Vị
                                    trí dự án</span>
                                <h2
                                    className="section-title text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tighter">
                                    Vị Trí <span className="text-primary-container">Sunshine Bay Retreat</span> Vũng Tàu</h2>
                            </div>
                            <p className="section-description text-on-surface/50 text-base md:text-lg max-w-md lg:ml-auto">
                                Theo website chính thức, dự án nằm trên đường Ba Tháng Hai, phường 11, TP. Vũng Tàu và kết nối thuận tiện về trung tâm thành phố, Bãi Sau cùng sân bay Long Thành.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                            <div className="amenity-card p-8 rounded-2xl shadow-sm">
                                <div
                                    className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                                    <i className="fa-solid fa-gauge-high"></i>
                                </div>
                                <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">3km Đến Trung Tâm</h3>
                                <p className="text-xs opacity-60 leading-relaxed font-body">Khoảng 10 phút di chuyển về trung tâm TP. Vũng Tàu theo thông tin trên site.</p>
                            </div>
                            <div className="amenity-card p-8 rounded-2xl shadow-sm">
                                <div
                                    className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                                    <i className="fa-solid fa-umbrella-beach"></i>
                                </div>
                                <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">5 Phút Đến Bãi Sau</h3>
                                <p className="text-xs opacity-60 leading-relaxed font-body">Đồng thời cũng gần Mega Market và Bệnh viện Vũng Tàu theo phần vị trí dự án.</p>
                            </div>
                            <div className="amenity-card p-8 rounded-2xl shadow-sm">
                                <div
                                    className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                                    <i className="fa-solid fa-plane-departure"></i>
                                </div>
                                <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">57km Đến Long Thành</h3>
                                <p className="text-xs opacity-60 leading-relaxed font-body">Hiện khoảng 1,2 giờ di chuyển; thời gian có thể rút ngắn khi hạ tầng hoàn thiện.</p>
                            </div>
                            <div className="amenity-card p-8 rounded-2xl shadow-sm">
                                <div
                                    className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                                    <i className="fa-solid fa-road"></i>
                                </div>
                                <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">3 Tuyến Cao Tốc Trọng Điểm</h3>
                                <p className="text-xs opacity-60 leading-relaxed font-body">Long Thành - Dầu Giây, Bến Lức - Long Thành và Biên Hòa - Vũng Tàu.</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="vr-tour" className="landing-section bg-primary text-white relative overflow-hidden">
                    <div
                        className="absolute inset-0 z-0 opacity-40 bg-[url('./sunshine-bay-retreat-28.jpg')] bg-cover bg-center mix-blend-overlay">
                    </div>

                    <div className="app-container relative z-10">
                        <div className="reveal mx-auto max-w-6xl">
                            <div className="vr-tour-layout flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-10 xl:gap-12">
                                <div className="vr-tour-copy">
                                    <div className="section-header max-w-2xl lg:max-w-[34rem]">
                                    <span
                                        className="section-kicker inline-flex items-center rounded-full border border-primary-container/25 bg-primary-container/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.34em] text-primary-container">Tham
                                        quan không gian</span>
                                    <h2
                                        className="section-title mt-5 text-[2rem] sm:text-[2.25rem] md:text-5xl font-black text-white leading-[1.08] md:leading-tight uppercase tracking-tighter">
                                        Tham Quan <span className="text-primary-container">Không Gian Sunshine Bay Retreat</span>
                                    </h2>
                                    <p className="section-description mt-5 max-w-xl text-base leading-8 text-white/66 md:text-lg">
                                        Tham quan nhanh không gian căn hộ và các góc nhìn nổi bật ngay trên website trước khi xem thêm bảng giá hoặc sắp xếp lịch đi thực tế.
                                    </p>
                                    </div>

                                    <div className="vr-tour-header-actions mt-6 flex flex-wrap gap-3">
                                        <a href="https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO3LAKC7E1M&uri=%2Fpub%2Fsaas%2Fapps%2Fproject%2Fdetail%2F3FO3LAKC7E1M%3Fuid%3D3FO4LFQWLUM9&locale=en_US"
                                            id="vr-tour-start"
                                            target="vr-tour-frame"
                                            className="gold-button inline-flex items-center gap-3 rounded-full px-7 py-4 text-white font-black text-[11px] uppercase tracking-[0.18em] shadow-2xl">
                                            Bắt đầu tham quan
                                            <i className="fa-solid fa-vr-cardboard text-base"></i>
                                        </a>
                                        <a href="https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO3LAKC7E1M&uri=%2Fpub%2Fsaas%2Fapps%2Fproject%2Fdetail%2F3FO3LAKC7E1M%3Fuid%3D3FO4LFQWLUM9&locale=en_US"
                                            id="vr-tour-open-current"
                                            target="_blank"
                                            rel="noreferrer"
                                            data-onclick="return openVrFullscreen(event)"
                                            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-7 py-4 text-white font-black text-[11px] uppercase tracking-[0.18em] shadow-2xl backdrop-blur-md transition-all hover:bg-white/18">
                                            Mở toàn màn hình
                                            <i className="fa-solid fa-up-right-from-square text-sm"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="vr-tour-panel mt-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-5 lg:mt-0">
                                    <div className="vr-tour-tabs flex flex-wrap gap-2">
                                        <button type="button"
                                            data-vr-tab="tour360"
                                            data-onclick="return switchVrTour('tour360')"
                                            className="vr-tour-tab inline-flex items-center justify-center rounded-full border border-primary-container/20 bg-primary-container px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-lg shadow-primary-container/20 transition-all hover:brightness-105">
                                            Tham quan 360
                                        </button>
                                        <button type="button"
                                            data-vr-tab="panorama"
                                            data-onclick="return switchVrTour('panorama')"
                                            className="vr-tour-tab inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/16">
                                            Toàn cảnh
                                        </button>
                                        <button type="button"
                                            data-vr-tab="interior"
                                            data-onclick="return switchVrTour('interior')"
                                            className="vr-tour-tab inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/16">
                                            Nội thất
                                        </button>
                                    </div>

                                    <div
                                        id="vr-tour-viewer-shell"
                                        data-ondblclick="return openVrFullscreen(event)"
                                        className="mt-4 overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950 shadow-2xl">
                                        <iframe
                                            id="vr-tour-frame"
                                            name="vr-tour-frame"
                                            title="Tham quan không gian Sunshine Bay Retreat"
                                            src="https://www.coohom.com/pub/tool/panorama/aiwalking?obsPlanId=3FO3LAKC7E1M&uri=%2Fpub%2Fsaas%2Fapps%2Fproject%2Fdetail%2F3FO3LAKC7E1M%3Fuid%3D3FO4LFQWLUM9&locale=en_US"
                                            className="vr-tour-frame h-[420px] w-full md:h-[620px]"
                                            loading="lazy"
                                            allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope; autoplay"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            data-ondblclick="return openVrFullscreen(event)"
                                        ></iframe>
                                    </div>

                                    <p className="mt-3 text-xs leading-6 text-white/55">
                                        Nhấp đúp vào khung tham quan để mở toàn màn hình, hoặc dùng nút bên trên khi cần xem rõ hơn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                <section id="matbang" className="landing-section bg-surface-container">
                    <div className="app-container">
                        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                            <span
                                className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block font-body">Loại
                                hình sản phẩm</span>
                            <h2
                                className="text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                                Mặt Bằng Và <span className="text-primary-container">Dòng Sản Phẩm</span>
                            </h2>
                            <p className="text-base opacity-60 font-body leading-relaxed">
                                Theo phần tổng quan trên website chính thức, dự án phát triển căn hộ du lịch, căn hộ khách sạn,
                                biệt thự du lịch và dòng sản phẩm thương mại dịch vụ.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">

                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-container group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                                data-onclick="openProductModal('skyvilla')">
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src="./can-ho-Sunshine-Bay-Retreat-8.jpg"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt="Căn hộ du lịch Sunshine Bay Retreat" />
                                    <div
                                        className="absolute top-4 left-4 bg-primary-container text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        Hot</div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-primary uppercase mb-2">Căn Hộ Du Lịch</h3>
                                    <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Dòng căn hộ biển phù hợp cho nhu cầu nghỉ dưỡng và khai thác lưu trú theo định hướng dự án.</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                                        <div className="text-primary-container font-black text-sm">Bảng giá 03/2026</div>
                                        <div
                                            className="text-xs font-bold text-primary uppercase flex items-center gap-1 group-hover:text-primary-container transition-colors">
                                            Chi tiết <i className="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-container group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                                data-onclick="openProductModal('villa')">
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src="./sunshine-bay-retreat-28.jpg"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt="Biệt thự du lịch Sunshine Bay Retreat" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-primary uppercase mb-2">Biệt Thự Du Lịch</h3>
                                    <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Thuộc 2 phân khu Horizon và Eden, phù hợp nhóm khách ưu tiên không gian riêng và trải nghiệm nghỉ dưỡng.</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                                        <div className="text-primary-container font-black text-sm">Liên hệ</div>
                                        <div
                                            className="text-xs font-bold text-primary uppercase flex items-center gap-1 group-hover:text-primary-container transition-colors">
                                            Chi tiết <i className="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-container group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                                data-onclick="openProductModal('shophouse')">
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src="./sunshine-vung-tau-8.jpg"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt="Không gian dự án Sunshine Bay Retreat Vũng Tàu" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-primary uppercase mb-2">Shophouse Thương Mại</h3>
                                    <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Nằm trong hệ sinh thái nghỉ dưỡng và dịch vụ của dự án, phù hợp khai thác kinh doanh phục vụ cư dân và du khách.</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                                        <div className="text-primary-container font-black text-sm">Giới hạn</div>
                                        <div
                                            className="text-xs font-bold text-primary uppercase flex items-center gap-1 group-hover:text-primary-container transition-colors">
                                            Chi tiết <i className="fa-solid fa-arrow-right"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div id="product-modal" className="fixed inset-0 z-[300] hidden items-center justify-center p-4">
                        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" data-onclick="closeProductModal()"></div>
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar relative z-10 shadow-2xl flex flex-col md:flex-row transform scale-95 opacity-0 transition-all duration-300"
                            id="product-modal-content">

                        </div>
                    </div>


                    <div id="booking-modal" className="fixed inset-0 z-[350] hidden items-center justify-center p-4">
                        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" data-onclick="closeBookingModal()"></div>
                        <div className="bg-white rounded-[1.75rem] max-w-lg w-full relative z-10 shadow-2xl p-6 sm:p-8 transform scale-95 opacity-0 transition-all duration-300"
                            id="booking-modal-content">
                            <button type="button" data-onclick="closeBookingModal()"
                                className="absolute top-4 right-4 w-8 h-8 bg-surface-container rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>

                            <div className="text-center mb-8">
                                <div
                                    className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                    <i className="fa-solid fa-file-lines"></i>
                                </div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Nhận Bảng Giá &amp; Video</h3>
                                <p className="text-sm opacity-60 font-body mt-3 leading-7">Thông tin ưu tiên sẽ được gửi cho sản phẩm: <span
                                    id="booking-product-name" className="font-bold text-primary"></span></p>
                            </div>

                            <form id="booking-form" data-onsubmit="submitBooking(event)" className="space-y-4">
                                <input type="hidden" id="booking-product-id" name="product_id" />

                                <div>
                                    <label
                                        className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Họ và tên *</label>
                                    <input id="booking-full-name" type="text" required
                                        className="w-full bg-surface border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                                        placeholder="Nhập họ và tên..." />
                                </div>
                                <div>
                                    <label
                                        className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">SĐT / Zalo / Email *</label>
                                    <input id="booking-contact" type="text" required
                                        className="w-full bg-surface border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                                        placeholder="Nhập số liên hệ hoặc email..." />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Nhu cầu</label>
                                        <select id="booking-need"
                                            className="w-full bg-surface border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-container transition-all font-bold text-primary">
                                            <option>Muốn xem giá trước</option>
                                            <option>Đầu tư sinh lời</option>
                                            <option>Mua để ở / nghỉ dưỡng</option>
                                            <option>Muốn xem pháp lý trước</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Tài chính</label>
                                        <select id="booking-budget"
                                            className="w-full bg-surface border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-container transition-all font-bold text-primary">
                                            <option>1,5-2,5 tỷ</option>
                                            <option>2,5-5 tỷ</option>
                                            <option>Trên 5 tỷ</option>
                                            <option>Chưa rõ</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Ưu tiên nhận thông tin qua</label>
                                    <select id="booking-contact-preference"
                                        className="w-full bg-surface border-none rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-container transition-all font-bold text-primary">
                                        <option>Zalo</option>
                                        <option>Điện thoại</option>
                                        <option>Email</option>
                                    </select>
                                </div>

                                <p className="text-xs leading-6 text-primary/55">Bước này chỉ để gửi đúng phần mình cần, chưa phải đặt cọc hay chuyển khoản.</p>

                                <button type="submit" id="submit-booking-btn"
                                    className="w-full gold-button py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                                    Nhận bảng giá &amp; video <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </form>

                            <div id="booking-form-notice" className="hidden mt-4 rounded-2xl border px-4 py-3 text-sm leading-6"></div>

                            <div id="booking-success"
                                className="absolute inset-0 bg-white z-20 rounded-[1.75rem] flex flex-col items-center justify-center p-8 text-center opacity-0 pointer-events-none transition-all duration-300">
                                <div
                                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <h3 className="text-2xl font-black text-primary uppercase mb-3">Đã Ghi Nhận Thông Tin</h3>
                                <p className="text-sm opacity-60 font-body mb-8 leading-7">Bảng giá nội bộ, video căn đẹp và phần phù hợp với nhu cầu của anh/chị sẽ được gửi trong ít phút tới.</p>
                                <button type="button" data-onclick="closeBookingSuccess()"
                                    className="bg-surface-container py-3 px-8 rounded-full text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-sm">Đóng cửa sổ</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="developer" className="landing-section bg-white relative overflow-hidden">
                    <div className="app-container">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2 reveal">
                                <div className="relative">
                                    <div
                                        className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl">
                                    </div>
                                    <img src="./sunshine-bay-retreat-28.jpg" alt="Phối cảnh Sunshine Bay Retreat do Sunshine Group phát triển" className="rounded-2xl shadow-2xl relative z-10" />
                                    <div
                                        className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 border border-surface-container transform hover:scale-105 transition-transform duration-500">
                                        <div className="text-2xl font-black text-primary-container mb-1">Sunshine</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/60">Group -
                                            Kiến tạo giá trị</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 reveal">
                                <span
                                    className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Chủ
                                    đầu tư</span>
                                <h2
                                    className="text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                                    Tổng Quan <span className="text-primary-container">Sunshine Bay Retreat</span></h2>
                                <p className="text-on-surface/60 text-base font-body leading-relaxed mb-8">
                                    Theo website chính thức, Sunshine Bay Retreat do Tập đoàn Sunshine đầu tư và phát triển tại
                                    đường Ba Tháng Hai, phường 11, TP. Vũng Tàu. Phần tổng quan trên site cũng cho thấy dự án có
                                    quy mô gần 20ha với gần 6.000 sản phẩm.
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-surface-container rounded-2xl">
                                        <div className="text-2xl font-black text-primary mb-1">Gần 20ha</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">Quy mô dự
                                            án</div>
                                    </div>
                                    <div className="p-6 bg-surface-container rounded-2xl">
                                        <div className="text-2xl font-black text-primary mb-1">Gần 6.000</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">Sản phẩm dự
                                            kiến</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="landing-section bg-surface">
                    <div className="app-container">
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="reveal">
                                <div
                                    className="bg-primary p-12 rounded-2xl text-white shadow-2xl h-full flex flex-col justify-center">
                                    <span
                                        className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">Tài
                                        liệu tham khảo</span>
                                    <h3 className="text-3xl font-black uppercase tracking-tight mb-8 leading-tight">Những Nội Dung <span
                                        className="text-primary-container">Nên Xem Trước</span></h3>
                                    <ul className="space-y-6">
                                        <li className="flex items-center gap-4">
                                            <div
                                                className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                                <i className="fa-solid fa-percent"></i></div>
                                            <span className="text-sm font-body opacity-80">Bảng giá và quỹ căn được cập nhật theo từng dòng sản phẩm, vị trí và thời điểm công bố.</span>
                                        </li>
                                        <li className="flex items-center gap-4">
                                            <div
                                                className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                                <i className="fa-solid fa-gift"></i></div>
                                            <span className="text-sm font-body opacity-80">Phương án thanh toán, mặt bằng và tài liệu tư vấn có thể xem theo đúng nhu cầu đang quan tâm.</span>
                                        </li>
                                        <li className="flex items-center gap-4">
                                            <div
                                                className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                                <i className="fa-solid fa-building-columns"></i></div>
                                            <span className="text-sm font-body opacity-80">Thông tin có thể nhận qua Zalo, điện thoại hoặc email theo cách thuận tiện nhất để theo dõi.</span>
                                        </li>
                                    </ul>
                                    <button type="button" data-onclick="toggleChatbot()"
                                        className="gold-button mt-12 py-4 rounded-full text-white font-black text-[10px] uppercase tracking-widest w-full">Xem
                                        bảng giá cập nhật</button>
                                </div>
                            </div>
                            <div className="reveal">
                                <div className="bg-white p-12 rounded-2xl border border-surface-container shadow-xl h-full">
                                    <span
                                        className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">Thông
                                        tin đối chiếu</span>
                                    <h3 className="text-3xl font-black text-primary uppercase tracking-tight mb-8 leading-tight">Một
                                        Số Dữ Liệu <span className="text-primary-container">Từ Website Chính Thức</span></h3>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Chuyên mục
                                                pháp lý</span>
                                            <span
                                                className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Có
                                                hiển thị</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Chủ đầu
                                                tư</span>
                                            <span
                                                className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Sunshine
                                                Group</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Quy mô công
                                                bố</span>
                                            <span
                                                className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">195.942
                                                m2</span>
                                        </div>
                                        <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                            <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Giai đoạn
                                                công bố</span>
                                            <span
                                                className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">2026
                                                - 2030</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="tienich" className="landing-section bg-primary text-white relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img alt="Không gian tiện ích Sunshine Bay Retreat Vũng Tàu" className="w-full h-full object-cover opacity-10" src="./sunshine-bay-retreat-28.jpg" />
                    </div>

                    <div className="app-container relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-20 reveal">
                            <span className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Tiện
                                ích dự án</span>
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6 italic">Tiện Ích <span className="text-primary-container">Sunshine Bay Retreat</span></h2>
                            <p className="text-white/40 text-base font-body">Site chính thức giới thiệu dự án theo mô hình resort tích hợp, với nhóm tiện ích như nhà hàng, spa, gym, khu thương mại, BBQ, hồ bơi và không gian giải trí.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 text-center reveal">
                            <div className="group">
                                <div
                                    className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <i className="fa-solid fa-water-ladder text-3xl"></i>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-wider mb-4">Hồ Bơi &amp; Sky Bar</h4>
                                <p className="text-white/40 text-sm font-body px-4">Nhóm tiện ích thư giãn và ngắm biển là điểm nhấn được nhắc khá rõ trên site dự án.</p>
                            </div>
                            <div className="group">
                                <div
                                    className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <i className="fa-solid fa-umbrella-beach text-3xl"></i>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-wider mb-4">Nhà Hàng &amp; Thương Mại</h4>
                                <p className="text-white/40 text-sm font-body px-4">Phục vụ nhu cầu ăn uống, mua sắm và trải nghiệm ngay trong nội khu nghỉ dưỡng.</p>
                            </div>
                            <div className="group">
                                <div
                                    className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <i className="fa-solid fa-spa text-3xl"></i>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-wider mb-4">Spa, Gym &amp; Wellness</h4>
                                <p className="text-white/40 text-sm font-body px-4">Hoàn thiện trải nghiệm nghỉ dưỡng và chăm sóc sức khỏe cho khách lưu trú lẫn chủ sở hữu.</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="tiendo" className="landing-section bg-white">
                    <div className="app-container">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal">
                            <div className="max-w-xl">
                                <span
                                    className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Nhật
                                    ký xây dựng</span>
                                <h2 className="text-3xl md:text-5xl font-black text-primary uppercase tracking-tight">Tiến Độ <span className="text-primary-container">Sunshine Bay Retreat</span></h2>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 italic">Theo
                                    nội dung website chính thức</div>
                                <div className="text-xs font-bold text-primary/60">Mục tiến độ và tin tức đang được cập nhật riêng trên website dự án.</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                            <div className="relative rounded-2xl overflow-hidden group shadow-2xl h-[400px]">
                                <img src="./sunshine-bay-retreat-28.jpg" alt="Tiến độ và hình ảnh thực tế Sunshine Bay Retreat"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <span
                                        className="bg-primary-container px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 inline-block">Mốc
                                        công bố</span>
                                    <h4 className="text-xl font-black uppercase tracking-tight">Lễ động thổ ngày 25/06/2025</h4>
                                    <p className="text-[10px] opacity-60 font-body mt-2">Website chính thức có bài cập nhật về lễ động thổ và khu vực tiến độ xây dựng riêng để theo dõi các giai đoạn tiếp theo.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <div
                                    className="bg-surface-container rounded-2xl p-8 flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                    <div
                                        className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-primary-container text-2xl">
                                        <i className="fa-solid fa-hard-hat"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Tiến độ dự
                                            kiến</h5>
                                        <p className="text-[10px] opacity-60 font-body">Phần tổng quan trên website đang ghi mốc thực hiện dự kiến từ 2026 đến 2030.</p>
                                    </div>
                                </div>
                                <div
                                    className="bg-surface-container rounded-2xl p-8 flex items-center gap-6 group hover:translate-x-2 transition-transform">
                                    <div
                                        className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-primary-container text-2xl">
                                        <i className="fa-solid fa-clock"></i>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Nguồn đối
                                            chiếu</h5>
                                        <p className="text-[10px] opacity-60 font-body">Có thể xem trực tiếp mục Pháp lý, Tiến độ và Tin tức trên website chính thức để đối chiếu theo từng thời điểm.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section id="contact" className="landing-section bg-primary relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute -top-16 left-0 h-56 w-56 rounded-full bg-primary-container/15 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(201,168,97,0.16),_transparent_30%)]"></div>
                    </div>

                    <div className="app-container relative z-10">
                        <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] items-start">
                            <div className="reveal text-white">
                                <span
                                    className="section-kicker inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary-container">
                                    <i className="fa-solid fa-file-signature"></i>
                                    Đăng ký ưu tiên
                                </span>
                                <h2 className="section-title mt-6 text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.16] md:leading-[1.08]">
                                    <span className="block">Nhận Bảng Giá</span>
                                    <span className="block">Sunshine Bay Retreat</span>
                                    <span className="block text-primary-container">Theo Nhu Cầu Quan Tâm</span>
                                </h2>
                                <p className="section-description mt-6 max-w-2xl text-base md:text-lg leading-8 text-white/75">
                                    Anh/chị chỉ cần để lại thông tin cơ bản, hệ thống sẽ lọc và gửi đúng phần mình đang cần như bảng giá nội bộ,
                                    video căn đẹp, chính sách mới hoặc quỹ căn phù hợp tài chính để tiết kiệm thời gian chọn lọc.
                                </p>

                                <div className="contact-benefits mt-8 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/20 text-primary-container text-xl">
                                            <i className="fa-solid fa-bolt"></i>
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Phản hồi nhanh</h3>
                                        <p className="mt-3 text-sm leading-6 text-white/65">Ưu tiên gửi thông tin qua Zalo hoặc điện thoại trong ít phút khi có online.</p>
                                    </div>
                                    <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/20 text-primary-container text-xl">
                                            <i className="fa-solid fa-layer-group"></i>
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Đúng nhu cầu</h3>
                                        <p className="mt-3 text-sm leading-6 text-white/65">Chỉ gửi phần liên quan tới đầu tư, nghỉ dưỡng, pháp lý hoặc căn theo ngân sách.</p>
                                    </div>
                                    <div className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-md">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/20 text-primary-container text-xl">
                                            <i className="fa-solid fa-shield-heart"></i>
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">Không ràng buộc</h3>
                                        <p className="mt-3 text-sm leading-6 text-white/65">Đây chỉ là bước nhận thông tin tham khảo, chưa phải đặt cọc hay cam kết giao dịch.</p>
                                    </div>
                                </div>

                                <div className="mt-8 rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-md">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-container text-xl">
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-container">Thường được gửi trước</div>
                                            <div className="contact-tags mt-3 flex flex-wrap gap-3">
                                                <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Bảng giá nội bộ</span>
                                                <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Video căn đẹp</span>
                                                <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Quỹ căn hợp tài chính</span>
                                                <span className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white">Pháp lý & chính sách</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="reveal">
                                <div className="contact-form-card rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl">
                                    <div className="text-center mb-8">
                                        <div
                                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/15 text-2xl text-primary-container">
                                            <i className="fa-solid fa-file-circle-check"></i>
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight text-primary">Nhận Thông Tin Dự Án</h3>
                                        <p className="mt-3 text-sm leading-7 text-primary/60">
                                            Điền form để hệ thống gửi đúng tài liệu anh/chị đang cần, tránh nhận thông tin quá nhiều nhưng không đúng trọng tâm.
                                        </p>
                                    </div>

                                    <form id="lead-capture-form" data-onsubmit="submitLeadForm(event)" className="space-y-4">
                                        <div>
                                            <label
                                                className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary/60">Họ và tên *</label>
                                            <input id="lead-full-name" type="text" required
                                                className="w-full rounded-2xl border-none bg-surface px-4 py-3.5 text-sm transition-all focus:ring-2 focus:ring-primary-container"
                                                placeholder="Nhập họ và tên..." />
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary/60">SĐT / Zalo / Email *</label>
                                            <input id="lead-contact" type="text" required
                                                className="w-full rounded-2xl border-none bg-surface px-4 py-3.5 text-sm transition-all focus:ring-2 focus:ring-primary-container"
                                                placeholder="Nhập số liên hệ hoặc email..." />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary/60">Mình muốn nhận</label>
                                                <select id="lead-need"
                                                    className="w-full rounded-2xl border-none bg-surface px-4 py-3.5 text-sm font-bold text-primary transition-all focus:ring-2 focus:ring-primary-container">
                                                    <option value="Xem giá">Nhận bảng giá 03/2026</option>
                                                    <option value="Ở / nghỉ dưỡng">Xem căn thực tế giá tốt</option>
                                                    <option value="Đầu tư">Xem căn hợp tài chính</option>
                                                    <option value="Xem pháp lý">Xem pháp lý và chính sách</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label
                                                    className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary/60">Ngân sách dự kiến</label>
                                                <select id="lead-budget"
                                                    className="w-full rounded-2xl border-none bg-surface px-4 py-3.5 text-sm font-bold text-primary transition-all focus:ring-2 focus:ring-primary-container">
                                                    <option>1,5-2,5 tỷ</option>
                                                    <option>2,5-5 tỷ</option>
                                                    <option>Trên 5 tỷ</option>
                                                    <option>Chưa rõ</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                className="mb-2 block text-[10px] font-black uppercase tracking-widest text-primary/60">Ưu tiên liên hệ qua</label>
                                            <select id="lead-contact-preference"
                                                className="w-full rounded-2xl border-none bg-surface px-4 py-3.5 text-sm font-bold text-primary transition-all focus:ring-2 focus:ring-primary-container">
                                                <option>Zalo</option>
                                                <option>Điện thoại</option>
                                                <option>Email</option>
                                            </select>
                                        </div>

                                        <p className="text-xs leading-6 text-primary/55">
                                            Thông tin này được dùng để gửi đúng nội dung mình quan tâm và hỗ trợ nhanh hơn, không phát sinh chi phí hay ràng buộc.
                                        </p>

                                        <button type="submit" id="lead-submit-btn"
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl gold-button py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg">
                                            Nhận thông tin dự án <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </form>

                                    <div id="lead-form-notice" className="hidden mt-4 rounded-2xl border px-4 py-3 text-sm leading-6"></div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                                            <i className="fa-solid fa-phone-volume text-primary-container"></i>
                                            Hỗ trợ 1:1
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                                            <i className="fa-solid fa-clock text-primary-container"></i>
                                            Gửi nhanh trong ngày
                                        </span>
                                        <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                                            <i className="fa-solid fa-building-shield text-primary-container"></i>
                                            Thông tin chọn lọc
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="faq" className="landing-section bg-surface-container">
                    <div className="app-container">
                        <div className="mx-auto max-w-3xl text-center reveal">
                            <span className="section-kicker text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">FAQ</span>
                            <h2 className="section-title text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tight">
                                Câu Hỏi Thường Gặp <span className="text-primary-container">Về Sunshine Bay Retreat</span>
                            </h2>
                            <p className="mt-6 text-base leading-8 text-primary/60">
                                Đây là các nhóm câu hỏi tìm kiếm nhiều nhất quanh bảng giá, vị trí, pháp lý, mặt bằng và tiến độ Sunshine Bay Retreat Vũng Tàu.
                            </p>
                        </div>

                        <div className="mx-auto mt-12 grid max-w-4xl gap-4 reveal">
                            {NATIVE_LANDING_FAQS.map((item) => (
                                <details key={item.question} className="rounded-[1.75rem] border border-primary/8 bg-white p-6 shadow-sm open:shadow-lg">
                                    <summary className="cursor-pointer list-none pr-8 text-left text-base font-black leading-7 text-primary marker:hidden">
                                        {item.question}
                                    </summary>
                                    <p className="mt-4 text-sm leading-7 text-primary/65">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-primary pt-16 pb-28 px-6 border-t border-white/5 md:px-12 md:pt-24 md:pb-12">
                <div className="app-container">
                    <div className="footer-grid grid grid-cols-1 gap-10 mb-12 md:grid-cols-4 md:gap-16 md:mb-20">
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-8">
                                <i className="fa-solid fa-crown text-primary-container text-xl"></i>
                                <span className="text-xl font-black text-white uppercase tracking-tighter">Sunshine Bay</span>
                            </div>
                            <p className="text-white/30 text-xs leading-relaxed font-body mb-8">Dự án biểu tượng thịnh vượng phố
                                biển từ Sunshine Group.</p>
                            <div className="flex flex-wrap gap-4">
                                <a href="https://www.facebook.com/share/1GLKHFqTzU/?mibextid=wwXIfr" target="_blank"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:text-primary-container transition-colors"><i
                                        className="fa-brands fa-facebook-f"></i></a>
                                <a href="https://www.tiktok.com/@dinhngoctuan81?_r=1&_t=ZS-94vChivqKdF" target="_blank"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:text-primary-container transition-colors"><i
                                        className="fa-brands fa-tiktok"></i></a>
                                <a href="https://www.tiktok.com/@taituan_land?_r=1&_t=ZS-94vCTydDilt" target="_blank"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:text-primary-container transition-colors"><i
                                        className="fa-brands fa-tiktok"></i></a>
                                <a href="tel:0908345808"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:text-primary-container transition-colors"><i
                                        className="fa-solid fa-phone"></i></a>
                                <a href="https://zalo.me/0908345808" target="_blank"
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:text-primary-container transition-colors overflow-hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 50 50" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd"
                                            d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z"
                                            fill="#0068FF" />
                                        <path opacity="0.12" fillRule="evenodd" clipRule="evenodd"
                                            d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z"
                                            fill="#001A33" />
                                        <path fillRule="evenodd" clipRule="evenodd"
                                            d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
                                            fill="white" />
                                        <path
                                            d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
                                            fill="#0068FF" />
                                        <path
                                            d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
                                            fill="#0068FF" />
                                        <path
                                            d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
                                            fill="#0068FF" />
                                        <path
                                            d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
                                            fill="#0068FF" />
                                        <path
                                            d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"
                                            fill="#0068FF" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-[9px] opacity-100">Khám phá
                            </h4>
                            <ul className="space-y-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
                                <li><a href="#vitri" className="hover:text-primary-container">Vị thế dự án</a></li>
                                <li><a href="#tienich" className="hover:text-primary-container">Hệ sinh thái</a></li>
                                <li><a href="#matbang" className="hover:text-primary-container">Thiết kế mẫu</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-[9px] opacity-100">Hỗ trợ</h4>
                            <ul className="space-y-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
                                <li><a href="https://urlvn.net/wbai90j" target="_blank" className="hover:text-primary-container">Đào
                                    tạo</a></li>
                                <li><a href="#tiendo" className="hover:text-primary-container">Tiến độ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-black mb-8 uppercase tracking-widest text-[9px] opacity-100">Hỗ trợ 24/7
                            </h4>
                            <button type="button" data-onclick="toggleChatbot()"
                                className="gold-button px-6 py-3 rounded-full text-white font-black text-[10px] uppercase tracking-widest">
                                AI tư vấn 24/7
                            </button>
                        </div>
                    </div>
                    <p className="text-white/20 text-[8px] uppercase font-black tracking-widest text-center">© 2026 Sunshine Bay
                        Retreat. Phân phối bởi Ekip Admin.</p>
                </div>
            </footer>


            <div className="fixed bottom-8 right-8 z-[200] isolate flex flex-col gap-4 items-end">

                <aside id="chatbot-panel" className="chatbot-panel z-[220]">

                    <div className="bg-primary p-5 flex justify-between items-center text-white border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src="./ai_avatar_vn.png"
                                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary-container/30 shadow-lg"
                                    alt="Trợ lý Sunshine AI" />
                                <div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary chat-status-dot">
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container mb-0.5">
                                    Sunshine AI</div>
                                <h3 className="text-sm font-black uppercase tracking-tighter leading-none">AI tư vấn 24/7</h3>
                            </div>
                        </div>

                        <button type="button" data-onclick="toggleChatbot()"
                            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>


                    <div id="chat-messages" className="chat-scroll flex-1 p-5 overflow-y-auto bg-surface/30">
                        <div className="chat-message chat-message--bot">
                            <div className="chat-bubble">
                                Anh/chị muốn xem thông tin nào trước ạ? Em có thể gửi **bảng giá 03/2026**,
                                **không gian dự án** hoặc **pháp lý** để mình đối chiếu nhanh ngay trên trang.
                            </div>
                        </div>
                    </div>


                    <div id="chat-suggestions" className="chat-suggestions-strip px-4 sm:px-5 py-3 sm:py-4 flex items-stretch gap-2 overflow-x-auto no-scrollbar">
                        <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Nhận bảng giá nội bộ')">Nhận bảng giá 03/2026</button>

                        <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Xem video căn đẹp')">Xem căn thực tế</button>

                        <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Tư vấn đầu tư')">Tư vấn đầu tư</button>

                        <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Xem pháp lý')">Xem pháp lý</button>

                    </div>


                    <div className="p-4 bg-white border-t border-surface">
                        <div className="flex gap-3">
                            <textarea id="chat-input" placeholder="Nhập câu hỏi hoặc để lại SĐT/Zalo..." rows={1}
                                className="chat-input-field no-scrollbar flex-1 bg-surface border-none rounded-xl px-4 py-2.5 text-sm leading-6 focus:ring-1 focus:ring-primary-container resize-none"
                                data-onkeypress="handleChatEnter(event)"></textarea>
                            <button type="button" data-onclick="handleSendMessage()"
                                className="h-11 w-11 gold-button text-white rounded-xl flex items-center justify-center shadow-lg">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </aside>


                <button type="button" data-onclick="toggleChatbot()"
                    className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-container hover:text-white transition-all group relative border border-surface animate-[float_5s_infinite] hidden md:flex overflow-hidden">
                    <img src="./ai_avatar_vn.png" className="w-full h-full object-cover" alt="AI Chatbot" />
                    <div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-primary-container text-white text-[8px] flex items-center justify-center rounded-full font-black animate-pulse">
                        1</div>
                    <span
                        className="absolute right-20 bg-primary text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">Nhận bảng giá</span>

                </button>
            </div>

            <button type="button" id="chatbot-mini-teaser" data-onclick="startChatFromLanding('Nhận bảng giá nội bộ')"
                className="fixed bottom-28 right-4 z-[205] hidden max-w-[260px] rounded-2xl border border-primary/10 bg-white px-4 py-3 text-left shadow-2xl md:bottom-24 md:right-8 md:max-w-[280px]">
                <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/40">Popup mini</div>
                <p id="chatbot-mini-teaser-text" className="mt-2 text-sm font-semibold leading-6 text-primary">Anh/chị muốn xem bảng giá 03/2026 hay pháp lý dự án trước ạ?</p>
                <span id="chatbot-mini-teaser-cta" className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary-container">
                    Nhận bảng giá <i className="fa-solid fa-arrow-right"></i>
                </span>
            </button>


            <div
                className="fixed bottom-0 left-0 w-full z-[140] bg-white border-t flex items-center justify-around py-3 md:hidden shadow-2xl">
                <button type="button" data-onclick="startChatFromLanding('Nhận bảng giá nội bộ')" className="flex flex-col items-center gap-1 text-primary">
                    <i className="fa-solid fa-file-invoice-dollar"></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">Bảng giá</span>
                </button>
                <button type="button" data-onclick="toggleChatbot()"
                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-2xl border-4 border-white overflow-hidden">
                    <img src="./ai_avatar_vn.png" className="w-full h-full object-cover" alt="AI Chatbot" />
                </button>
                <a href="#tvc" className="flex flex-col items-center gap-1 text-primary">
                    <i className="fa-solid fa-circle-play"></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">Xem video</span>
                </a>
            </div>
            <style>{`
        .chat-input-field {
            display: block;
            overflow-y: hidden;
            scrollbar-width: none;
            line-height: 1.5;
        }

        .chat-input-field::-webkit-scrollbar {
            display: none;
        }

        .chat-input-field::placeholder {
            line-height: 1.5;
        }

        .chatbot-panel {
            position: absolute;
            right: 0;
            bottom: calc(100% + 1rem);
            width: min(23rem, calc(100vw - 2rem));
            max-height: min(42rem, calc(100svh - 8.5rem));
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(219, 228, 240, 0.92);
            border-radius: 1.75rem;
            background: rgba(255, 255, 255, 0.98);
            z-index: 220;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px) scale(0.985);
            transform-origin: bottom right;
            transition: opacity 220ms ease, transform 220ms ease;
        }

        .chatbot-panel.open {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0) scale(1);
        }

        .landing-section {
            padding-top: 6.5rem;
            padding-bottom: 6.5rem;
        }

        .landing-section--compact {
            padding-top: 5rem;
            padding-bottom: 5rem;
        }

        .section-header {
            margin-bottom: 3rem;
        }

        .section-header--center {
            max-width: 42rem;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }

        .section-kicker {
            line-height: 1.28;
        }

        .section-title {
            text-wrap: balance;
        }

        .section-description {
            line-height: 1.75;
        }

        .hero-kicker {
            width: fit-content;
            max-width: min(100%, 37rem);
        }

        .hero-award-line {
            width: fit-content;
            max-width: 100%;
        }

        .hero-highlight-chip {
            min-height: 2.85rem;
        }

        .hero-mobile-metric-card {
            max-width: min(100%, 22rem);
        }

        .hero-showcase {
            width: 100%;
            max-width: 38rem;
            margin-left: auto;
        }

        .vr-tour-header-actions > * {
            min-height: 3.25rem;
        }

        .footer-grid {
            align-items: start;
        }

        .hero-copy .hero-title--mobile {
            display: flex;
            flex-direction: column;
            row-gap: 0.06em;
            line-height: 1;
            padding-top: 0.28em;
            padding-bottom: 0.24em;
            overflow: visible;
        }

        .hero-copy .hero-title-line {
            display: block;
            line-height: 1.02;
            padding-top: 0.04em;
            padding-bottom: 0.02em;
            overflow: visible;
        }

        .hero-copy .hero-title-line--eyebrow {
            font-size: 0.48em;
            line-height: 1.18;
            letter-spacing: 0.18em;
            color: rgba(255, 255, 255, 0.92);
        }

        .hero-copy .hero-title-line--accent {
            font-size: 1.18em;
            line-height: 0.96;
            padding-top: 0.08em;
            padding-bottom: 0.08em;
            background: linear-gradient(90deg, #ffffff 0%, #F3DEB4 42%, #C5A059 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: none;
        }

        .hero-copy .hero-title-line--support {
            font-size: 0.42em;
            line-height: 1.12;
            letter-spacing: 0.08em;
            color: rgba(255, 255, 255, 0.9);
        }

        .hero-copy .hero-title-price-display {
            display: inline-block;
            line-height: 1.18;
            padding-top: 0.12em;
            padding-bottom: 0.14em;
            overflow: visible;
        }

        @media (min-width: 768px) {
            .app-container {
                padding-left: 1.5rem !important;
                padding-right: 1.5rem !important;
            }

            .landing-section {
                padding-top: 5.75rem;
                padding-bottom: 5.75rem;
            }

            .landing-section--compact {
                padding-top: 4.75rem;
                padding-bottom: 4.75rem;
            }

            .contact-benefits {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .contact-benefits > div:last-child {
                grid-column: 1 / -1;
            }

            .footer-grid {
                grid-template-columns: minmax(0, 1.35fr) repeat(2, minmax(0, 1fr)) !important;
            }

            .footer-grid > :first-child {
                grid-column: 1 / -1;
            }

            .hero-banner-content {
                padding-top: 6.5rem !important;
                padding-bottom: 4.75rem !important;
            }

            .hero-copy {
                max-width: 36rem;
            }

            .hero-copy .hero-title--mobile {
                font-size: clamp(3.45rem, 4.95vw, 4.55rem);
                row-gap: 0.08em;
                line-height: 1.01;
                padding-top: 0.34em;
                padding-bottom: 0.28em;
            }

            .hero-copy .hero-title-line {
                line-height: 1.02;
            }

            .hero-copy .hero-title-line--eyebrow {
                font-size: 0.44em;
                letter-spacing: 0.22em;
                line-height: 1.16;
            }

            .hero-copy .hero-title-line--accent {
                font-size: 1.22em;
                line-height: 0.98;
                padding-top: 0.09em;
                padding-bottom: 0.09em;
            }

            .hero-copy .hero-title-line--support {
                font-size: 0.38em;
                letter-spacing: 0.1em;
                line-height: 1.1;
            }

            .hero-kicker span:last-child {
                letter-spacing: 0.15em !important;
            }

            .hero-award-line {
                font-size: 0.68rem !important;
                letter-spacing: 0.14em !important;
            }

            .hero-mobile-metric-card {
                max-width: 24rem;
            }

            .vr-tour-header-actions {
                width: 100%;
                justify-content: flex-start;
            }

            .hero-copy .hero-title-price-display {
                font-size: clamp(3rem, 4.9vw, 4rem);
                line-height: 1.12;
                padding-top: 0.14em;
                padding-bottom: 0.16em;
                margin-bottom: 1.4rem;
            }
        }

        @media (min-width: 1024px) {
            .landing-section {
                padding-top: 6.5rem;
                padding-bottom: 6.5rem;
            }

            .landing-section--compact {
                padding-top: 5rem;
                padding-bottom: 5rem;
            }

            .contact-benefits {
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            }

            .contact-benefits > div:last-child {
                grid-column: auto;
            }

            .footer-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }

            .footer-grid > :first-child {
                grid-column: auto;
            }

            .hero-actions {
                width: fit-content;
                max-width: 100%;
                align-items: center;
                flex-wrap: wrap;
                row-gap: 0.75rem;
            }

            .hero-actions .gold-button {
                flex: 0 1 auto;
                min-width: 14.5rem;
            }

            .hero-actions button:not(.gold-button) {
                flex: 0 1 auto;
                min-width: 0;
            }

            .hero-actions button {
                min-height: 3.3rem;
            }
        }

        @media (max-width: 767px) {
            .app-container {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }

            .landing-section {
                padding-top: 4.75rem !important;
                padding-bottom: 4.75rem !important;
            }

            .landing-section--compact {
                padding-top: 4rem !important;
                padding-bottom: 4rem !important;
            }

            .section-header {
                margin-bottom: 2rem !important;
            }

            .section-kicker {
                margin-bottom: 0.9rem !important;
                font-size: 0.6rem !important;
                letter-spacing: 0.22em !important;
            }

            .section-title {
                font-size: clamp(1.9rem, 8vw, 2.45rem) !important;
                line-height: 1.08 !important;
                margin-bottom: 0 !important;
            }

            .section-description {
                font-size: 0.98rem !important;
                line-height: 1.72 !important;
            }

            .hero-banner-section {
                align-items: flex-start;
            }

            .hero-banner-content {
                padding-top: 5.75rem !important;
                padding-bottom: 8rem !important;
            }

            .hero-banner-content > .grid {
                min-height: calc(100svh - 9.5rem);
                align-content: center;
            }

            .hero-copy .hero-title--mobile {
                font-size: clamp(2.6rem, 12vw, 3.5rem);
                display: flex;
                flex-direction: column;
                row-gap: 0.05em;
                line-height: 1.04;
                padding-top: 0.36em;
                padding-bottom: 0.22em;
            }

            .hero-copy .hero-title-line {
                display: block;
                line-height: 1.04;
            }

            .hero-copy .hero-title-line--eyebrow {
                font-size: 0.42em;
                letter-spacing: 0.16em;
                line-height: 1.2;
            }

            .hero-copy .hero-title-line--accent {
                font-size: 1.08em;
                line-height: 0.98;
                padding-top: 0.08em;
                padding-bottom: 0.09em;
            }

            .hero-copy .hero-title-line--support {
                font-size: 0.4em;
                line-height: 1.12;
                letter-spacing: 0.06em;
            }

            .hero-kicker {
                width: 100%;
                max-width: none;
                padding: 0.62rem 0.85rem !important;
                border-radius: 1rem !important;
            }

            .hero-kicker span:last-child {
                font-size: 0.56rem !important;
                letter-spacing: 0.11em !important;
                line-height: 1.26 !important;
            }

            .hero-award-line {
                width: 100%;
                justify-content: flex-start;
                padding: 0.72rem 0.9rem !important;
                border-radius: 1rem !important;
                font-size: 0.62rem !important;
                letter-spacing: 0.12em !important;
                line-height: 1.35;
            }

            .hero-copy .hero-title-price-display {
                display: inline-block;
                background: linear-gradient(to right, #ffffff, #C5A059);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: none;
                font-size: clamp(2.2rem, 10.5vw, 3.1rem);
                line-height: 1.28;
                margin-top: 0.02em;
                padding-top: 0.16em;
                padding-bottom: 0.2em;
                overflow: visible;
                vertical-align: top;
            }

            .hero-copy .hero-subcopy {
                font-size: 0.98rem;
                line-height: 1.75;
            }

            .hero-highlights > div {
                width: 100%;
                min-width: 0;
                justify-content: flex-start;
            }

            .hero-highlight-chip {
                min-height: 3rem;
                padding: 0.8rem 0.9rem !important;
                font-size: 0.58rem !important;
                letter-spacing: 0.14em !important;
                line-height: 1.35;
            }

            .hero-mobile-metric-card {
                max-width: none !important;
                margin-top: 1.25rem !important;
                margin-bottom: 1.75rem !important;
            }

            .hero-mobile-metric-card > .relative {
                border-radius: 1.5rem !important;
                padding: 1rem !important;
            }

            .hero-showcase {
                max-width: none;
            }

            .hero-actions button {
                min-height: 3.4rem;
                width: 100%;
            }

            .hero-actions button span {
                white-space: normal !important;
                text-align: center;
            }

            .hero-actions .gold-button span {
                font-size: 0.72rem !important;
                letter-spacing: 0.08em !important;
            }

            .hero-actions button:not(.gold-button) {
                padding-left: 1rem !important;
                padding-right: 1rem !important;
            }

            #tvc .max-w-5xl {
                max-width: none !important;
            }

            #tvc .aspect-video {
                border-width: 3px !important;
                border-radius: 1.25rem !important;
            }

            #vitri .amenity-card {
                padding: 1.35rem !important;
                border-radius: 1.4rem !important;
            }

            #vitri .amenity-card h3 {
                font-size: 1.1rem !important;
                line-height: 1.15 !important;
                margin-bottom: 0.75rem !important;
            }

            .vr-tour-header-actions {
                display: grid !important;
                grid-template-columns: 1fr !important;
                width: 100%;
            }

            .vr-tour-header-actions > * {
                width: 100%;
                justify-content: center;
            }

            .vr-tour-tabs {
                display: grid !important;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 0.5rem !important;
            }

            .vr-tour-tab {
                min-height: 3rem;
                padding: 0.75rem 0.5rem !important;
                font-size: 0.56rem !important;
                letter-spacing: 0.1em !important;
                white-space: normal;
                line-height: 1.25;
            }

            .vr-tour-frame {
                height: 19.5rem !important;
            }

            #vr-tour-viewer-shell {
                border-radius: 1.25rem !important;
            }

            .contact-benefits {
                grid-template-columns: 1fr !important;
            }

            .contact-benefits > div {
                padding: 1.1rem !important;
                border-radius: 1.35rem !important;
            }

            .contact-tags {
                gap: 0.5rem !important;
            }

            .contact-tags > span {
                width: 100%;
                justify-content: center;
                text-align: center;
            }

            .contact-form-card {
                border-radius: 1.5rem !important;
                padding: 1.25rem !important;
            }

            .footer-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 2rem 1.25rem !important;
            }

            .footer-grid > :first-child,
            .footer-grid > :last-child {
                grid-column: 1 / -1;
            }

            footer .app-container > p {
                max-width: 18rem;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.6;
            }

            .chatbot-panel {
                position: fixed !important;
                left: 0.75rem !important;
                right: 0.75rem !important;
                bottom: 5.25rem !important;
                bottom: calc(5.25rem + env(safe-area-inset-bottom)) !important;
                width: auto !important;
                max-height: min(74svh, 34rem) !important;
                border-radius: 1.25rem !important;
                transform: translateY(18px) scale(0.98);
            }

            .chatbot-panel.open {
                transform: translateY(0) scale(1);
            }

            #chat-messages {
                padding: 1rem !important;
            }

            #chat-suggestions {
                display: grid !important;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                align-items: stretch !important;
                grid-auto-rows: 1fr;
                gap: 0.5rem !important;
                overflow-x: visible !important;
                overflow-y: visible !important;
                padding: 0.75rem 1rem !important;
            }

            #chat-suggestions .chat-suggestion:last-child:nth-child(odd) {
                grid-column: 1 / -1;
            }

            .chat-suggestion {
                display: inline-flex !important;
                min-width: 0 !important;
                width: 100%;
                min-height: 2.75rem;
                align-items: center;
                justify-content: center;
                padding: 0.65rem 0.75rem !important;
                text-align: center;
                white-space: normal !important;
                line-height: 1.35;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .chatbot-panel > .p-4.bg-white.border-t.border-surface {
                padding: 0.85rem 1rem 1rem !important;
                padding-bottom: calc(1rem + env(safe-area-inset-bottom)) !important;
            }

            #chat-input {
                min-height: 3.1rem;
                max-height: 6.25rem;
                overflow-y: hidden !important;
                padding-top: 0.72rem !important;
                padding-bottom: 0.72rem !important;
                padding-left: 0.85rem !important;
                padding-right: 0.85rem !important;
                font-size: 0.9rem !important;
            }

            .chatbot-panel .gold-button.h-11.w-11 {
                height: 3.1rem !important;
                width: 3.1rem !important;
            }
        }

        @media (max-width: 389px) {
            .hero-copy .hero-title--mobile {
                font-size: clamp(2.35rem, 12vw, 3rem);
                line-height: 1.06;
                padding-top: 0.4em;
            }

            .hero-copy .hero-title-price-display {
                font-size: clamp(2rem, 10.5vw, 2.6rem);
                line-height: 1.28;
                padding-top: 0.18em;
                padding-bottom: 0.22em;
            }

            .hero-highlights {
                gap: 0.5rem;
            }
        }
    `}</style>
        </>
    );
}







