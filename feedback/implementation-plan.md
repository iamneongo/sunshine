# Feedback Implementation Plan

## Goal
Chuyển landing từ bản "đẹp nhưng chưa chốt sale" sang bản tối ưu chuyển đổi theo toàn bộ feedback trong thư mục `feedback`, đồng thời nâng chatbot thành sales funnel thật có API Gemini phía server.

## Phase 1 - Messaging va Hero
Status: completed

Scope:
- Thay headline hero sang thông điệp chot sale: gia tong, loi ich, FOMO.
- Doi sub copy de nhan manh dong tien, scarcity va ly do mua ngay.
- Chuyen block gia tu don vi m2 sang tong gia can ho.
- Danh gia lai CTA chinh/phu de tap trung vao bang gia va video can dep.

Target areas:
- Hero section trong `index.html` (dang duoc render qua `lib/original-landing.ts`)
- CTA labels tren hero va mobile action bar
- Price labels trong hero, card, product modal

Acceptance:
- Khach vao trang trong 3 giay dau nhin thay gia tong, loi ich va FOMO.
- CTA chinh huong den nhan bang gia noi bo.

## Phase 2 - Trust va FOMO Blocks
Status: completed

Scope:
- Them block trust: phap ly, chu dau tu, hinh anh thuc te, giay to.
- Them block FOMO: da ban bao nhieu, giu cho/tang gia sau bao lau, so can con lai.
- Kiem tra lai section developer/vi tri/tien do de tach du thong tin trust thay vi chi trinh bay dep.

Target areas:
- Sau hero / truoc cac block gioi thieu san pham
- Section `developer`, `tiendo`, `vitri`
- Asset thuc te / icon trust / badge urgency

Acceptance:
- Co toi thieu 1 cum trust va 1 cum FOMO ro rang tren first scroll.

## Phase 3 - Conversion Flow
Status: completed

Scope:
- Sap xep lai thu tu section theo funnel: hero -> video ngan -> ly do dau tu -> trust -> FOMO -> form.
- Them form lead ngan de lay ten, SDT/Zalo, nhu cau, tai chinh.
- Giu booking modal nhung doi wording de phu hop lead capture thay vi demo UI.

Target areas:
- Cac section sau hero trong `index.html`
- Booking modal va CTA tai product cards
- Sticky CTA cho mobile

Acceptance:
- Co duong di ro rang tu hero den form, khong phu thuoc chi vao chatbot.

## Phase 4 - Chatbot Funnel va Gemini API
Status: completed

Done in this step:
- Tao `app/api/chatbot/route.ts` theo huong hybrid: scripted sales funnel cho quick action va Gemini cho cau hoi mo.
- Them fallback de chat van hoat dong khi chua co `GEMINI_API_KEY`.
- Chuan bi prompt ban hang, quick actions va context du an trong `lib/chatbot-config.ts`.
- Tao `app/api/leads/route.ts` va `lib/lead-store.ts` de luu lead theo schema dung cho CRM/Google Sheet/Firebase.
- Noi landing form, booking modal va chatbot vao cung pipeline lead.
- Them follow-up state cho quick action: bang gia, video, dau tu, goi nhanh, dat lich xem du an.

Acceptance:
- Chatbot mo popup dung context hero, dua 4 quick actions, tra loi server-side va co nhung scripted funnel cho case chot sale chinh.
- Form, modal va chatbot deu do ve cung schema lead.
- Loi goi API hoac thieu key van co fallback on dinh.

## Phase 5 - Dashboard va Supabase
Status: completed

Done in this step:
- Tao dashboard `/dashboard` trong Next.js de quan sat KPI lead, breakdown va recent activity.
- Them `app/api/events/route.ts` va event tracking cho cac touchpoint quan trong tren landing.
- Tao repository layer dung chung cho leads/events voi local fallback va Supabase REST sync/read.
- Bo sung schema Supabase tai `supabase/schema.sql` va cap nhat env mau.
- Giữ local JSON la fallback an toan khi chua cau hinh Supabase.

Acceptance:
- Dashboard doc duoc du lieu lead/event trong Next.js.
- Neu co `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, he thong uu tien doc/sync voi Supabase.
- Neu chua co Supabase, landing va dashboard van hoat dong on dinh voi local data.

## Immediate Next Build Order
1. Noi Supabase vao project that bang env production va chay schema SQL.
2. Them auth/basic protection cho `/dashboard` neu can mo cho sale team.
3. Day tiep sang CRM/Google Sheet neu doi sale can diem den khac ngoai Supabase.
