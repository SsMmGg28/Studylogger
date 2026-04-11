export interface Subject {
  id: string;
  label: string;
  color: string;
  type: "sayisal" | "tyt";
  topics: string[];
}

export const SUBJECTS: Subject[] = [
  // Sayısal AYT
  {
    id: "matematik",
    label: "Matematik",
    color: "#6366f1",
    type: "sayisal",
    topics: [
      "Sayılar ve Cebir", "Fonksiyonlar", "Polinomlar", "Denklemler",
      "Eşitsizlikler", "Trigonometri", "Logaritma", "Diziler",
      "Limit ve Süreklilik", "Türev", "İntegral", "Olasılık",
      "Permütasyon-Kombinasyon", "Vektörler", "Analitik Geometri",
      "Konikler", "Kompleks Sayılar",
    ],
  },
  {
    id: "fizik",
    label: "Fizik",
    color: "#06b6d4",
    type: "sayisal",
    topics: [
      "Kuvvet ve Hareket", "Newton Yasaları", "İş-Güç-Enerji",
      "Momentum", "Tork ve Denge", "Elastikiyet", "Sıvı Statiği",
      "Basit Harmonik Hareket", "Dalgalar", "Ses", "Elektrik",
      "Manyetizma", "Optik", "Modern Fizik", "Termodinamik",
    ],
  },
  {
    id: "kimya",
    label: "Kimya",
    color: "#10b981",
    type: "sayisal",
    topics: [
      "Atomun Yapısı", "Periyodik Sistem", "Kimyasal Bağlar",
      "Mol Kavramı", "Kimyasal Reaksiyonlar", "Asit-Baz",
      "Çözeltiler", "Kimyasal Denge", "Çözünürlük Dengesi",
      "Elektrokimya", "Organik Kimya Temelleri", "Hidrokarbonlar",
      "Fonksiyonlu Organik Bileşikler", "Polimerleme",
    ],
  },
  {
    id: "biyoloji",
    label: "Biyoloji",
    color: "#84cc16",
    type: "sayisal",
    topics: [
      "Hücre", "Metabolizma", "Solunun", "Fotosentez",
      "Mitoz-Mayoz", "Kalıtım", "DNA ve Protein Sentezi",
      "Evrim", "Ekosistem", "Hayvan Fizyolojisi",
      "Bitki Fizyolojisi", "Biyoteknoloji",
    ],
  },
  // TYT
  {
    id: "turkce",
    label: "Türkçe",
    color: "#f59e0b",
    type: "tyt",
    topics: [
      "Sözcükte Anlam", "Cümlede Anlam", "Paragraf",
      "Ses Bilgisi", "Yapı Bilgisi", "Anlam Bilgisi",
      "Büyük Harf Kuralları", "Noktalama İşaretleri",
      "Yazım Kuralları", "Sözcük Türleri", "Cümle Bilgisi",
    ],
  },
  {
    id: "tyt_matematik",
    label: "TYT Matematik",
    color: "#8b5cf6",
    type: "tyt",
    topics: [
      "Temel Kavramlar", "Sayılar", "Bölme-Bölünebilme",
      "EBOB-EKOK", "Kesirler", "Ondalık Sayılar",
      "Rasyonel Sayılar", "Basit Eşitsizlikler",
      "Oran-Orantı", "Problemler", "Küme", "Fonksiyon",
    ],
  },
  {
    id: "tarih",
    label: "Tarih",
    color: "#ef4444",
    type: "tyt",
    topics: [
      "Tarih Öncesi", "İlk Uygarlıklar", "Orta Çağ Türk tarihi",
      "Osmanlı Kuruluş", "Osmanlı Yükselme", "Osmanlı Duraklama-Gerileme",
      "Kurtuluş Savaşı", "Atatürk İlke-İnkılapları", "Yakın Tarih",
    ],
  },
  {
    id: "cografya",
    label: "Coğrafya",
    color: "#14b8a6",
    type: "tyt",
    topics: [
      "Harita", "Atmosfer", "İklim", "Hidroloji",
      "Nüfus", "Ekonomik Coğrafya", "Türkiye Coğrafyası",
    ],
  },
  {
    id: "felsefe",
    label: "Felsefe",
    color: "#a78bfa",
    type: "tyt",
    topics: [
      "Felsefeye Giriş", "Bilgi Felsefesi", "Varlık Felsefesi",
      "Ahlak Felsefesi", "Siyaset Felsefesi", "Din Felsefesi",
    ],
  },
  {
    id: "din",
    label: "Din Kültürü",
    color: "#fb7185",
    type: "tyt",
    topics: [
      "İslam'ın İnanç Esasları", "Kuran'ın Temel Konuları",
      "Hz. Muhammed", "İslam'da Ahlak", "Din ve Laiklik", "Diğer Dinler",
    ],
  },
  {
    id: "ingilizce",
    label: "İngilizce",
    color: "#38bdf8",
    type: "tyt",
    topics: [
      "Vocabulary", "Grammar", "Reading Comprehension",
      "Sentence Completion", "Dialogue Completion",
    ],
  },
];

export const SUBJECT_MAP = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));
export const SUBJECT_COLORS = Object.fromEntries(SUBJECTS.map((s) => [s.id, s.color]));
