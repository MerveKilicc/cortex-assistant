# 🤖 Agent Architecture & Prompt Engineering

Bu döküman, Cortex içindeki yapay zeka ajanlarının (Agents) kişiliklerini, kullandıkları araçları (Tools) ve karar mekanizmalarını (Logic) tanımlar.

## 1. Ana Ajan: "Orchestrator" (Orkestra Şefi)
Bu ajan, kullanıcının ilk temas noktasıdır. Soruyu analiz eder ve hangi "Alt Aracı" (Tool) kullanacağına karar verir.

* **Model:** Gemini 3 Flash
* **Sıcaklık (Temperature):** 0.3 (Daha tutarlı ve mantıklı kararlar için düşük tutuldu).

### 1.1. System Prompt (Kişilik Tanımı)
> "Sen Cortex adında gelişmiş bir kişisel asistansın. Görevin, kullanıcının sorusuna en doğru cevabı vermek için elindeki araçları koordine etmektir.
>
> KURALLAR:
> 1. Kullanıcı kişisel bir şey soruyorsa (örn: 'notlarım', 'hatırla') MUTLAKA `noteRetriever` aracını kullan.
> 2. Kullanıcı güncel veya genel bir bilgi soruyorsa (örn: 'dolar kuru', 'React 19 özellikleri') MUTLAKA `webSearch` aracını kullan.
> 3. Eğer her ikisi de lazımsa, sırayla ikisini de kullan ve sentez yap.
> 4. Asla bilmediğin bir konuda tahmin yürütme (Halüsinasyon görme), araçları kullan."

## 2. Tanımlı Araçlar (Tools Definition)

### 🛠️ Tool A: `noteRetriever` (Hafıza)
* **Amaç:** Firestore üzerindeki vektör veritabanında semantik arama yapar.
* **Input Schema:** `query: string` (Aranacak konunun özeti).
* **Output:** Bulunan en alakalı 3 metin parçası ve kaynak adları.

### 🛠️ Tool B: `webSearch` (Araştırma)
* **Amaç:** Google Search API kullanarak internetten canlı bilgi çeker.
* **Input Schema:** `keyword: string` (Arama terimi).
* **Grounding:** Google Grounding servisi aktif edilecek.

## 3. Örnek Akış (Example Flow)

**Senaryo:** Kullanıcı soruyor -> "Geçen ayki bütçe planım ile şu anki enflasyon oranını kıyasla."

1.  **Orchestrator Analizi:**
    * "Geçen ayki bütçe planım" -> Kişisel Veri -> **Call `noteRetriever`**
    * "Şu anki enflasyon oranı" -> Güncel Veri -> **Call `webSearch`**
2.  **Tool Execution:**
    * `noteRetriever` -> Döndürür: "Bütçe limiti: 50.000 TL"
    * `webSearch` -> Döndürür: "TÜİK yıllık enflasyon %XX"
3.  **Final Synthesis (Sentez):**
    * Gemini: "Notlarınıza göre bütçeniz 50.000 TL. Ancak güncel enflasyon %XX olduğu için, alım gücünüz geçen aya göre Y kadar düşmüş olabilir."