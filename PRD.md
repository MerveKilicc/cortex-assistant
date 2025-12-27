# 📘 Product Requirements Document (PRD): Cortex "Second Brain"

| Meta Veri | Detaylar |
| :--- | :--- |
| **Proje Adı** | Cortex - Agentic Personal Assistant |
| **Sürüm** | 2.0 (Comprehensive) |
| **Durum** | Geliştirme Aşamasında (In Development) |
| **Ürün Sahibi** | Merve Kılıç |
| **Teknoloji** | Google Genkit, Gemini 3 Flash, Firebase Vector Search |

---

## 1. Yönetici Özeti (Executive Summary)
Cortex, kullanıcıların dijital ortamda karşılaştığı "bilgi dağınıklığı" ve "unutkanlık" sorununu çözen; RAG (Retrieval-Augmented Generation) mimarisi üzerine kurulu otonom bir kişisel asistandır. Kullanıcının hem özel verilerine (Long-term Memory) hem de anlık web verisine (Real-time Knowledge) aynı anda erişip sentez yapabilen, "düşünen" bir sistemdir.

## 2. Kullanıcı Personaları (User Personas)
Tasarım ve fonksiyonlar aşağıdaki profillere göre şekillendirilmiştir:

### 👤 Persona A: Araştırmacı Aslı (24, Yüksek Lisans Öğrencisi)
* **Acı Noktası (Pain Point):** Tez yazarken yüzlerce PDF okuyor, hangisinde ne yazıyordu unutuyor. ChatGPT'ye sorunca kaynak veremiyor.
* **Beklentisi:** "Bana 'X makalesindeki' veriyi bul ve şu anki borsa verileriyle kıyasla" diyebilmek.

### 👤 Persona B: Yazılımcı Can (28, Senior Developer)
* **Acı Noktası:** Şirket içi toplantı notları ve teknik dökümanlar arasında kayboluyor.
* **Beklentisi:** Toplantı notlarını vektör veritabanından çekip, GitHub'daki son release note ile birleştirip özet isteyen bir asistan.

## 3. Kapsamlı Özellik Seti (Feature Specifications)

### 3.1. 🧠 Akıllı Hafıza (The Knowledge Base)
* **Vektörleştirme (Embedding):** Kullanıcı tarafından girilen her metin veya PDF, `text-embedding-004` modeli ile vektöre çevrilip Firestore'a kaydedilecek.
* **Hibrit Arama:** Kullanıcı sorgusu hem semantik (anlamsal) hem de keyword (anahtar kelime) bazlı aranacak.

### 3.2. 🕵️‍♂️ Otonom Ajan (The Router Agent)
* Sistem, kullanıcının sorusunu analiz ederek 3 yoldan birini seçecek:
    1.  **Direct Answer:** "Merhaba" gibi basit sohbetler (Maliyet tasarrufu).
    2.  **RAG Flow:** "Geçen haftaki notlarım neydi?" (Sadece veritabanı).
    3.  **Hybrid Flow:** "Notlarımdaki proje fikri, şu anki pazar trendlerine uyuyor mu?" (Veritabanı + Google Search).

### 3.3. 🛡️ Grounding (Doğrulama)
* Yapay zeka halüsinasyonunu engellemek için, verilen her cevabın altına `[Kaynak: Toplantı Notları.pdf]` veya `[Kaynak: google.com/...]` referansı eklenecek.

## 4. Teknik Gereksinimler (Technical Requirements)

### 4.1. Performans & Latency
* **Sorgu Süresi:** Basit sorgular < 1.5 sn, Araştırma gerektiren sorgular < 5 sn.
* **Cold Start:** Firebase App Hosting kullanılarak "Cold Start" süresi minimize edilecek.

### 4.2. Güvenlik & Gizlilik
* **CVE-2025-55182 Önlemi:** Frontend tarafında React kullanılacaksa sürüm **19.2.1+** olmak zorundadır. Bağımlılıklar `npm audit` ile haftalık taranacaktır.
* **Veri İzolasyonu:** Her kullanıcının verisi Firestore'da kendi `userID` koleksiyonunda tutulacak, çapraz erişim engellenecek.

## 5. Başarı Metrikleri (KPIs)
Bu projenin başarısı nasıl ölçülecek?
1.  **Retrieval Accuracy (Erişim Doğruluğu):** Kullanıcı "X belgesi" dediğinde doğru belgeyi getirme oranı (>%90 hedeflenir).
2.  **Response Relevance:** Cevabın kullanıcı sorusuyla alakasının 1-5 üzerinden değerlendirilmesi.
3.  **Latency:** Ortalama cevap verme süresi.

## 6. Yol Haritası (Roadmap) - Sprint Planı

| Faz | Odak | Teslimat (Deliverable) |
| :--- | :--- | :--- |
| **Faz 1** | Altyapı | Project IDX, Genkit Init, Firestore Setup |
| **Faz 2** | Hafıza | PDF/Text Ingestion, Vector Embeddings |
| **Faz 3** | Zeka | Tool Definitions (WebSearch, Retriever), Agent Logic |
| **Faz 4** | UI/UX | Chat Arayüzü, React Frontend (Secure Version) |