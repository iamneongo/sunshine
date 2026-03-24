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
            <nav className="flex flex-col gap-5 text-base font-bold text-primary/80">
                <a href="#vitri" data-onclick="toggleSidebar()"
                    className="hover:text-primary-container transition-colors py-1">Vị trí</a>
                <a href="#tienich" data-onclick="toggleSidebar()"
                    className="hover:text-primary-container transition-colors py-1">Tiện ích</a>
                <a href="#matbang" data-onclick="toggleSidebar()"
                    className="hover:text-primary-container transition-colors py-1">Mặt bằng</a>
                <a href="#tiendo" data-onclick="toggleSidebar()"
                    className="hover:text-primary-container transition-colors py-1">Tiến độ</a>
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
            </div>

            <div className="flex items-center gap-4">
                <button type="button" data-onclick="toggleChatbot()"
                    className="hidden sm:flex items-center gap-3 bg-primary text-white px-6 py-2.5 rounded-full font-headline font-bold text-[10px] tracking-widest uppercase hover:bg-primary-container transition-all shadow-md group">
                    <img src="./ai_avatar_vn.png"
                        className="w-6 h-6 rounded-full object-cover border border-white/20 group-hover:scale-110 transition-transform"
                        alt="AI Chatbot" />
                    Chat với AI
                </button>
                <button type="button" data-onclick="toggleSidebar()"
                    className="lg:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary text-lg">
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
        </div>
    </nav>

    <main>
        
        <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
            
            <div className="absolute inset-0 z-0">
                <img alt="Sunshine Bay Hero" className="w-full h-full object-cover hero-img opacity-90 scale-105"
                    src="./luxury_beachfront_condo_hero_1774060840570.png" />
                <div className="absolute inset-0 animated-gradient-overlay mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
            </div>

            <div className="app-container relative z-10 pt-20 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    <div className="reveal animate-fade-in-up">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container/30 backdrop-blur-md mb-4 sm:mb-6">
                            <i className="fa-solid fa-gem text-primary-container shadow-sm"></i>
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[3px] text-white">Kiến tạo
                                di sản nghỉ dưỡng</span>
                        </div>

                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 hero-title tracking-tight uppercase">
                            Sống Trọn <br /> <span className="italic font-light">Từng</span> Khoảnh Khắc
                        </h1>

                        <p className="text-white/70 text-base md:text-lg max-w-xl mb-6 sm:mb-8 font-medium leading-[1.6]">
                            Trải nghiệm căn hộ <span className="text-primary-container font-black">Sky Villa</span> 100%
                            view biển. Sự kết hợp hoàn hảo giữa công nghệ SmartHome 4.0 và không gian nghỉ dưỡng chuẩn 5
                            sao.
                        </p>

                        
                        <div className="lg:hidden relative mb-6 sm:mb-10 w-full max-w-[360px] mx-auto sm:mx-0">
                            <div className="absolute -inset-1 bg-primary-container/20 blur-xl rounded-2xl"></div>
                            <div
                                className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl shadow-2xl">
                                <div className="flex justify-between items-start mb-4 sm:mb-5">
                                    <div>
                                        <div
                                            className="text-[8px] sm:text-[9px] text-primary-container font-black uppercase tracking-widest mb-1 sm:mb-1.5 drop-shadow-sm">
                                            Giá chỉ từ</div>
                                        <div
                                            className="text-2xl sm:text-3xl font-black text-white italic drop-shadow-md leading-none">
                                            6x <span className="text-xs sm:text-sm not-italic font-bold ml-0.5">tr/m²</span>
                                        </div>
                                    </div>
                                    <div className="text-right pt-1">
                                        <div
                                            className="text-[7px] sm:text-[8px] text-primary-container font-black uppercase tracking-widest mb-1 sm:mb-1.5 drop-shadow-sm">
                                            Tiêu chuẩn</div>
                                        <div
                                            className="text-[10px] sm:text-xs font-black text-white drop-shadow-md bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 whitespace-nowrap">
                                            5 SAO FULL</div>
                                    </div>
                                </div>
                                <div
                                    className="w-full h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-4 sm:mb-5">
                                </div>
                                <div
                                    className="flex items-center gap-2.5 sm:gap-3 bg-black/20 p-2.5 sm:p-3 rounded-xl border border-white/5">
                                    <div
                                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs sm:text-sm shrink-0 shadow-inner">
                                        <i className="fa-solid fa-calendar-check"></i>
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] text-white/90 font-medium leading-[1.4]">Bàn
                                        giao dự kiến: <br /> <span
                                            className="text-primary-container font-black text-[10px] sm:text-[11px] tracking-wide">QUÝ
                                            IV / 2026</span></div>
                                </div>
                            </div>
                        </div>

                        
                        <div
                            className="flex flex-row items-center gap-3 sm:gap-6 w-full max-w-[360px] mx-auto sm:mx-0 sm:max-w-none">
                            <button type="button" data-onclick="toggleChatbot()"
                                className="gold-button flex-1 py-3 px-4 sm:px-8 sm:py-4 rounded-full text-white font-black shadow-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                <div className="relative shrink-0">
                                    <img src="./ai_avatar_vn.png"
                                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover border border-white/30"
                                        alt="AI Avatar" />
                                    <div
                                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-primary sm:hidden">
                                    </div>
                                </div>
                                <span
                                    className="text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap leading-none mt-0.5">Tư
                                    vấn AI</span>
                            </button>
                            <button type="button" data-onclick="openVRImage()"
                                className="flex-none flex items-center justify-center gap-2 group bg-white/10 backdrop-blur-md sm:bg-transparent sm:border-none border border-white/20 pr-4 sm:pr-0 pl-1 py-1 sm:p-0 rounded-full transition-all hover:bg-white/20">
                                <div
                                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/40 sm:bg-transparent border border-white/20 sm:border-2 sm:border-white/20 flex items-center justify-center text-white text-xs sm:text-lg group-hover:bg-primary-container group-hover:border-primary-container transition-all shrink-0">
                                    <i className="fa-solid fa-play ml-0.5"></i>
                                </div>
                                <span
                                    className="text-white font-black text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap leading-none mt-0.5 pr-1 sm:pr-0">360°
                                    VR</span>
                            </button>
                        </div>
                    </div>

                    
                    <div className="hidden lg:block relative reveal">
                        <div className="absolute -inset-2 bg-primary-container/20 blur-2xl rounded-2xl"></div>
                        <div className="relative rounded-2xl overflow-hidden border-4 border-white/10 shadow-3xl group">
                            <img src="./sunshine_villa_interior_card_1774061099772.png"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                                alt="Sky Villa Interior" />
                            <div
                                className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-primary/80 to-transparent">
                                <div
                                    className="text-[10px] text-primary-container font-black uppercase tracking-widest mb-1">
                                    Thiết kế chuẩn Quốc tế</div>
                                <div className="text-xl text-white font-black italic">PHÂN KHU SKY VILLA</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        
        <section id="tvc" className="py-24 bg-surface-container relative overflow-hidden">
            <div className="app-container">
                <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                    <span
                        className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block font-body">Trải
                        Nghiệm Điện Ảnh</span>
                    <h2
                        className="text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                        Thước Phim <span className="text-primary-container">Chân Thực</span>
                    </h2>
                    <p className="text-base opacity-60 font-body leading-relaxed">
                        Cảm nhận nhịp sống thượng lưu và quy mô tầm cỡ của Sunshine Bay Retreat qua những hình ảnh thực
                        tế sống động nhất.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto reveal">
                    <div
                        className="relative w-full border-4 border-white aspect-video rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,27,53,0.15)] bg-slate-900 group">
                        <iframe width="100%" height="100%"
                            src="https://www.youtube.com/embed/oum9PyUrZeg?si=ByhzBRYFkiMdQNtg&autoPlay=1&mute=1&loop=1&playlist=oum9PyUrZeg&controls=1&modestbranding=1"
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                            className="absolute inset-0 w-full h-full scale-[1.02]"></iframe>

                        
                        <div
                            className="absolute bottom-6 left-6 z-10 pointer-events-none opacity-100 transition-opacity duration-500 group-hover:opacity-0 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20">
                            <div
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                                <i className="fa-solid fa-volume-xmark text-xs"></i>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Tương tác trực tiếp video để
                                bật âm thanh</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="vitri" className="py-16 bg-white">
            <div className="app-container">
                <div className="grid lg:grid-cols-2 gap-6 items-end mb-8 reveal">
                    <div>
                        <span
                            className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Hạ
                            tầng trọng điểm</span>
                        <h2
                            className="text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tighter">
                            Vị thế <span className="text-primary-container">Kết Nối</span> Tỷ Đô</h2>
                    </div>
                    <p className="text-on-surface/50 text-base md:text-lg max-w-md lg:ml-auto">
                        Sunshine Bay Retreat là tâm điểm đón đầu sóng hạ tầng hoàn thiện vào năm 2025-2026 tại Vũng Tàu.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                    <div className="amenity-card p-8 rounded-2xl shadow-sm">
                        <div
                            className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                            <i className="fa-solid fa-gauge-high"></i>
                        </div>
                        <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">Cao tốc Biên Hòa</h3>
                        <p className="text-xs opacity-60 leading-relaxed font-body">Rút ngắn khoảng cách di chuyển từ trung
                            tâm kinh tế Đông Nam Bộ.</p>
                    </div>
                    <div className="amenity-card p-8 rounded-2xl shadow-sm">
                        <div
                            className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                            <i className="fa-solid fa-bridge"></i>
                        </div>
                        <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">Cầu Biển Cần Giờ</h3>
                        <p className="text-xs opacity-60 leading-relaxed font-body">Biểu tượng kết nối đưa TP.HCM xích lại
                            gần phố biển hơn bao giờ hết.</p>
                    </div>
                    <div className="amenity-card p-8 rounded-2xl shadow-sm">
                        <div
                            className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                            <i className="fa-solid fa-road"></i>
                        </div>
                        <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">Bến Lức Long Thành</h3>
                        <p className="text-xs opacity-60 leading-relaxed font-body">Tuyến huyết mạch quan trọng nối liền các
                            tỉnh miền Tây với phố biển.</p>
                    </div>
                    <div className="amenity-card p-8 rounded-2xl shadow-sm">
                        <div
                            className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center mb-6 text-primary-container text-2xl">
                            <i className="fa-solid fa-train"></i>
                        </div>
                        <h3 className="text-lg font-black mb-4 uppercase tracking-tighter">Đường Sắt Biên Hòa</h3>
                        <p className="text-xs opacity-60 leading-relaxed font-body">Giải pháp vận chuyển đa phương thức hiện
                            đại, bền vững cho tương lai.</p>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="vr-tour" className="py-24 bg-primary text-white relative overflow-hidden">
            <div
                className="absolute inset-0 z-0 opacity-40 bg-[url('./sunshine-bay-retreat-28.jpg')] bg-cover bg-center mix-blend-overlay">
            </div>

            <div className="app-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="reveal">
                        <span
                            className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-6 block font-body">Công
                            nghệ tương lai</span>
                        <h2
                            className="text-3xl md:text-5xl font-black text-white leading-tight mb-8 uppercase tracking-tighter">
                            Khám Phá <span className="text-primary-container">VR 360</span> <br /> Thực Tế Ảo
                        </h2>
                        <p className="text-base opacity-60 mb-10 max-w-lg font-body leading-relaxed">
                            Trải nghiệm không gian sống thượng lưu ngay tại nhà. Công nghệ VR 360 cho phép bạn tham quan
                            từng góc ngách của Sunshine Bay Retreat với độ chân thực 100%.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                                    <i className="fa-solid fa-expand"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Toàn cảnh 360 độ</h4>
                                    <p className="text-xs opacity-50 font-body">Tầm nhìn không giới hạn từ ban công căn hộ
                                        Sky Villa.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Thiết kế tinh xảo</h4>
                                    <p className="text-xs opacity-50 font-body">Cảm nhận chất lượng vật liệu bàn giao từ các
                                        thương hiệu hàng đầu.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button type="button" data-onclick="openVRImage()"
                                className="gold-button inline-flex items-center gap-4 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl group transition-all">
                                Tham quan VR 360°
                                <i
                                    className="fa-solid fa-vr-cardboard text-xl group-hover:rotate-12 transition-transform"></i>
                            </button>
                            <a href="https://www.youtube.com/watch?v=oum9PyUrZeg" target="_blank"
                                className="bg-white/10 backdrop-blur-md border border-white/20 inline-flex items-center gap-4 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl group transition-all hover:bg-white/20">
                                Xem TVC Quay Thực Tế
                                <i className="fa-solid fa-play text-xl group-hover:scale-110 transition-transform"></i>
                            </a>
                        </div>
                    </div>

                    <div className="reveal relative">
                        <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden vr-container border-4 border-white/5 relative group cursor-pointer shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                            data-onclick="openVRImage()">
                            <div id="panorama-preview" className="w-full h-full relative">
                                <div id="panorama-overlay"
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 group-hover:bg-black/30 transition-all pointer-events-none">
                                    <div
                                        className="w-20 h-20 rounded-full bg-primary-container/90 flex items-center justify-center text-white text-2xl animate-pulse shadow-2xl">
                                        <i className="fa-solid fa-play ml-1"></i>
                                    </div>
                                    <p
                                        className="mt-8 text-[10px] font-black uppercase tracking-[3px] drop-shadow-lg text-white">
                                        Khám phá không gian 360°</p>
                                </div>
                                <img src="./sunshine-vung-tau-8.jpg"
                                    className="w-full h-full object-cover blur-[0.5px] scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
                                    alt="VR Preview" />
                            </div>
                        </div>

                        
                        <div
                            className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-2xl shadow-2xl z-20 max-w-[200px] hidden md:block">
                            <div className="flex items-center gap-3 mb-2 text-primary-container">
                                <i className="fa-solid fa-award"></i>
                                <span className="text-[9px] font-black uppercase tracking-widest">Sky Villa Gold
                                    Edition</span>
                            </div>
                            <p className="text-[10px] text-white/70 leading-relaxed font-bold">Trải nghiệm căn hộ thực tế ảo
                                với đầy đủ nội thất bàn giao chuẩn 5 sao.</p>
                        </div>
                    </div>
                </div>
            </div>

            
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                #panorama {
                    background-color: #000;
                }

                .pnlm-load-box {
                    background-color: #C5A059 !important;
                }

                .pnlm-lbtn {
                    background-color: #C5A059 !important;
                }
                    `
                }}
            />
        </section>

        

        <section id="matbang" className="py-24 bg-surface-container">
            <div className="app-container">
                <div className="text-center max-w-2xl mx-auto mb-16 reveal">
                    <span
                        className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block font-body">Bộ
                        Sưu Tập Siêu Phẩm</span>
                    <h2
                        className="text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                        Sản Phẩm <span className="text-primary-container">Độc Bản</span>
                    </h2>
                    <p className="text-base opacity-60 font-body leading-relaxed">
                        Sunshine Bay Retreat mang đến đa dạng các loại hình bất động sản nghỉ dưỡng hàng đầu, kết hợp
                        hoàn hảo giữa không gian sống thông minh 4.0 và đặc quyền thượng lưu.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                    
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-surface-container group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                        data-onclick="openProductModal('skyvilla')">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img src="./interior.png"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt="Sky Villa" />
                            <div
                                className="absolute top-4 left-4 bg-primary-container text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                Hot</div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-black text-primary uppercase mb-2">Căn Hộ Sky Villa</h3>
                            <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Căn hộ nghỉ dưỡng 100% view
                                biển với nội thất chuẩn 5 sao và công nghệ SmartHome.</p>
                            <div className="flex justify-between items-center pt-4 border-t border-surface-container">
                                <div className="text-primary-container font-black text-sm">Từ 6x triệu/m²</div>
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
                                alt="Biệt Thự" />
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-black text-primary uppercase mb-2">Biệt Thự Nghỉ Dưỡng</h3>
                            <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Biệt thự độc lập khu Horizon &
                                Eden với kiến trúc tinh xảo và tiện ích đặc quyền.</p>
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
                            <img src="./sunshine_villa_interior_card_1774061099772.png"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                alt="Shophouse" />
                        </div>
                        <div className="p-8">
                            <h3 className="text-xl font-black text-primary uppercase mb-2">Shophouse Thương Mại</h3>
                            <p className="text-[11px] opacity-60 font-body mb-4 line-clamp-2">Tọa lạc tại phố đi bộ biển,
                                lợi thế kinh doanh vượt trội trong hệ sinh thái All-in-one.</p>
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
                <div className="bg-white rounded-xl max-w-md w-full relative z-10 shadow-2xl p-8 transform scale-95 opacity-0 transition-all duration-300"
                    id="booking-modal-content">
                    <button type="button" data-onclick="closeBookingModal()"
                        className="absolute top-4 right-4 w-8 h-8 bg-surface-container rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <i className="fa-solid fa-xmark text-sm"></i>
                    </button>

                    <div className="text-center mb-8">
                        <div
                            className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fa-solid fa-file-signature"></i>
                        </div>
                        <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Booking Online</h3>
                        <p className="text-xs opacity-60 font-body mt-2">Giữ chỗ ưu tiên sản phẩm: <span
                                id="booking-product-name" className="font-bold text-primary"></span></p>
                    </div>

                    <form id="booking-form" data-onsubmit="submitBooking(event)">
                        <input type="hidden" id="booking-product-id" name="product_id" />

                        <div className="space-y-4 mb-8">
                            <div>
                                <label
                                    className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Họ
                                    và tên *</label>
                                <input type="text" required
                                    className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                                    placeholder="Nhập họ và tên..." />
                            </div>
                            <div>
                                <label
                                    className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Số
                                    điện thoại *</label>
                                <input type="tel" required
                                    className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container transition-all"
                                    placeholder="Nhập số điện thoại..." />
                            </div>
                            <div>
                                <label
                                    className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Số
                                    tiền Booking (VNĐ)</label>
                                <select
                                    className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-container transition-all font-bold text-primary">
                                    <option value="50M">50.000.000 VNĐ</option>
                                    <option value="100M">100.000.000 VNĐ</option>
                                    <option value="200M">200.000.000 VNĐ</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Phương
                                    thức thanh toán</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label
                                        className="flex items-center gap-3 p-3 rounded-xl border border-primary-container bg-primary-container/5 cursor-pointer">
                                        <input type="radio" name="payment" value="transfer" defaultChecked
                                            className="text-primary-container focus:ring-primary-container hidden peer" />
                                        <div
                                            className="w-4 h-4 rounded-full border border-primary-container peer-checked:bg-primary-container flex items-center justify-center group">
                                            <div className="w-2 h-2 rounded-full bg-white hidden peer-checked:block"></div>
                                        </div>
                                        <span className="text-xs font-bold text-primary">Chuyển khoản</span>
                                    </label>
                                    <label
                                        className="flex items-center gap-3 p-3 rounded-xl border border-surface-container hover:border-primary-container cursor-pointer transition-colors">
                                        <input type="radio" name="payment" value="card"
                                            className="text-primary-container focus:ring-primary-container hidden peer" />
                                        <div
                                            className="w-4 h-4 rounded-full border border-primary/20 peer-checked:border-primary-container peer-checked:bg-primary-container flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white hidden peer-checked:block"></div>
                                        </div>
                                        <span className="text-xs font-bold text-primary">Thẻ tín dụng</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" id="submit-booking-btn"
                            className="w-full gold-button py-4 rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                            Xác nhận Booking <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </form>

                    
                    <div id="booking-success"
                        className="absolute inset-0 bg-white z-20 rounded-xl flex flex-col items-center justify-center p-8 text-center opacity-0 pointer-events-none transition-all duration-300">
                        <div
                            className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <h3 className="text-2xl font-black text-primary uppercase mb-2">Khởi Tạo Thành Công</h3>
                        <p className="text-sm opacity-60 font-body mb-8">Hệ thống đã ghi nhận yêu cầu Booking. Chuyên viên
                            sẽ liên hệ với bạn trong ít phút để hướng dẫn thủ tục.</p>
                        <button type="button" data-onclick="closeBookingSuccess()"
                            className="bg-surface-container py-3 px-8 rounded-full text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-colors shadow-sm">Đóng
                            cửa sổ</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="developer" className="py-24 bg-white relative overflow-hidden">
            <div className="app-container">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 reveal">
                        <div className="relative">
                            <div
                                className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl">
                            </div>
                            <img src="./hero.png" alt="" className="rounded-2xl shadow-2xl relative z-10" />
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
                            đầu tư uy tín</span>
                        <h2
                            className="text-3xl md:text-5xl font-black text-primary leading-tight mb-8 uppercase tracking-tight">
                            Sunshine Group <br /> <span className="text-primary-container">Tiên Phong</span> Công Nghệ</h2>
                        <p className="text-on-surface/60 text-base font-body leading-relaxed mb-8">
                            Sunshine Group là tập đoàn kinh tế đa ngành hàng đầu Việt Nam, nổi tiếng với việc tích hợp
                            công nghệ 4.0 vào bất động sản. Với triết lý "Hôm nay tuyệt vời hơn ngày hôm qua", Sunshine
                            Group cam kết mang đến những sản phẩm mang tính biểu tượng và trải nghiệm sống đẳng cấp
                            nhất.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-surface-container rounded-2xl">
                                <div className="text-2xl font-black text-primary mb-1">10+</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">Năm kinh
                                    nghiệm</div>
                            </div>
                            <div className="p-6 bg-surface-container rounded-2xl">
                                <div className="text-2xl font-black text-primary mb-1">50+</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">Dự án toàn
                                    quốc</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="py-24 bg-surface">
            <div className="app-container">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="reveal">
                        <div
                            className="bg-primary p-12 rounded-2xl text-white shadow-2xl h-full flex flex-col justify-center">
                            <span
                                className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">Chính
                                sách đặc quyền</span>
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-8 leading-tight">Ưu Đãi <span
                                    className="text-primary-container">Giai Đoạn 1</span></h3>
                            <ul className="space-y-6">
                                <li className="flex items-center gap-4">
                                    <div
                                        className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                        <i className="fa-solid fa-percent"></i></div>
                                    <span className="text-sm font-body opacity-80">Chiết khấu thanh toán nhanh lên đến
                                        **15%**</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div
                                        className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                        <i className="fa-solid fa-gift"></i></div>
                                    <span className="text-sm font-body opacity-80">Tặng gói nội thất SmartHome AI trị giá
                                        **300.000.000đ**</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div
                                        className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container text-xs shrink-0">
                                        <i className="fa-solid fa-building-columns"></i></div>
                                    <span className="text-sm font-body opacity-80">Hỗ trợ vay 0% lãi suất trong **24
                                        tháng**</span>
                                </li>
                            </ul>
                            <button type="button" data-onclick="toggleChatbot()"
                                className="gold-button mt-12 py-4 rounded-full text-white font-black text-[10px] uppercase tracking-widest w-full">Xem
                                bảng tính dòng tiền</button>
                        </div>
                    </div>
                    <div className="reveal">
                        <div className="bg-white p-12 rounded-2xl border border-surface-container shadow-xl h-full">
                            <span
                                className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-6 block">Pháp
                                lý minh bạch</span>
                            <h3 className="text-3xl font-black text-primary uppercase tracking-tight mb-8 leading-tight">Hồ
                                Sơ <span className="text-primary-container">Hoàn Thiện</span></h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Giấy phép
                                        xây dựng</span>
                                    <span
                                        className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Đã
                                        cấp</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Quy hoạch
                                        1/500</span>
                                    <span
                                        className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Hoàn
                                        tất</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Quyền sử
                                        dụng đất</span>
                                    <span
                                        className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Sổ
                                        tổng</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-surface-container">
                                    <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">Chứng thư
                                        bảo lãnh</span>
                                    <span
                                        className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-black uppercase">Vietinbank</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="tienich" className="py-24 bg-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img alt="" className="w-full h-full object-cover opacity-10" src="./pool.png" />
            </div>

            <div className="app-container relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20 reveal">
                    <span className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Hệ
                        tiện ích độc bản</span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6 italic">Thiên
                        Đường <span className="text-primary-container">Nghỉ Dưỡng</span></h2>
                    <p className="text-white/40 text-base font-body">Chuỗi tiện ích thượng lưu được thiết kế dành riêng cho
                        giới tinh hoa.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center reveal">
                    <div className="group">
                        <div
                            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                            <i className="fa-solid fa-water-ladder text-3xl"></i>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider mb-4">Hồ Bơi Vô Cực</h4>
                        <p className="text-white/40 text-sm font-body px-4">Đắm mình trong làn nước mát với tầm nhìn ôm trọn
                            đường chân trời.</p>
                    </div>
                    <div className="group">
                        <div
                            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                            <i className="fa-solid fa-umbrella-beach text-3xl"></i>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider mb-4">Phố Đi Bộ Biển</h4>
                        <p className="text-white/40 text-sm font-body px-4">Cung đường mua sắm sầm uất ngay thềm nhà cư dân
                            thượng lưu.</p>
                    </div>
                    <div className="group">
                        <div
                            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-container mb-8 mx-auto group-hover:bg-primary-container group-hover:text-white transition-all transform group-hover:rotate-12">
                            <i className="fa-solid fa-spa text-3xl"></i>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider mb-4">wellness Center</h4>
                        <p className="text-white/40 text-sm font-body px-4">Bầu không khí trong lành với hệ thống cây xanh
                            đa tầng, đa lớp.</p>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="tiendo" className="py-24 bg-white">
            <div className="app-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal">
                    <div className="max-w-xl">
                        <span
                            className="text-primary-container font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">Nhật
                            ký xây dựng</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary uppercase tracking-tight">Tiến Độ <span
                                className="text-primary-container">Thực Tế</span></h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 italic">Cập
                            nhật tháng 03/2026</div>
                        <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                            <div className="w-[75%] h-full bg-primary-container"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                    <div className="relative rounded-2xl overflow-hidden group shadow-2xl h-[400px]">
                        <img src="./sunshine-bay-retreat-28.jpg" alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                        </div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <span
                                className="bg-primary-container px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 inline-block">Giai
                                đoạn hạ tầng</span>
                            <h4 className="text-xl font-black uppercase tracking-tight">Hoàn tất móng cọc & Hầm</h4>
                            <p className="text-[10px] opacity-60 font-body mt-2">Đã hoàn thành 100% hạng mục móng cọc, đang
                                triển khai sàn tầng 1.</p>
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
                                <h5 className="text-sm font-black uppercase tracking-widest text-primary mb-2">An toàn lao
                                    động</h5>
                                <p className="text-[10px] opacity-60 font-body">Đạt chứng chỉ an toàn thi công quốc tế, 500+
                                    ngày làm việc không tai nạn.</p>
                            </div>
                        </div>
                        <div
                            className="bg-surface-container rounded-2xl p-8 flex items-center gap-6 group hover:translate-x-2 transition-transform">
                            <div
                                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-primary-container text-2xl">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                            <div>
                                <h5 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Cam kết tiến
                                    độ</h5>
                                <p className="text-[10px] opacity-60 font-body">Vận hành 3 ca liên tục, đảm bảo bàn giao
                                    đúng thời hạn Quý IV/2026.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section id="contact" className="hidden">
        </section>
    </main>

    
    <footer className="bg-primary pt-24 pb-12 px-6 md:px-12 border-t border-white/5">
        <div className="app-container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
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
                        Nhắn cho AI Trợ Lý
                    </button>
                </div>
            </div>
            <p className="text-white/20 text-[8px] uppercase font-black tracking-widest text-center">© 2026 Sunshine Bay
                Retreat. Phân phối bởi Ekip Admin.</p>
        </div>
    </footer>

    
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 items-end">
        
        <aside id="chatbot-panel" className="chatbot-panel">
            
            <div className="bg-primary p-5 flex justify-between items-center text-white border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src="./ai_avatar_vn.png"
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-primary-container/30 shadow-lg"
                            alt="AI Avatar" />
                        <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary chat-status-dot">
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-container mb-0.5">
                            Sunshine Assistant</div>
                        <h3 className="text-sm font-black uppercase tracking-tighter leading-none">AI Phản hồi tức thì</h3>
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
                        Xin chào! Tôi là **Sunshine AI**. Tôi có thể giải đáp nhanh về giá bán, vị trí, tiện ích hoặc hỗ
                        trợ bạn đặt lịch xem nhà mẫu dự án **Sunshine Bay Retreat**.
                    </div>
                </div>
            </div>

            
            <div id="chat-suggestions" className="px-5 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Sunshine Bay giá bao nhiêu?')">Giá bán dự
                    án</button>
                <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Vị trí dự án ở đâu?')">Vị trí & Kết
                    nối</button>
                <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Tiện ích có gì nổi bật?')">Hệ sinh thái tiện
                    ích</button>
                <button type="button" className="chat-suggestion" data-onclick="pushSuggestion('Tôi muốn xem nhà mẫu')">Đặt lịch xem
                    nhà</button>
            </div>

            
            <div className="p-4 bg-white border-t border-surface">
                <div className="flex gap-3">
                    <textarea id="chat-input" placeholder="Hỏi về Sunshine Bay..." rows={1}
                        className="flex-1 bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary-container resize-none"
                        data-onkeypress="handleChatEnter(event)"></textarea>
                    <button type="button" data-onclick="handleSendMessage()"
                        className="w-12 h-12 gold-button text-white rounded-xl flex items-center justify-center shadow-lg">
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
                className="absolute right-20 bg-primary text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">AI
                Sunshine Assistant</span>
        </button>
    </div>

    
    <div
        className="fixed bottom-0 left-0 w-full z-[140] bg-white border-t flex items-center justify-around py-3 md:hidden shadow-2xl">
        <a href="#vitri" className="flex flex-col items-center gap-1 text-primary">
            <i className="fa-solid fa-map-location-dot"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Vị trí</span>
        </a>
        <button type="button" data-onclick="toggleChatbot()"
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-2xl border-4 border-white overflow-hidden">
            <img src="./ai_avatar_vn.png" className="w-full h-full object-cover" alt="AI Chatbot" />
        </button>
        <a href="#tiendo" className="flex flex-col items-center gap-1 text-primary">
            <i className="fa-solid fa-file-pdf"></i>
            <span className="text-[8px] font-black uppercase tracking-widest">Tiến độ</span>
        </a>
    </div>
    </>
  );
}



