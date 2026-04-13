# StudyLogger — Mimari Referans Dosyası

> **Bu dosya, herhangi bir AI asistanın projeyi hızlıca anlaması için oluşturulmuştur.**
> Bir değişiklik yapmadan önce bu dosyayı okuyun ve hangi dosyaların etkileneceğini belirleyin.
> Son güncelleme: 2026-04-13

---

## 1. Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS 4 + oklch renk sistemi |
| UI Kütüphanesi | shadcn/ui (Nova preset) — `src/components/ui/` |
| Veritabanı | Firebase Firestore (client-side only) |
| Auth | Firebase Auth (Email/Password + Google OAuth) |
| Grafik | Recharts 3 (PieChart, BarChart, LineChart) |
| Tarih | date-fns (tr locale) |
| Bildirim | Sonner (toast) + Web Notifications API |
| PWA | Service Worker (stale-while-revalidate) + manifest.json |
| Offline | IndexedDB (offlineQueue.ts) |
| Export | jspdf + jspdf-autotable (PDF), CSV |
| Tema | Sadece dark mode (`<html className="dark">`) |
| Deploy | Vercel |

---

## 2. Dizin Yapısı Özeti

```
src/
├── app/                          # Next.js App Router sayfaları
│   ├── layout.tsx                # Root layout (font, meta, Sonner, SW register)
│   ├── page.tsx                  # Dashboard (ana sayfa)
│   ├── globals.css               # Tailwind 4 + oklch tema CSS değişkenleri
│   ├── auth/
│   │   ├── login/page.tsx        # Giriş sayfası (Email + Google + Demo)
│   │   ├── register/page.tsx     # Kayıt sayfası
│   │   └── setup-username/page.tsx # Google OAuth sonrası username tamamlama
│   ├── log/page.tsx              # Yeni çalışma/deneme kaydı ekleme (sekmeli)
│   ├── history/page.tsx          # Geçmiş kayıtlar + filtre + düzenle/sil + CSV/PDF export
│   ├── friends/page.tsx          # Arkadaşlık yönetimi + liderboard + karşılaştırma
│   ├── goals/page.tsx            # Hedef oluşturma/takip (haftalık/aylık)
│   ├── stats/page.tsx            # İstatistikler (konu breakdown, verimlilik trendi)
│   └── settings/page.tsx         # Profil + gizlilik + bildirim ayarları
├── components/                   # Özel bileşenler
│   ├── AuthGuard.tsx             # Korumalı rota wrapper (+ Google setup-username yönlendirme)
│   ├── Navbar.tsx                # Sticky üst nav (6 rota: Dashboard, Log, History, Goals, Stats, Friends)
│   ├── StudyLogForm.tsx          # Kayıt ekleme/düzenleme formu (TYT/AYT seçimi, etiket desteği)
│   ├── ExamLogForm.tsx           # Deneme sınavı formu (tam/branş, net girişi)
│   ├── LogCard.tsx               # Tek kayıt kartı (hover edit/delete, etiketler, genişleyen not)
│   ├── SubjectChart.tsx          # Donut pasta grafik (Recharts, dakika/soru metriği)
│   ├── WeeklyBarChart.tsx        # 7 günlük çubuk grafik
│   ├── WeeklyCalendar.tsx        # GitHub-tarzı ısı haritası (15 hafta)
│   ├── TopicBreakdownChart.tsx   # Konu bazlı yatay bar chart (ders seçimine göre)
│   ├── EfficiencyCard.tsx        # 12 haftalık verimlilik trend grafiği (soru/dk)
│   ├── Leaderboard.tsx           # Arkadaş sıralama (gizlilik-duyarlı)
│   ├── GoalCard.tsx              # Hedef ilerleme kartı (progress bar)
│   ├── RevisionSuggestions.tsx   # 3+ gün çalışılmayan konu önerileri (renkli aciliyet)
│   ├── ExamCountdown.tsx         # YKS TYT/AYT geri sayım (saniye hassasiyetinde)
│   ├── StreakBadge.tsx           # Seri rozeti (mevcut + en uzun)
│   └── ui/                       # shadcn/ui primitifleri (dokunma, sadece kullan)
│       ├── avatar.tsx, badge.tsx, button.tsx, card.tsx
│       ├── dialog.tsx, dropdown-menu.tsx, input.tsx, label.tsx
│       ├── select.tsx, sonner.tsx, switch.tsx, tabs.tsx, textarea.tsx
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Auth state + profil + demo modu
│   ├── useStudyLogs.ts           # CRUD çalışma kayıtları + offline sync
│   ├── useFriends.ts             # Arkadaşlık işlemleri + gizlilik kontrolü
│   └── useGoals.ts               # CRUD hedefler (haftalık/aylık)
└── lib/                          # İş mantığı + yardımcılar
    ├── firebase.ts               # Firebase init (client-side guard)
    ├── auth.ts                   # register/login/logout/loginDemo/loginWithGoogle/completeGoogleProfile
    ├── db.ts                     # Firestore CRUD + tipler + aggregation (StudyLog, ExamLog, Goal, Friendship)
    ├── subjects.ts               # 17 ders tanımı (TYT + AYT), renkler, 200+ konu
    ├── demo-data.ts              # Demo modu sahte verileri (24 log, 3 arkadaş)
    ├── utils.ts                  # cn() — clsx + tailwind-merge
    ├── export.ts                 # CSV (UTF-8 BOM) + PDF export (jspdf)
    ├── notifications.ts          # Web Notifications + FCM token + hatırlatıcılar
    └── offlineQueue.ts           # IndexedDB offline kuyruk + otomatik sync

public/
├── manifest.json                 # PWA manifest (standalone, indigo tema)
└── sw.js                         # Service Worker (network-first Firebase, SWR static)
```

---

## 3. Dosya Bağımlılık Grafiği

### 3.1 Çekirdek Katman (lib/)

```
firebase.ts ←── auth.ts            (auth, db instance)
            ←── db.ts              (db instance)
            ←── notifications.ts   (db instance, FCM)
            ←── offlineQueue.ts    (addStudyLog)

subjects.ts ←── StudyLogForm.tsx
            ←── ExamLogForm.tsx    (TYT_EXAM_SUBJECTS, AYT_EXAM_SUBJECTS sabitler burada)
            ←── LogCard.tsx
            ←── SubjectChart.tsx
            ←── WeeklyBarChart.tsx
            ←── TopicBreakdownChart.tsx
            ←── Leaderboard.tsx
            ←── RevisionSuggestions.tsx
            ←── GoalCard.tsx
            ←── history/page.tsx
            ←── friends/page.tsx
            ←── goals/page.tsx
            ←── stats/page.tsx

demo-data.ts ←── useAuth.ts
             ←── useStudyLogs.ts
             ←── useFriends.ts

db.ts ←── useStudyLogs.ts     (getUserStudyLogs, addStudyLog, updateStudyLog, deleteStudyLog)
      ←── useFriends.ts       (getFriendships, getUserProfile, getFriendStudyLogs, sendFriendRequest, acceptFriendRequest, removeFriend, aggregateBySubject)
      ←── useAuth.ts          (getUserProfile)
      ←── useGoals.ts         (getGoals, setGoal, deleteGoal)
      ←── settings/page.tsx   (updateUserProfile, getUserProfile)
      ←── friends/page.tsx    (getUserByUsername, sendFriendRequest)
      ←── log/page.tsx        (addExamLog)
      ←── goals/page.tsx      (getGoals, setGoal, deleteGoal — veya useGoals üzerinden)

auth.ts ←── login/page.tsx         (login, loginDemo, loginWithGoogle)
        ←── register/page.tsx      (register)
        ←── setup-username/page.tsx (completeGoogleProfile)
        ←── Navbar.tsx             (logout)

export.ts ←── history/page.tsx     (logsToCSV, logsToPDF)

notifications.ts ←── settings/page.tsx  (requestNotificationPermission)
                 ←── page.tsx (Dashboard) (checkStudyReminder, checkStreakWarning)

offlineQueue.ts ←── useStudyLogs.ts  (queueOfflineLog, syncOfflineLogs, getPendingCount)

utils.ts ←── Tüm UI bileşenleri (cn fonksiyonu)
```

### 3.2 Hook Katmanı

```
useAuth.ts ──→ firebase.ts (onAuthStateChanged)
           ──→ db.ts (getUserProfile)
           ──→ demo-data.ts (DEMO_PROFILE, DEMO_UID)

useStudyLogs.ts ──→ db.ts (getUserStudyLogs, addStudyLog, updateStudyLog, deleteStudyLog)
                ──→ demo-data.ts (DEMO_LOGS)
                ──→ offlineQueue.ts (queueOfflineLog, syncOfflineLogs)

useFriends.ts ──→ db.ts (getFriendships, getUserProfile, getFriendStudyLogs, sendFriendRequest, acceptFriendRequest, removeFriend, aggregateBySubject)
              ──→ demo-data.ts (DEMO_FRIENDS)

useGoals.ts ──→ db.ts (getGoals, setGoal, deleteGoal)
```

### 3.3 Bileşen → Hook/Lib Bağımlılıkları

| Bileşen | useAuth | useStudyLogs | useFriends | useGoals | db.ts | subjects.ts |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `AuthGuard` | ✅ | | | | | |
| `Navbar` | ✅ | | | | | |
| `StudyLogForm` | | | | | | ✅ |
| `ExamLogForm` | | | | | | ✅ (dahili sabitler) |
| `LogCard` | | | | | | ✅ |
| `SubjectChart` | | | | | | ✅ |
| `WeeklyBarChart` | | | | | | ✅ |
| `TopicBreakdownChart` | | | | | | ✅ |
| `EfficiencyCard` | | | | | | |
| `WeeklyCalendar` | | | | | | |
| `Leaderboard` | | | | | | ✅ |
| `GoalCard` | | | | | | ✅ |
| `RevisionSuggestions` | | | | | | ✅ |
| `ExamCountdown` | | | | | | |
| `StreakBadge` | | | | | | |

### 3.4 Sayfa → Bileşen + Hook Bağımlılıkları

| Sayfa | Hooks | Bileşenler | lib/ |
|---|---|---|---|
| `page.tsx` (Dashboard) | useAuth, useStudyLogs, useGoals | AuthGuard, Navbar, LogCard, SubjectChart, WeeklyCalendar, WeeklyBarChart, ExamCountdown, StreakBadge, GoalCard, RevisionSuggestions | subjects, notifications |
| `log/page.tsx` | useAuth, useStudyLogs | AuthGuard, Navbar, StudyLogForm, ExamLogForm | db (addExamLog) |
| `history/page.tsx` | useAuth, useStudyLogs | AuthGuard, Navbar, LogCard, StudyLogForm (dialog) | subjects, export |
| `friends/page.tsx` | useAuth, useStudyLogs, useFriends | AuthGuard, Navbar, Leaderboard, SubjectChart | subjects, db |
| `goals/page.tsx` | useAuth, useStudyLogs, useGoals | AuthGuard, Navbar, GoalCard | subjects, db |
| `stats/page.tsx` | useAuth, useStudyLogs | AuthGuard, Navbar, TopicBreakdownChart, EfficiencyCard | subjects |
| `settings/page.tsx` | useAuth | AuthGuard, Navbar | db, notifications |
| `auth/login/page.tsx` | — | — | auth (login, loginDemo, loginWithGoogle) |
| `auth/register/page.tsx` | — | — | auth (register) |
| `auth/setup-username/page.tsx` | useAuth | — | auth (completeGoogleProfile) |

---

## 4. Veri Modelleri (Firestore)

### 4.1 Koleksiyonlar

```
users/{uid}
├── displayName: string
├── username: string
├── email: string
├── photoURL?: string          (Google OAuth'dan)
└── privacySettings
    ├── showHours: boolean
    ├── showQuestions: boolean
    └── showSubjectBreakdown: boolean

users/{uid}/goals/{goalId}     ← Subcollection
├── subject: string
├── metric: 'minutes' | 'questions'
├── period: 'weekly' | 'monthly'
└── target: number

users/{uid}/tokens/{tokenId}   ← Subcollection (FCM bildirim)
└── token: string

usernames/{username}
└── uid: string

studyLogs/{logId}
├── uid: string
├── subject: string            (subjects.ts'deki id ile eşleşir)
├── topic: string
├── durationMinutes: number
├── questionCount: number
├── notes?: string
├── tags?: string[]            (max 10, max 20 karakter/etiket)
├── date: string               (ISO format: "2026-04-10")
└── createdAt: Timestamp

examLogs/{logId}               ← YENİ: Deneme sınavı kayıtları
├── uid: string
├── examType: 'tyt' | 'ayt'
├── examCategory: 'tam' | 'brans'
├── date: string               (ISO format)
├── subjectNets?: Record<string, number>  (tam deneme: ders→net)
├── totalNet?: number          (tam deneme toplam net)
├── subject?: string           (branş denemesi)
├── net?: number               (branş denemesi net)
├── durationMinutes?: number
├── notes?: string
└── createdAt: Timestamp

friendships/{docId}            (docId = sorted `${userA}_${userB}`)
├── userA: string
├── userB: string
├── initiator: string
└── status: 'pending' | 'accepted'
```

### 4.2 Tip Tanımları Nerede?

Tüm Firestore tipleri **`src/lib/db.ts`** dosyasında tanımlanır:
- `StudyLog` — Çalışma kayıtları
- `ExamLog` — Deneme sınavı kayıtları (tam/branş)
- `StudyGoal` — Hedefler (haftalık/aylık, dakika/soru)
- `UserProfile` — Kullanıcı profili + gizlilik ayarları
- `Friendship` — Arkadaşlık ilişkileri

**db.ts Fonksiyon Listesi:**
| Grup | Fonksiyonlar |
|---|---|
| Study Logs | `addStudyLog`, `updateStudyLog`, `deleteStudyLog`, `getUserStudyLogs`, `getFriendStudyLogs` |
| Exam Logs | `addExamLog`, `deleteExamLog`, `getUserExamLogs` |
| Profiles | `getUserProfile`, `updateUserProfile`, `getUserByUsername` |
| Friendships | `sendFriendRequest`, `acceptFriendRequest`, `removeFriend`, `getFriendships` |
| Goals | `getGoals`, `setGoal`, `deleteGoal` |
| Aggregation | `aggregateBySubject`, `aggregateByTopic`, `getLastStudiedByTopic` |

---

## 5. State Yönetimi Akışı

```
Firebase Auth (onAuthStateChanged)
    │
    ▼
useAuth.ts → { user, profile, loading }
    │
    ├──▶ AuthGuard.tsx
    │     ├── user yoksa → /auth/login
    │     └── Google user + username yoksa → /auth/setup-username
    │
    ├──▶ useStudyLogs.ts (user.uid ile logları çeker)
    │       └──▶ { logs, loading, add, update, remove, refresh }
    │              └── offline: queueOfflineLog → syncOfflineLogs
    │
    ├──▶ useFriends.ts (user.uid ile arkadaşlıkları çeker)
    │       └──▶ { friends, pending, loading, sendRequest, accept, remove, refresh }
    │
    └──▶ useGoals.ts (user.uid ile hedefleri çeker)
            └──▶ { goals, loading, add, remove, refresh }
```

**Demo Modu:** `localStorage.getItem("demo-mode")` ile kontrol edilir.
- `useAuth` → demo profile döner
- `useStudyLogs` → demo-data.ts'den log döner, in-memory mutasyon
- `useFriends` → demo-data.ts'den arkadaş döner

**Offline Modu:** `navigator.onLine === false` durumunda:
- `useStudyLogs.add()` → IndexedDB'ye yazar (`offlineQueue.ts`)
- Online olunca otomatik sync (`syncOfflineLogs`)

---

## 6. Ders Yapısı (subjects.ts)

### 6.1 TYT Dersleri (10 ders)

| ID | Label | Renk |
|---|---|---|
| `turkce` | Türkçe | `#f59e0b` |
| `tyt_matematik` | Matematik | `#8b5cf6` |
| `tyt_geometri` | Geometri | `#6366f1` |
| `tyt_fizik` | Fizik | `#06b6d4` |
| `tyt_kimya` | Kimya | `#10b981` |
| `tyt_biyoloji` | Biyoloji | `#84cc16` |
| `tarih` | Tarih | `#ef4444` |
| `cografya` | Coğrafya | `#14b8a6` |
| `felsefe` | Felsefe | `#a78bfa` |
| `din` | Din Kültürü | `#fb7185` |

### 6.2 AYT Dersleri (Sayısal, 7 ders)

| ID | Label | Renk |
|---|---|---|
| `ayt_matematik` | Matematik | `#6366f1` |
| `ayt_geometri` | Geometri | `#8b5cf6` |
| `ayt_fizik` | Fizik | `#06b6d4` |
| `ayt_kimya` | Kimya | `#10b981` |
| `ayt_biyoloji` | Biyoloji | `#84cc16` |

Toplam: **15 ders**, **~200+ konu**. Her ders `topics: string[]` dizisi ile gelir.

**Export'lar:** `SUBJECTS` (dizi), `SUBJECT_MAP` (id→Subject), `SUBJECT_COLORS` (id→renk)

### 6.3 Deneme Sınavı Ders Grupları (ExamLogForm.tsx dahili)

| Sabit | İçerik |
|---|---|
| `TYT_EXAM_SUBJECTS` | turkce, tyt_matematik, tyt_geometri, tyt_fizik, tyt_kimya, tyt_biyoloji, tarih, cografya, felsefe, din |
| `AYT_EXAM_SUBJECTS` | ayt_matematik, ayt_geometri, ayt_fizik, ayt_kimya, ayt_biyoloji |

---

## 7. Yaygın Değişiklik Senaryoları

### 🔧 "Yeni bir ders eklemek istiyorum"
1. `src/lib/subjects.ts` → `SUBJECTS` dizisine yeni nesne ekle
2. **Başka dosya değişikliği gerekmez** (tüm bileşenler SUBJECTS'dan okur)
3. Deneme sınavında da gösterilecekse → `src/components/ExamLogForm.tsx` → `TYT_EXAM_SUBJECTS` veya `AYT_EXAM_SUBJECTS` dizisine ekle

### 🔧 "Yeni bir alan eklemek istiyorum (StudyLog'a)"
1. `src/lib/db.ts` → `StudyLog` tipine alan ekle + `addStudyLog`/`updateStudyLog` fonksiyonlarını güncelle
2. `src/components/StudyLogForm.tsx` → Form alanı ekle
3. `src/components/LogCard.tsx` → Gösterim ekle
4. `src/hooks/useStudyLogs.ts` → (genelde değişiklik gerekmez, db.ts'e dayanır)
5. `src/app/history/page.tsx` → Filtre/gösterim gerekiyorsa güncelle
6. `src/lib/offlineQueue.ts` → Offline kuyruk PendingLog tipini güncelle

### 🔧 "Yeni bir sayfa eklemek istiyorum"
1. `src/app/yeni-sayfa/page.tsx` → Sayfa bileşeni oluştur
2. `src/components/Navbar.tsx` → Navigasyon linki ekle (6 mevcut rota var)
3. Gerekli hook'ları import et: `useAuth`, `useStudyLogs`, `useFriends`, `useGoals`
4. `AuthGuard` ile sar (korumalı sayfaysa)

### 🔧 "Yeni bir bileşen eklemek istiyorum"
1. `src/components/YeniBilesen.tsx` → Bileşen oluştur
2. İlgili sayfaya import et
3. Veri gerekliyse → ilgili hook'u kullan veya props al

### 🔧 "Profil alanı eklemek istiyorum"
1. `src/lib/db.ts` → `UserProfile` tipini güncelle
2. `src/lib/auth.ts` → `register` ve `completeGoogleProfile` fonksiyonlarındaki user doc'u güncelle
3. `src/app/settings/page.tsx` → Settings formuna alan ekle
4. Gösterilecekse → `Navbar.tsx` veya ilgili bileşeni güncelle

### 🔧 "Gizlilik ayarı eklemek istiyorum"
1. `src/lib/db.ts` → `UserProfile.privacySettings` tipine ekle
2. `src/lib/auth.ts` → register + completeGoogleProfile'da varsayılan değer ekle
3. `src/app/settings/page.tsx` → Toggle ekle
4. `src/hooks/useFriends.ts` → Arkadaş verisi çekerken kontrol ekle
5. `src/components/Leaderboard.tsx` → Gizlilik kontrolü uygula

### 🔧 "Auth yöntemini değiştirmek/eklemek istiyorum"
1. `src/lib/firebase.ts` → Firebase config (provider ekle)
2. `src/lib/auth.ts` → Yeni auth fonksiyonu ekle
3. `src/app/auth/login/page.tsx` → UI güncelle
4. `src/app/auth/register/page.tsx` → UI güncelle
5. Google benzeri → `src/app/auth/setup-username/page.tsx` → Profil tamamlama

### 🔧 "Grafik/istatistik eklemek istiyorum"
1. Yeni bileşen oluştur: `src/components/YeniGrafik.tsx`
2. Veri kaynağı: `useStudyLogs` → logs veya `useFriends` → friends
3. Aggregation gerekiyorsa → `src/lib/db.ts` → `aggregateBySubject`/`aggregateByTopic` benzeri fonksiyon ekle
4. İlgili sayfaya import et (Dashboard: `page.tsx`, veya Stats: `stats/page.tsx`)

### 🔧 "Deneme sınavı alanı/özelliği eklemek istiyorum"
1. `src/lib/db.ts` → `ExamLog` tipini güncelle + `addExamLog` fonksiyonunu güncelle
2. `src/components/ExamLogForm.tsx` → Form alanı/UI güncelle
3. `src/app/log/page.tsx` → Gerekirse sekme yapısını güncelle

### 🔧 "Hedef sistemi genişletmek istiyorum"
1. `src/lib/db.ts` → `StudyGoal` tipini güncelle + `setGoal`/`getGoals` fonksiyonlarını güncelle
2. `src/hooks/useGoals.ts` → Hook'u güncelle
3. `src/components/GoalCard.tsx` → Gösterim güncelle
4. `src/app/goals/page.tsx` → Sayfa güncelle

### 🔧 "Bildirim eklemek/değiştirmek istiyorum"
1. `src/lib/notifications.ts` → Yeni notification fonksiyonu ekle
2. İlgili sayfada çağır (Dashboard → `page.tsx`, Settings → `settings/page.tsx`)

### 🔧 "Firestore kurallarını güncellemek istiyorum"
1. `firestore.rules` → Kuralları güncelle
2. Firebase Console'a deploy et

### 🔧 "Demo moduna veri eklemek istiyorum"
1. `src/lib/demo-data.ts` → DEMO_LOGS veya DEMO_FRIENDS güncelle

### 🔧 "Tema/stil değiştirmek istiyorum"
1. `src/app/globals.css` → CSS değişkenlerini güncelle (oklch renk sistemi)
2. Bileşen bazında → ilgili dosyada Tailwind class'larını güncelle
3. Not: Dark mode zorunlu, `<html className="dark">` layout.tsx'de set edilir

### 🔧 "Export özelliği eklemek/değiştirmek istiyorum"
1. `src/lib/export.ts` → Export fonksiyonunu güncelle veya yeni format ekle
2. `src/app/history/page.tsx` → Buton/UI güncelle

---

## 8. shadcn/ui Bileşen Kullanım Haritası

| shadcn Bileşeni | Kullanan Dosyalar |
|---|---|
| `Button` | Tüm sayfalar, StudyLogForm, ExamLogForm, Navbar, LogCard |
| `Card` | page.tsx, history, friends, settings, goals, stats, LogCard, Leaderboard, GoalCard, ExamCountdown, StreakBadge, EfficiencyCard |
| `Input` | login, register, setup-username, settings, friends, StudyLogForm, ExamLogForm |
| `Select` | StudyLogForm, ExamLogForm, history, SubjectChart, TopicBreakdownChart, Leaderboard, goals |
| `Dialog` | history (edit modal) |
| `Tabs` | page.tsx (Dashboard), friends, log (çalışma/deneme) |
| `Badge` | LogCard, Leaderboard, GoalCard |
| `Label` | StudyLogForm, ExamLogForm, settings, goals |
| `Textarea` | StudyLogForm, ExamLogForm |
| `Switch` | settings (gizlilik toggle'ları) |
| `Avatar` | Navbar, Leaderboard |
| `DropdownMenu` | Navbar (profil menüsü) |
| `Sonner` | layout.tsx (root) |

---

## 9. Önemli Kurallar

- **Firebase client-side only:** `typeof window !== 'undefined'` guard her zaman olmalı
- **Username immutable:** Bir kez oluşturulur, değiştirilemez
- **Username lowercase:** Kayıtta otomatik küçük harfe çevrilir
- **Username validation:** 3–20 karakter, alfanumerik + alt çizgi
- **Dark mode only:** Kullanıcı değiştiremez, `<html className="dark">` sabit
- **Path alias:** `@/` → `src/` (`tsconfig.json`'da tanımlı)
- **Demo mode:** `localStorage` ile kontrol edilir, Firestore'a yazılmaz
- **Composite index:** `studyLogs` koleksiyonu için `(uid, date, createdAt)` index gerekebilir
- **Sonner toast:** `toast.success()` / `toast.error()` layout'ta `<Toaster />` ile aktif
- **shadcn/ui dosyalarını düzenleme:** `src/components/ui/` altındaki dosyalar standart shadcn çıktısıdır, mümkünse dokunma
- **Offline desteği:** IndexedDB üzerinden çalışır, sadece studyLog ekleme offline destekli
- **PWA:** Service Worker `public/sw.js`, `public/manifest.json`, layout.tsx'de register edilir
- **Tags:** StudyLog'a max 10 etiket, her etiket max 20 karakter, Türkçe karakterler desteklenir
- **Google OAuth:** Yeni Google kullanıcıları `/auth/setup-username`'e yönlendirilir (AuthGuard kontrol eder)
- **ExamLog:** İki mod: "tam" (tüm dersler, net puanlar), "brans" (tek ders, net + süre)
- **Goals subcollection:** `users/{uid}/goals` altında saklanır (ana koleksiyon değil)
- **Notifications:** Web Notifications API, 20+ saat inaktivite hatırlatması, seri kaybetme uyarısı
- **YKS tarihleri:** TYT = 20 Haziran 2026, AYT = 21 Haziran 2026 (ExamCountdown.tsx'de hardcoded)

---

## 10. Ortam Değişkenleri (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Tüm değişkenler `NEXT_PUBLIC_` prefix'i ile başlar (client-side erişim için).
`src/lib/firebase.ts`'de okunur.

---

## 11. Build & Dev Komutları

```bash
npm run dev      # Geliştirme sunucusu (Turbopack)
npm run build    # Production build
npm run start    # Production sunucu
npm run lint     # ESLint kontrol
```

---

## 12. Firestore Güvenlik Kuralları Özeti

| Koleksiyon | Okuma | Yazma |
|---|---|---|
| `users/{uid}` | Sadece sahibi | Sadece sahibi |
| `users/{uid}/goals` | Sadece sahibi | Sadece sahibi |
| `users/{uid}/tokens` | Sadece sahibi | Sadece sahibi |
| `usernames/{username}` | Herkes (public) | Sadece oluşturma (create), güncelleme yok |
| `studyLogs/{logId}` | Sahibi + arkadaşları | Sadece sahibi |
| `examLogs/{logId}` | Sahibi | Sadece sahibi |
| `friendships/{docId}` | Her iki taraf | Her iki taraf |
