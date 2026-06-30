## NeXora — Large enhancement batch

I'll implement these in one pass. Grouping so you can confirm scope before I touch ~15 files.

### 1. Auth & Access
- New `src/components/AuthGuard.tsx` using `getCurrentUser()`. Wrap every protected route in `App.tsx` (`/dashboard`, `/beds`, `/appointments`, `/doctors`, `/emergency`, `/track`, `/profile`, `/reschedule`, `/prescriptions`, `/video-call`, `/lab-tests`, `/chat`, `/health-education`, `/feedback`, `/hospital-management`, `/toll-free`). Unauthenticated users redirect to `/login`.
- Mobile login: store the OTP the user actually typed only after verifying it matches the generated code. Today's flow already does that, but I'll tighten messaging: the "Demo OTP" toast stays (no SMS gateway), however validation now requires the user-typed value to exactly match — no auto-fill, no bypass. Also block login if OTP not requested.

### 2. Navbar
- Fix logo/name overlap: shrink logo to 32px, reduce nav item padding, make the icon-only collapse threshold `lg` → `xl`, add `min-w-0` + `truncate` to brand.
- Add **bell notification** dropdown (`NotificationBell.tsx`): reads from a new `src/lib/notifications.ts` event bus (in-memory + localStorage). Existing toast emitters (appointments booked/cancelled, lab results, bed status changes) also push into the bell. Shows unread badge, click to mark read, click item to navigate.

### 3. Login/Signup animations
- Replace current flip with a sliding-panel animation modelled on the reference video: two stacked panels (form + welcome side-banner) that slide horizontally on toggle, with framer-motion spring transitions, floating label inputs, and animated submit button. Mobile falls back to fade+slide.

### 4. Live-location hospital list
- New `src/components/NearbyHospitals.tsx` shown on Dashboard. Uses `navigator.geolocation` → curated list of ~10 sample hospitals with lat/lng across major Indian cities; computes haversine distance from user and shows nearest 5 with "Get Directions" (opens Google Maps) and "Call" buttons.

### 5. Map upgrade (Track page)
- Install `leaflet` + `react-leaflet`. Replace OSM iframe with a Leaflet map showing hospital marker, patient marker, and an animated ambulance marker traveling along an interpolated route polyline between the two real coords. ETA countdown stays.

### 6. Emergency audio
- Add multilingual instruction text for **every** emergency type (Cardiac, Accident, Stroke, Breathing, Bleeding, Poisoning, Burns, Seizure, Allergic Reaction, Childbirth, Unconscious, Other). Use `speechSynthesis` with voice lookup matching `LanguageContext.lang` (en/hi/ta/te/kn/ml/bn/mr) — pick first matching `voice.lang` prefix; if none, fall back to en-IN and toast "Voice unavailable for {lang}, using English". Re-trigger speech on language change while a type is selected.

### 7. Bug fixes
- **WhatsApp/video call/ambulance "request" buttons**: wrap `openWhatsAppChat` in try/catch + add `noopener` fallback link toast ("If WhatsApp didn't open, [click here]") so blocked popups still work. Same fix applied to every call site (Emergency, VideoCall, Doctors, Chat, Track).
- **Appointments cancel**: cancelled appointments are removed from the visible list (filter by status !== 'cancelled') or moved to a collapsed "Past/Cancelled" section.
- **Prescriptions**: wire "View Details" → opens a Dialog with full Rx info; "Request Refill" → toast + adds entry to a `refillRequests` localStorage list and disables button.
- **Chat**: rebuild `smartReply` with intent + entity matching, conversation memory (last user msg + topic), and a fallback that asks a clarifying question instead of repeating. Add 30+ intents.

### 8. Onboarding tour
- Add `src/components/OnboardingTour.tsx` using a lightweight custom overlay (no extra dep): 6-step guided tooltip tour on first dashboard visit (flagged in localStorage `nexora_tour_done`). Steps: Navbar, Bell, Beds, Appointments, Emergency, Profile. "Skip" + "Next" buttons.

### 9. Live time + date
- New `src/components/LiveClock.tsx` shown on Dashboard header: updates every second, format `DD-MM-YYYY · HH:mm:ss` (24h, IST). Auto-refreshes on app open via `useEffect` interval.

### Files touched (new + modified)
**New:** `AuthGuard.tsx`, `NotificationBell.tsx`, `NearbyHospitals.tsx`, `OnboardingTour.tsx`, `LiveClock.tsx`, `lib/notifications.ts`, `lib/hospitals.ts`
**Modified:** `App.tsx`, `Navbar.tsx`, `Login.tsx`, `Dashboard.tsx`, `Track.tsx`, `Emergency.tsx`, `Appointments.tsx`, `Prescriptions.tsx`, `Chat.tsx`, `VideoCall.tsx`, `lib/whatsapp.ts`
**Dep added:** `leaflet`, `react-leaflet`, `@types/leaflet`

Confirm and I'll build it all in one go. If you want me to drop or defer anything (e.g. Leaflet install or onboarding tour), say so now.