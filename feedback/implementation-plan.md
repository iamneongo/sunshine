# Feedback Implementation Plan

## Goal
Chuyển landing từ bản "đẹp nhưng chưa chốt sale" sang bản tối ưu chuyển đổi theo toàn bộ feedback trong thư mục `feedback`, đồng thời nâng chatbot thành sales funnel thật có API Gemini phía server.

## Phase 1 - Messaging va Hero
Status: pending

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
Status: pending

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
Status: pending

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
Status: in_progress

Done in this step:
- Tao `app/api/chatbot/route.ts` de goi Gemini server-side.
- Them fallback de chat van hoat dong khi chua co `GEMINI_API_KEY`.
- Chuan bi prompt ban hang, quick actions va context du an trong `lib/chatbot-config.ts`.
- Noi chat hien tai sang API moi qua transform trong `lib/original-landing.ts`.

Next:
- Day manh lead capture: ten, SDT/Zalo, nhu cau, tai chinh, muc do nong.
- Tao API lead ingestion (`/api/leads`) de luu vao CRM/Google Sheet/Firebase.
- Them follow-up state va event tracking cho cac quick action.

Acceptance:
- Chatbot mo popup dung context hero, dua 4 quick actions, va tra loi server-side.
- Loi goi API hoac thieu key van co fallback on dinh.

## Phase 5 - Data va Ops
Status: pending

Scope:
- Dinh nghia schema lead va lead scoring: hot/warm/cold.
- Day event analytics cho cac diem cham: click CTA, open chat, request bang gia, submit lead.
- Chot diem den du lieu: Google Sheet, Firebase, hoac CRM.

Acceptance:
- Moi lead tu chatbot/form deu co schema nhat quan va de ban giao cho sale.

## Immediate Next Build Order
1. Hoan tat wiring chatbot API + test fallback.
2. Refactor hero copy va CTA theo feedback 1.
3. Them trust/FOMO blocks.
4. Tao lead form va API luu lead.
5. Gan analytics va diem den CRM.

