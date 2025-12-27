# 🧠 GEMINI.md - Coding Guidelines & Vibe Rules

Bu dosya, bu projede (Cortex) kod yazarken Gemini'nin uyması GEREKEN anayasadır.

## 1. Temel Felsefe (The Vibe)
* **YAGNI (You Ain't Gonna Need It):** Benden istenmeyen hiçbir özelliği, fonksiyonu veya dosyayı ekleme. Gelecekte lazım olur diye kod yazma, sadece şu anki görevi çöz.
* **KISS (Keep It Simple, Stupid):** En basit çözüm, en iyi çözümdür. Karmaşık tasarım kalıpları (Design Patterns) yerine okunabilir, düz mantık (straightforward) kod yaz.
* **DRY (Don't Repeat Yourself):** Kod tekrarından kaçın ama bunu yaparken kodu aşırı soyutlama (over-abstraction).

## 2. Kodlama Standartları (Coding Standards)

### İsimlendirme (Naming Conventions)
* **Değişkenler ve Fonksiyonlar:** Kesinlikle `camelCase` kullanılacak.
    * ✅ `getUserData`, `isAgentActive`, `noteList`
    * ❌ `Get_User_Data`, `is_agent_active`, `NoteList`
* **Dosya İsimleri:** `kebab-case` (küçük harf ve tire).
    * ✅ `auth-service.ts`, `agent-flow.ts`
* **Sınıflar (Classes) ve Bileşenler (Components):** `PascalCase`.
    * ✅ `UserProfile`, `ChatWindow`
* **Sabitler (Constants):** `UPPER_SNAKE_CASE`.
    * ✅ `MAX_RETRY_COUNT`, `API_KEY`

### Teknoloji Kuralları (Tech Stack Specifics)
* **Framework:** Firebase Genkit & Firebase Functions.
* **Language:** TypeScript (Strict typing, `any` kullanmaktan kaçın ama type tanımlamak için işi yokuşa sürme).
* **Database:** Firestore (Vector Store).
* **Frontend (Eğer varsa):** React (Sürüm 19.2.1+ güvenlik kuralına uy).

## 3. Kod Üretim Kuralları (Generation Rules)
1.  **Açıklama Az, Kod Çok:** Uzun uzun konu anlatımı yapma. Sadece kodu ve neyi neden yaptığını açıklayan kısa bir yorum satırı ver.
2.  **Tam Kod Blokları:** "Geri kalanı önceki gibi..." diyerek kodu yarım bırakma. Kopyala-yapıştır yapılabilir, çalışan tam bloklar ver.
3.  **Hata Yönetimi (Error Handling):** Basit `try-catch` blokları kullan. Özel hata sınıfları (Custom Error Classes) oluşturma, `console.error` yeterli.

## 4. Güvenlik Hatırlatması
* Herhangi bir React/Next.js bağımlılığı eklerken **CVE-2025-55182** güvenlik açığını hatırla. Daima en son kararlı (stable) sürümü kullan.

---
**ÖZET:** Basit tut, `camelCase` yaz, çalıştır geç.