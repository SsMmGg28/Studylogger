# StudyLogger — Mimari Referans Dosyası

> **Bu dosya, herhangi bir AI asistanın projeyi hızlıca anlaması için oluşturulmuştur.**
> Bir değişiklik yapmadan önce bu dosyayı okuyun ve hangi dosyaların etkileneceğini belirleyin.

---

## 1. Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Dil | TypeScript (strict mode) |
| Stil | Tailwind CSS 4 + oklch renk sistemi |
| UI Kütüphanesi | shadcn/ui (Nova preset) — `src/components/ui/` |
| Veritabanı | Firebase Firestore (client-side only) |
| Auth | Firebase Auth (Email/Password) |
| Grafik | Recharts 3 |
| Tarih | date-fns (tr locale) |
| Bildirim | Sonner (toast) |
| Tema | Sadece dark mode (`<html className="dark">`) |
| Deploy | Vercel |

---

## 2. Dizin Yapısı Özeti

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── layout.tsx          # Root layout (font, meta, Sonner)
│   ├── page.tsx            # Dashboard (ana sayfa)
│   ├── globals.css         # Tailwind + tema CSS değişkenleri
│   ├── auth/
│   │   ├── login/page.tsx  # Giriş sayfası
│   │   └── register/page.tsx # Kayıt sayfası
│   ├── log/page.tsx        # Yeni çalışma kaydı ekleme
│   ├── history/page.tsx    # Geçmiş kayıtlar + filtre + düzenle/sil
│   ├── friends/page.tsx    # Arkadaşlık yönetimi + karşılaştırma
│   └── settings/page.tsx   # Profil + gizlilik ayarları
├── components/             # Özel bileşenler
│   ├── AuthGuard.tsx       # Korumalı rota wrapper
│   ├── Navbar.tsx          # Üst navigasyon barı
│   ├── StudyLogForm.tsx    # Kayıt ekleme/düzenleme formu
│   ├── LogCard.tsx         # Tek kayıt kartı
│   ├── SubjectChart.tsx    # Pasta grafik (Recharts)
│   ├── WeeklyBarChart.tsx  # Haftalık çubuk grafik (Recharts)
│   ├── WeeklyCalendar.tsx  # GitHub-tarzı ısı haritası
│   ├── Leaderboard.tsx     # Arkadaş sıralama tablosu
│   ├── ExamCountdown.tsx   # YKS geri sayım
│   ├── StreakBadge.tsx     # Seri rozeti
│   └── ui/                 # shadcn/ui primitifleri (dokunma, sadece kullan)
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Auth state + profil
│   ├── useStudyLogs.ts     # CRUD çalışma kayıtları
│   └── useFriends.ts       # Arkadaşlık işlemleri
└── lib/                    # İş mantığı + yardımcılar
    ├── firebase.ts         # Firebase init (client-side guard)
    ├── auth.ts             # register/login/logout/loginDemo
    ├── db.ts               # Firestore CRUD + tipler + aggregation
    ├── subjects.ts         # Ders listesi, renkler, konular
    ├── demo-data.ts        # Demo modu sahte verileri
    └── utils.ts            # cn() — Tailwind class merge
```

---

## 3. Dosya Bağımlılık Grafiği

### 3.1 Çekirdek Katman (lib/)

```
firebase.ts ←── auth.ts        (auth, db instance)
            ←── db.ts          (db instance)

subjects.ts ←── StudyLogForm.tsx
            ←── LogCard.tsx
            ←── SubjectChart.tsx
            ←── WeeklyBarChart.tsx
            ←── Leaderboard.tsx
            ←── history/page.tsx
            ←── friends/page.tsx

demo-data.ts ←── useAuth.ts
             ←── useStudyLogs.ts
             ←── useFriends.ts

db.ts ←── useStudyLogs.ts     (getUserStudyLogs, addStudyLog, updateStudyLog, deleteStudyLog)
      ←── useFriends.ts       (getFriendships, getUserProfile, getFriendStudyLogs, sendFriendRequest, acceptFriendRequest, removeFriend, aggregateBySubject)
      ←── useAuth.ts          (getUserProfile)
      ←── settings/page.tsx   (updateUserProfile, getUserProfile)
      ←── friends/page.tsx    (getUserByUsername, sendFriendRequest)

auth.ts ←── login/page.tsx    (login, loginDemo)
        ←── register/page.tsx (register)
        ←── Navbar.tsx        (logout)

utils.ts ←── Tüm UI bileşenleri (cn fonksiyonu)
```

### 3.2 Hook Katmanı

```
useAuth.ts ──→ firebase.ts (onAuthStateChanged)
           ──→ db.ts (getUserProfile)
           ──→ demo-data.ts (DEMO_PROFILE, DEMO_UID)

useStudyLogs.ts ──→ db.ts (getUserStudyLogs, addStudyLog, updateStudyLog, deleteStudyLog)
                ──→ demo-data.ts (DEMO_LOGS)

useFriends.ts ──→ db.ts (getFriendships, getUserProfile, getFriendStudyLogs, sendFriendRequest, acceptFriendRequest, removeFriend, aggregateBySubject)
              ──→ demo-data.ts (DEMO_FRIENDS)
```

### 3.3 Bileşen → Hook/Lib Bağımlılıkları

| Bileşen | useAuth | useStudyLogs | useFriends | db.ts | subjects.ts |
|---|:---:|:---:|:---:|:---:|:---:|
| `AuthGuard` | ✅ | | | | |
| `Navbar` | ✅ | | | | |
| `StudyLogForm` | | | | | ✅ |
| `LogCard` | | | | | ✅ |
| `SubjectChart` | | | | | ✅ |
| `WeeklyBarChart` | | | | | ✅ |
| `WeeklyCalendar` | | | | | |
| `Leaderboard` | | | | | ✅ |
| `ExamCountdown` | | | | | |
| `StreakBadge` | | | | | |

### 3.4 Sayfa → Bileşen + Hook Bağımlılıkları

| Sayfa | Hooks | Bileşenler | lib/ |
|---|---|---|---|
| `page.tsx` (Dashboard) | useAuth, useStudyLogs | AuthGuard, Navbar, LogCard, SubjectChart, WeeklyCalendar, WeeklyBarChart, ExamCountdown, StreakBadge | subjects (aggregateBySubject in db) |
| `log/page.tsx` | useAuth, useStudyLogs | AuthGuard, Navbar, StudyLogForm | |
| `history/page.tsx` | useAuth, useStudyLogs | AuthGuard, Navbar, LogCard, StudyLogForm (dialog) | subjects |
| `friends/page.tsx` | useAuth, useStudyLogs, useFriends | AuthGuard, Navbar, Leaderboard, SubjectChart | subjects, db |
| `settings/page.tsx` | useAuth | AuthGuard, Navbar | db |
| `auth/login/page.tsx` | — | — | auth |
| `auth/register/page.tsx` | — | — | auth |

---

## 4. Veri Modelleri (Firestore)

### 4.1 Koleksiyonlar

```
users/{uid}
├── displayName: string
├── username: string
├── email: string
└── privacySettings
    ├── showHours: boolean
    ├── showQuestions: boolean
    └── showSubjectBreakdown: boolean

usernames/{username}
└── uid: string

studyLogs/{logId}
├── uid: string
├── subject: string          (subjects.ts'deki id ile eşleşir)
├── topic: string
├── durationMinutes: number
├── questionCount: number
├── notes?: string
├── date: string             (ISO format: "2026-04-10")
└── createdAt: Timestamp

friendships/{docId}          (docId = sorted `${userA}_${userB}`)
├── userA: string
├── userB: string
├── initiator: string
└── status: 'pending' | 'accepted'
```

### 4.2 Tip Tanımları Nerede?

Tüm Firestore tipleri **`src/lib/db.ts`** dosyasında tanımlanır:
- `StudyLog`
- `UserProfile`
- `Friendship`
- `SubjectAggregate` (aggregateBySubject dönüş tipi)

---

## 5. State Yönetimi Akışı

```
Firebase Auth (onAuthStateChanged)
    │
    ▼
useAuth.ts → { user, profile, loading }
    │
    ├──▶ AuthGuard.tsx (user yoksa → /auth/login)
    │
    ├──▶ useStudyLogs.ts (user.uid ile logları çeker)
    │       └──▶ { logs, add, update, remove, refresh }
    │
    └──▶ useFriends.ts (user.uid ile arkadaşlıkları çeker)
            └──▶ { friends, pending, sendRequest, accept, remove }
```

**Demo Modu:** `localStorage.getItem("demo-mode")` ile kontrol edilir.
- `useAuth` → demo profile döner
- `useStudyLogs` → demo-data.ts'den log döner, in-memory mutasyon
- `useFriends` → demo-data.ts'den arkadaş döner

---

## 6. Ders Yapısı (subjects.ts)

| ID | Label | Tip | Renk |
|---|---|---|---|
| `matematik` | Matematik | sayisal | `#8b5cf6` (mor) |
| `fizik` | Fizik | sayisal | `#3b82f6` (mavi) |
| `kimya` | Kimya | sayisal | `#10b981` (yeşil) |
| `biyoloji` | Biyoloji | sayisal | `#f59e0b` (sarı) |
| `turkce` | Türkçe | tyt | `#ef4444` (kırmızı) |
| `tyt-matematik` | TYT Matematik | tyt | `#a855f7` (açık mor) |
| `tarih` | Tarih | tyt | `#f97316` (turuncu) |
| `cografya` | Coğrafya | tyt | `#14b8a6` (teal) |
| `felsefe` | Felsefe | tyt | `#ec4899` (pembe) |
| `din` | Din Kültürü | tyt | `#6366f1` (lacivert) |
| `ingilizce` | İngilizce | tyt | `#06b6d4` (cyan) |

Her ders `topics: string[]` dizisi ile birlikte gelir (10–20 konu).

---

## 7. Yaygın Değişiklik Senaryoları

### 🔧 "Yeni bir ders eklemek istiyorum"
1. `src/lib/subjects.ts` → `SUBJECTS` dizisine yeni nesne ekle
2. **Başka dosya değişikliği gerekmez** (tüm bileşenler SUBJECTS'dan okur)

### 🔧 "Yeni bir alan eklemek istiyorum (StudyLog'a)"
1. `src/lib/db.ts` → `StudyLog` tipine alan ekle + `addStudyLog`/`updateStudyLog` fonksiyonlarını güncelle
2. `src/components/StudyLogForm.tsx` → Form alanı ekle
3. `src/components/LogCard.tsx` → Gösterim ekle
4. `src/hooks/useStudyLogs.ts` → (genelde değişiklik gerekmez, db.ts'e dayanır)
5. `src/app/history/page.tsx` → Filtre/gösterim gerekiyorsa güncelle

### 🔧 "Yeni bir sayfa eklemek istiyorum"
1. `src/app/yeni-sayfa/page.tsx` → Sayfa bileşeni oluştur
2. `src/components/Navbar.tsx` → Navigasyon linki ekle
3. Gerekli hook'ları import et: `useAuth`, `useStudyLogs`, `useFriends`
4. `AuthGuard` ile sar (korumalı sayfaysa)

### 🔧 "Yeni bir bileşen eklemek istiyorum"
1. `src/components/YeniBilesen.tsx` → Bileşen oluştur
2. İlgili sayfaya import et
3. Veri gerekliyse → ilgili hook'u kullan veya props al

### 🔧 "Profil alanı eklemek istiyorum"
1. `src/lib/db.ts` → `UserProfile` tipini güncelle
2. `src/lib/auth.ts` → `register` fonksiyonundaki user doc'u güncelle (varsayılan değer)
3. `src/app/settings/page.tsx` → Settings formuna alan ekle
4. Gösterilecekse → `Navbar.tsx` veya ilgili bileşeni güncelle

### 🔧 "Gizlilik ayarı eklemek istiyorum"
1. `src/lib/db.ts` → `UserProfile.privacySettings` tipine ekle
2. `src/lib/auth.ts` → register'da varsayılan değer ekle
3. `src/app/settings/page.tsx` → Toggle ekle
4. `src/hooks/useFriends.ts` → Arkadaş verisi çekerken kontrol ekle
5. İlgili bileşenler → Gizlilik kontrolü uygula

### 🔧 "Auth yöntemini değiştirmek/eklemek istiyorum"
1. `src/lib/firebase.ts` → Firebase config (provider ekle)
2. `src/lib/auth.ts` → Yeni auth fonksiyonu ekle
3. `src/app/auth/login/page.tsx` → UI güncelle
4. `src/app/auth/register/page.tsx` → UI güncelle

### 🔧 "Grafik/istatistik eklemek istiyorum"
1. Yeni bileşen oluştur: `src/components/YeniGrafik.tsx`
2. Veri kaynağı: `useStudyLogs` → logs veya `useFriends` → friends
3. Aggregation gerekiyorsa → `src/lib/db.ts` → `aggregateBySubject` benzeri fonksiyon ekle
4. İlgili sayfaya import et (genelde `page.tsx` Dashboard)

### 🔧 "Firestore kurallarını güncellemek istiyorum"
1. `firestore.rules` → Kuralları güncelle
2. Firebase Console'a deploy et

### 🔧 "Demo moduna veri eklemek istiyorum"
1. `src/lib/demo-data.ts` → DEMO_LOGS veya DEMO_FRIENDS güncelle

### 🔧 "Tema/stil değiştirmek istiyorum"
1. `src/app/globals.css` → CSS değişkenlerini güncelle
2. Bileşen bazında → ilgili dosyada Tailwind class'larını güncelle
3. Not: Dark mode zorunlu, `<html className="dark">` layout.tsx'de set edilir

---

## 8. shadcn/ui Bileşen Kullanım Haritası

| shadcn Bileşeni | Kullanan Dosyalar |
|---|---|
| `Button` | Tüm sayfalar, StudyLogForm, Navbar, LogCard |
| `Card` | page.tsx, history, friends, settings, LogCard, Leaderboard, ExamCountdown, StreakBadge |
| `Input` | login, register, settings, friends, StudyLogForm |
| `Select` | StudyLogForm, history, SubjectChart, Leaderboard |
| `Dialog` | history (edit modal) |
| `Tabs` | page.tsx (Dashboard), friends |
| `Badge` | LogCard, Leaderboard |
| `Label` | StudyLogForm, settings |
| `Textarea` | StudyLogForm |
| `Switch` | settings (gizlilik toggle'ları) |
| `Avatar` | Navbar, Leaderboard |
| `DropdownMenu` | Navbar (profil menüsü) |
| `Sonner` | layout.tsx (root) |

---

## 9. Önemli Kurallar

- **Firebase client-side only:** `typeof window !== 'undefined'` guard her zaman olmalı
- **Username immutable:** Bir kez oluşturulur, değiştirilemez
- **Username lowercase:** Kayıtta otomatik küçük harfe çevrilir
- **Dark mode only:** Kullanıcı değiştiremez, `<html className="dark">` sabit
- **Path alias:** `@/` → `src/` (`tsconfig.json`'da tanımlı)
- **Demo mode:** `localStorage` ile kontrol edilir, Firestore'a yazılmaz
- **Composite index:** `studyLogs` koleksiyonu için `(uid, date, createdAt)` index gerekebilir
- **Sonner toast:** `toast.success()` / `toast.error()` layout'ta `<Toaster />` ile aktif
- **shadcn/ui dosyalarını düzenleme:** `src/components/ui/` altındaki dosyalar standart shadcn çıktısıdır, mümkünse dokunma

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
