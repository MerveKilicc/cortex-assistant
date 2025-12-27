
import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { defineFlow, defineTool, generate, GenerationCommonConfig } from '@genkit-ai/flow';
import * as z from 'zod';

// 1. Google AI (Gemini) ve Genkit konfigürasyonunu yap.
configureGenkit({
  plugins: [
    googleAI({
      apiVersion: "v1beta",
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Model ve konfigürasyon tanımları
const geminiFlash = 'gemini-1.5-flash-latest';
const llmConfig: GenerationCommonConfig = {
    temperature: 0.3, // Karar verme için tutarlılık
};

// Roadmpa'e uygun olarak kaynak (Source) ve akış çıktısı (Flow Output) için şemalarımızı tanımlayalım.
const SourceSchema = z.object({
    source: z.string().describe("Bilginin kaynağı (dosya adı, URL, vb.)"),
    content: z.string().describe("Kaynaktan alınan ilgili metin parçası."),
});
const FlowOutputSchema = z.object({
    answer: z.string().describe("Yapay zekanın ürettiği son cevap."),
    sources: z.array(z.string()).describe("Cevap üretilirken kullanılan kaynakların listesi."),
});


// 2. Araçları, kaynak bilgisini de dönecek şekilde güncelleyelim.
const noteRetriever = defineTool(
  {
    name: 'noteRetriever',
    description: "Kullanıcının kişisel notları veya uzun süreli hafızası içinde anlamsal arama yapar.",
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(SourceSchema),
  },
  async (input) => {
    // TODO: Firestore araması implemente edilecek.
    console.log(`(noteRetriever) searching for: ${input.query}`);
    return [
        { source: 'placeholder-note.txt', content: 'Toplantı Notları ve Proje Fikirleri' }
    ];
  }
);

const webSearch = defineTool(
  {
    name: 'webSearch',
    description: "Güncel veya genel bilgiler için web üzerinde arama yapar.",
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.array(SourceSchema),
  },
  async (input) => {
    // TODO: Gerçek web arama API'si entegre edilecek.
    console.log(`(webSearch) searching for: ${input.query}`);
    return [
        { source: 'google.com/search?q=React+19', content: 'React 19'un yeni özellikleri: Compiler ve Actions.' }
    ];
  }
);


// 3. Ana "Orchestrator" akışını, yeni çıktı şemasına uygun hale getirelim.
export const orchestratorFlow = defineFlow(
  {
    name: 'orchestratorFlow',
    inputSchema: z.object({ userQuery: z.string() }),
    outputSchema: FlowOutputSchema,
  },
  async (input) => {

    const systemPrompt = `Sen Cortex adında gelişmiş bir kişisel asistansın. Görevin, kullanıcının sorusuna en doğru cevabı vermek için elindeki araçları koordine etmektir.
KURALLAR:
1. Asla varsayım yapma. Bilmiyorsan, ilgili aracı kullan.
2. Cevabını SADECE sana verilen araçların çıktılarındaki bilgilere dayandır.
3. Çıktıları sentezleyerek kullanıcıya akıcı bir cevap oluştur.`;

    const llmResponse = await generate({
      model: geminiFlash,
      prompt: `Kullanıcı Sorusu: "${input.userQuery}"`,
      system: systemPrompt,
      tools: [noteRetriever, webSearch],
      config: llmConfig,
    });

    // Araçlardan gelen kaynakları toplayalım.
    const sources = llmResponse.toolCallResponses.flatMap(
        (response) => response.output.map((source) => source.source)
    );
    // Tekrarlanan kaynakları temizleyelim.
    const uniqueSources = [...new Set(sources)];

    return {
        answer: llmResponse.text(),
        sources: uniqueSources,
    };
  }
);
