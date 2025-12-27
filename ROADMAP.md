# 🗺️ Proje Yol Haritası: Cortex Web App (Detaylı)

Bu döküman, Cortex projesinin teknik geliştirme adımlarını, PRD ve persona hedeflerini dikkate alarak detaylı bir şekilde planlar.

---

## Faz 1: Core Genkit Backend (CLI Test)

**Açıklama:** Projenin temel iş mantığının (agent ve araçlar) Genkit ile oluşturulup terminal üzerinden test edildiği aşamadır. Hedef, PRD'de belirtilen "Router Agent" mantığını iskelet olarak kurmaktır.

- [ ] **Orchestrator Flow Kurulumu:** `orchestratorFlow` isminde ana akışı oluştur.
- [ ] **Router Agent Mantığı:** Akış içerisinde, kullanıcı girdisini analiz edip `Direct Answer`, `RAG Flow` veya `Hybrid Flow` yollarından hangisini seçeceğine karar veren temel yönlendirme mantığını implemente et.
- [ ] **Araç Şemaları:**
    - [ ] `noteRetriever`: `zod` şeması ile input/output tiplerini tanımla (içi boş kalacak).
    - [ ] `webSearch`: `zod` şeması ile input/output tiplerini tanımla (içi boş kalacak).
- [ ] **Grounding (Doğrulama) Yapısı:** Flow'un çıktısını, sadece metin değil, ` { answer: string, sources: string[] } ` formatında bir obje olarak tanımla.
- [ ] **CLI Test Senaryoları:**
    - [ ] "Merhaba" gibi bir girdi için `Direct Answer` yolunu test et.
    - [ ] "Notlarımda ne var?" gibi bir girdi için `noteRetriever` aracının çağrıldığını (placeholder cevap ile) test et.
    - [ ] "X teknolojisi hakkında notlarım ne diyor ve en son sürümü ne?" gibi bir girdi için hem `noteRetriever` hem de `webSearch` araçlarının çağrıldığını test et.

---

## Faz 2: Knowledge Base (Hafıza)

**Açıklama:** Agent'ın "uzun süreli hafızası" için Firestore'un vektör arama yeteneklerinin kurulması ve Araştırmacı Aslı personasının ihtiyacına yönelik veri girişinin sağlanması.

- [ ] **Firebase Kurulumu:** Firebase projesinde Firestore'u (Native modda) etkinleştir.
- [ ] **Vektör Index Kurulumu:**
    - [ ] `text-embedding-004` modelini kullanarak vektör oluşturacak şekilde Firestore Vector Search için bir koleksiyon (`user_documents`) yapılandır.
    - [ ] PRD'de belirtilen "Hibrit Arama" için metadata alanlarına (örn: `keyword`, `source_file`) göre filtreleme sağlayacak indexler oluştur.
- [ ] **`noteRetriever` Entegrasyonu:** Aracın içini, kullanıcı sorgusunu vektörleştirip Firestore'da semantik ve keyword araması yapacak şekilde doldur.
- [ ] **Veri Giriş (Ingestion) Scripti:**
    - [ ] PDF ve metin dosyalarını okuyup parçalara ayıran (`chunking`) bir script (`/scripts/ingest.ts`) oluştur.
    - [ ] Bu parçaları `text-embedding-004` ile vektörlere dönüştürüp `source_file` gibi metadatalarla birlikte Firestore'a kaydeden fonksiyonu yaz.

---

## Faz 3: API & Web Entegrasyonu

**Açıklama:** Geliştirilen Genkit backend'inin bir web API'ı olarak sunulması ve Yazılımcı Can personasının beklentilerine uygun, kullanılabilir bir web arayüzünün oluşturulması.

- [ ] **API Endpoint Oluşturma:** `startFlowServer` kullanarak Genkit akışlarını güvenli bir web sunucusu üzerinden erişilebilir hale getir.
- [ ] **Frontend Proje Kurulumu:**
    - [ ] `/frontend` klasörü altında yeni bir Next.js projesi oluştur.
    - [ ] **Güvenlik Kontrolü:** `package.json` dosyasında `react` bağımlılığının `^19.2.1` veya üstü olduğunu teyit et (CVE-2025-55182 zafiyetini önlemek için).
- [ ] **UI Geliştirme:**
    - [ ] Temel bir chat arayüzü (mesaj giriş kutusu, mesaj listesi) oluştur.
    - [ ] Backend'den gelen `{ answer, sources }` objesini işleyerek cevabı ve kaynakları (`[Kaynak: dosya.pdf]`) ayrı ayrı gösterecek UI bileşenlerini geliştir.
- [ ] **API Entegrasyonu:** Frontend'den Genkit API endpoint'ine (`/orchestratorFlow`) kullanıcı girdisi ile POST isteği atıp gelen cevabı ekranda göster.

---

## Faz 4: Deployment (Canlıya Alma)

**Açıklama:** Projenin son kullanıcıya açılması için Firebase üzerinde canlı ortama kurulması ve performans hedeflerinin karşılanması.

- [ ] **Firebase App Hosting Kurulumu:** Firebase projesinde App Hosting'i etkinleştirerek backend (Genkit) ve frontend (Next.js) için tek bir dağıtım hedefi oluştur.
- [ ] **`firebase.json` Yapılandırması:** Hem backend fonksiyonlarının hem de frontend static dosyalarının doğru şekilde dağıtılması için `firebase.json` dosyasını yapılandır.
- [ ] **Performans Optimizasyonu:**
    - [ ] PRD'de belirtilen `< 1.5 sn` (basit) ve `< 5 sn` (karmaşık) sorgu süresi hedeflerini karşılamak için `region` seçimi ve `minInstances` gibi ayarları (gerekiyorsa) yapılandır.
    - [ ] App Hosting kullanarak "Cold Start" süresini minimize et.
- [ ] **İlk Dağıtım:** `firebase deploy` komutu ile projeyi canlıya al.
- [ ] **CI/CD Otomasyonu (Opsiyonel):**
    - [ ] `main` branch'ine yapılan her push sonrası `firebase deploy` komutunu otomatik çalıştıran bir GitHub Actions workflow'u oluştur.