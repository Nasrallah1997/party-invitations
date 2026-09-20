# 🎟️ Party & Event Pass — Mobile Invitation & QR Gate Management System

A production-ready **Expo + React Native + TypeScript** application featuring unique secure QR code generation, real-time gate scanner verification, event & guest management, and gate entrance controls.

---

## 📱 Features (Stage 1 Complete)

### 1. 🛡️ Admin Dashboard & Analytics
- **Live Metrics**: Total registered guests, total verified check-ins, remaining arrivals, and attendance rate percentage bar.
- **Event Switcher**: Instantly switch the active event or view multi-event stats.
- **Recent Check-In Activity**: Live feed of recently verified guests at the entrance.

### 2. 📅 Event Management (`/admin/events`)
- **Event Directory**: Search and filter events by name and venue location.
- **Event Creation** (`/admin/create-event`): Add new celebrations with custom title, venue/location, event date & time, capacity, and VIP entrance notes.

### 3. 👥 Guest Directory & Unlimited QR Generation (`/admin/guests`)
- **Search & Filter**: Filter by status (*All*, *Checked In*, *Pending*), or search by guest name, phone, and email.
- **Instant Guest Issuance**: Add guests with attendee count (+1 companions admitted).
- **Secure Token Generation**: Generates unique tokens (`INV-<uuid>`) per guest without embedding raw personal information inside the QR payload.
- **Guest Detail Pass (`/admin/guest/[id]`)**: Full ticket view with high-res QR code, manual check-in override, share pass functionality, and audit history.

### 4. 🎫 Guest Invitation Pass (`/guest/invitation`)
- **Digital Pass**: High-res QR code, event schedule, venue address, and guest count badge.
- **Share / Save Ticket**: Instant native sharing to WhatsApp, Messages, or Email.

### 5. 📷 Gate Scanner & Verification Engine (`/scanner`)
- **Real-Time Camera Scanner**: Powered by `expo-camera` with animated scanning reticle, torch toggle (flashlight), and front/back camera switching.
- **Three Core Gate Outcomes (Step 13 Specification)**:
  - **✓ VALID INVITATION**: Green accent, checkmark badge, guest name, attendee count admitted, and instant check-in timestamp.
  - **⚠ ALREADY USED**: Amber accent, warning badge, guest name, and timestamp of the first scan to prevent duplicate entries.
  - **✕ INVALID INVITATION**: Crimson accent, cross icon, Access Denied alert.
- **Interactive Simulator Bar**: Built-in test buttons (*Valid [✓]*, *Used [⚠]*, *Invalid [✕]*) so you can test gate flows immediately on simulators, web browsers, or phones without printing physical QR codes.

---

## 📁 Project Architecture

```
party-invitations/
├── app/
│   ├── _layout.tsx              # Root SafeAreaProvider, StoreProvider & Stack navigation
│   ├── index.tsx                # Welcome Hub & persona switcher
│   ├── auth/
│   │   ├── login.tsx            # Login screen with quick one-tap role demos
│   │   └── register.tsx         # Account registration (Organizer vs Staff)
│   ├── admin/
│   │   ├── _layout.tsx          # Admin stack layout
│   │   ├── index.tsx            # Admin dashboard with live stats & shortcuts
│   │   ├── events.tsx           # Event management & listing
│   │   ├── create-event.tsx     # New event creation form
│   │   ├── guests.tsx           # Guest list, filter (Checked-in / Pending), search
│   │   └── guest/
│   │       └── [id].tsx         # Guest detail with QR code, check-in status, share
│   ├── guest/
│   │   ├── _layout.tsx          # Guest stack layout
│   │   ├── index.tsx            # My Invitations list
│   │   └── invitation.tsx       # Luxury digital invitation pass with QR code
│   └── scanner/
│       ├── _layout.tsx          # Scanner stack layout
│       ├── index.tsx            # Live QR camera scanner with target overlay & torch
│       └── result.tsx           # Verification result page (VALID, ALREADY USED, INVALID)
├── components/
│   ├── Button.tsx               # Primary, outline, ghost, danger & gold buttons
│   ├── Header.tsx               # Reusable screen header with back action
│   ├── EventCard.tsx            # Event overview card with status badge & attendee stats
│   ├── GuestCard.tsx            # Guest card with check-in indicator & attendee count
│   ├── QRCode.tsx               # High-res SVG QR code generator (react-native-qrcode-svg)
│   ├── StatusBadge.tsx          # Status indicators (Active, Checked In, Used, Expired)
│   └── ScanResultCard.tsx       # Step 13 3-state verification modal
├── lib/
│   ├── mockData.ts              # Pre-seeded events, guests, and invitation tokens
│   ├── store.tsx                # React Context state store with verification engine
│   ├── invitations.ts           # Token generation (INV:UUID payload) & parsing utilities
│   └── supabase.ts              # Supabase client skeleton ready for Stage 2
├── types/
│   ├── database.ts              # Supabase DB schema definitions
│   └── invitation.ts            # Guest, Event, Invitation, and Check-in types
├── constants/
│   └── colors.ts                # Theme tokens (Obsidian, Amber Gold, Emerald, Crimson)
├── app.json                     # Expo configuration with camera permissions
└── package.json
```

---

## 🚀 Getting Started

### 1. Navigate to the project directory:
```bash
cd C:\Users\moham\.gemini\antigravity\scratch\party-invitations
```

### 2. Start the development server:
```bash
npx expo start
```
- Open in **Expo Go** on your iPhone or Android phone by scanning the terminal QR code.
- Or press `w` in the terminal to launch the **Web Preview** in your browser!

---

## 🧪 Pre-Configured Test Scenarios

The in-memory reactive store is pre-seeded with real-world scenarios:

| Persona | Name | Token | Initial Status | Behavior when scanned |
| :--- | :--- | :--- | :--- | :--- |
| **Guest** | Mohamed Ahmed | `8f3a7e92-9c42-4f2b-91d8` | Active (3 Guests) | Marks as **VALID [✓]**, records check-in timestamp. Second scan becomes **ALREADY USED [⚠]**. |
| **Guest** | Sara Al-Harbi | `7b2c9d11-3e45-42a1-89d0` | Used (2 Guests) | Shows **ALREADY USED [⚠]** with original scan time (`7:42 PM`). |
| **Guest** | Fahad Al-Otaibi | `5c1a8e34-1f22-48b9-b871` | Active (1 Guest) | Marks as **VALID [✓]**. |
| **Unknown** | Unregistered | `INV-FAKE-0000` | Nonexistent | Shows **INVALID INVITATION [✕]** (Access Denied). |

---

## 🔮 Next Step: Stage 2 — Supabase Backend
`lib/supabase.ts` and `types/database.ts` are pre-wired. In Stage 2, we will connect your Supabase project to persist profiles, events, guests, invitations, and check-in audit logs to PostgreSQL with Row Level Security (RLS).
