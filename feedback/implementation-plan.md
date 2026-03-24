# Feedback Implementation Plan

Last audit: 2026-03-24

## Goal
Dong bo lai landing, chatbot va dashboard theo dung feedback trong thu muc `feedback`, uu tien sua cac phan da bi regress sau luc chuyen sang TSX native.

## Audit Summary
- Landing da render TSX native thanh cong, nhung noi dung tren UI hien tai dang quay ve ban goc lifestyle, chua bam logic chot sale trong `feedback1.md`.
- Chatbot backend, lead pipeline, dashboard va Supabase da co nen tang tot; tuy nhien phan trigger/UI/chat flow tren landing van con mot so diem lech feedback.
- File plan cu dang danh dau `Phase 1-5 completed`, nhung trang thai nay khong con dung voi landing/funnel hien tai. Phase 1-3 can mo lai.

## Current Reality vs Feedback

### Da dung hoac gan dung feedback
- Chatbot da co 4 quick actions dung huong: bang gia, video, dau tu, phap ly.
- API chatbot da co scripted funnel, fallback va Gemini server-side.
- Lead schema da co: ho ten, SDT, Zalo, email, nguon lead, nhu cau, tai chinh, do nong, trang thai, tag.
- Dashboard da co sales script, follow-up copy, uu tien follow-up va Supabase support.

### Chua dung feedback hoac da bi regress

- Kich ban ngoai kenh Facebook comment / Zalo OA moi dung o muc copy tham chieu, chua duoc hook vao pipeline thuc te.

## Reopened Phase 1 - Hero va First Fold Sales Message
Status: completed (2026-03-24)

Implemented:
- Hero doi tu thong diep lifestyle sang thong diep ban hang: `Can ho bien Vung Tau - Chi tu 1,2 ty`.
- Dua gia tong, yield `8-12%/nam` va scarcity `chi con 27 can` len first fold.
- CTA hero da doi thanh `Nhan bang gia noi bo` va `Xem video can dep nhat`.
- Price card mobile va overlay desktop da uu tien gia tong va scarcity thay vi neo `6x tr/m2`.
- Chat popup / welcome copy da doi sang huong hoi `bang gia noi bo hay video can dep`.
- Nut AI trong navbar duoc ha ve vai tro tro ly bo tro, khong con la CTA chinh cua hero.

Scope:
- Doi headline, sub headline, price anchor va hero CTA theo feedback.
- Dua thong diep `1,2 ty/can`, `8-12%/nam`, `chi con 27 can` len first fold.
- Ha vai tro AI avatar trong hero tu `CTA chinh` xuong `bo tro chot lead`.

Target files:
- `app/_components/native-original-landing.tsx`
- `lib/chatbot-config.ts`
- `app/page.tsx`

Acceptance:
- Trong 3 giay dau, nguoi dung thay ro gia tong, loi ich va scarcity.
- Hero chi con 2 huong chinh: nhan bang gia va xem video can dep.

## Reopened Phase 2 - Trust, FOMO va Funnel Order
Status: completed (2026-03-24)

Implemented:
- Doi section video sau hero sang huong thuc dung hon: xem nhanh du an truoc khi xin gia.
- Them section `Ly do xem som` de giai thich ro vi sao khach thuong xin bang gia sau khi xem video.
- Them cum trust nho gon, tu nhien: chu dau tu, phap ly, hinh anh thuc te, ha tang khu vuc.
- Them cum `Cap nhat quy can` voi 73%, 27 can, chiet khau giai doan 1 va ho tro tai chinh de tao ap luc thoi diem nhung van giu wording tu nhien.
- Dieu chinh section ha tang sang giong van ro nghia hon, bot bot dieu va lifestyle.

Scope:
- Them lai block trust nho gon, tu nhien: chu dau tu, phap ly, hinh anh thuc te, ha tang khu vuc.
- Them lai FOMO block de lam ro: da ban 73%, chi con 27 can, uu dai dang mo, toc do chot can dep.
- Sap lai thu tu section theo dung funnel feedback.

Target files:
- `app/_components/native-original-landing.tsx`

Acceptance:
- Sau hero la video ngan va ly do dau tu ro rang.
- Trong first scroll co it nhat 1 cum trust va 1 cum FOMO de chot tam ly.

## Reopened Phase 3 - Conversion Flow va Lead Capture
Status: completed (2026-03-24)

Implemented:
- Them short lead form doc lap tren landing, ngay sau cum trust/FOMO de khach de lai lead ma khong can mo chatbot.
- Noi form landing thang vao `/api/leads` voi source `landing_form`, co hotness va metadata de phan biet diem vao funnel.
- Doi modal san pham tu ngon ngu `Booking` sang `Nhan bang gia & video`, them truong lien he, nhu cau, tai chinh va kenh nhan thong tin.
- Doi sticky CTA mobile sang huong `Bang gia / Chat / Xem video` thay vi dieu huong thong tin chung.
- Doi CTA trong product modal sang lead capture va AI loc can, khong con wording booking tren funnel hien thi.

Scope:
- Them short lead form tren landing: Ho ten, SDT/Zalo, nhu cau, tai chinh.
- Doi toan bo wording booking modal sang `nhan bang gia`, `nhan danh sach can`, `nhan video`.
- Giam vai tro CTA trai nghiem nhu VR o first fold, day ve sau CTA chot lead.
- Ra soat mobile action/floating action de giu dung funnel ban hang.

Target files:
- `app/_components/native-original-landing.tsx`
- `app/page.tsx`
- `lib/native-original-scripts.ts`

Acceptance:
- Khach co the de lai lead ma khong can mo chatbot.
- Khong con wording `Booking`, `tien booking`, `xac nhan booking` tren funnel chinh.

## Phase 4 - Chatbot Alignment Theo Feedback
Status: completed (2026-03-24)

Implemented:
- Chot lai bo copy chatbot tren UI va config: popup mo dau, quick actions, placeholder, mini teaser va follow-up deu bam feedback.
- Doi label/noi dung visible tren landing: `AI tu van 24/7`, `Nhan bang gia`, `Xem video can dep`, khong con quay lai wording cu.
- Dieu chinh behavior: desktop auto open sau 6 giay, mobile/tablet hien mini teaser thay vi mo panel toan bo.
- Them follow-up web session sau 10 phut chua tra loi va follow-up quay lai sau 1 ngay bang session/local storage.
- Noi event tracking cho chatbot open/close/activity/follow-up/lead capture qua `/api/events`.
- Tinh chinh scripted reply cho nhom `Nhan bang gia`, `Xem video` va `GUI GIA` de khop hon voi feedback.

Target files:
- `app/page.tsx`
- `app/api/chatbot/route.ts`
- `lib/chatbot-config.ts`
- `app/_components/native-original-landing.tsx`

Acceptance:
- Chatbot dung feedback text/flow tren UI that, khong chi dung o backend.
- Follow-up 10 phut va 1 ngay co event/state ro rang.

## Phase 5 - CRM, Dashboard va Sales Ops
Status: mostly complete

Da co san:
- Lead schema, hot/warm/cold scoring, tags, status.
- Dashboard recent leads/events, action queue, script goi nhanh, mau nhac lai.
- Supabase read/write hoat dong.

Con thieu:
- Ra soat dashboard copy de dong bo voi wording moi cua landing sau khi sua phase 1-4.
- Hien thi ro hon source/segment cho lead tu landing vs chatbot vs booking modal sau khi doi funnel.
- Neu can, them basic auth/protection cho `/dashboard`.
- Neu doi sale dung them kenh ngoai, chuan bi endpoint/webhook cho Facebook comment / Zalo OA.

Target files:
- `app/dashboard/page.tsx`
- `lib/dashboard-data.ts`
- `lib/lead-store.ts`

Acceptance:
- Dashboard khop 100% voi funnel moi, khong con copy cu.
- Team sale nhin vao la biet lead nao can goi ngay, lead nao can gui Zalo truoc.

## Recommended Build Order
1. Rebuild lai hero va CTA chot sale theo `feedback1.md`.
2. Chen lai trust/FOMO + reorder section theo funnel.
3. Them short lead form va doi wording booking modal.
4. Chot chatbot UI/trigger/follow-up theo `feedback2.md` -> `feedback7.md`.
5. Dong bo dashboard copy, source labels va sales ops.

## Done/Keep List
- Khong can lam lai lead schema, Supabase pipeline, dashboard data layer va Gemini server route tu dau.
- Co the tai su dung chatbot scripted backend hien tai, chi can tinh chinh wording, trigger va follow-up.
- Co the giu TSX native renderer hien tai lam nen, khong quay lai cach import HTML runtime.






