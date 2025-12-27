import {
  env,
  AutoTokenizer,
  AutoProcessor,
  SiglipTextModel,
  SiglipVisionModel,
  RawImage,
} from "@huggingface/transformers";

env.allowLocalModels = false;
env.allowRemoteModels = true;

const MODEL_ID = "Xenova/siglip-base-patch16-224";

class SiglipService {
  static tokenizer: any = null;
  static processor: any = null;
  static textModel: any = null;
  static visionModel: any = null;

  static async init(progressCallback?: (data: any) => void) {
    if (!this.tokenizer) {
      // Используем q8 квантизацию для оптимизации производительности на CPU
      const options = { device: "wasm", dtype: "q8" } as const;

      this.tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, progressCallback);
      this.processor = await AutoProcessor.from_pretrained(MODEL_ID, progressCallback);
      this.textModel = await SiglipTextModel.from_pretrained(MODEL_ID, { ...options }, progressCallback);
      this.visionModel = await SiglipVisionModel.from_pretrained(MODEL_ID, { ...options }, progressCallback);
    }
  }
}

self.addEventListener("message", async (event) => {
  const { type, data } = event.data;

  try {
    if (type === "init") {
      await SiglipService.init((msg) => {
        self.postMessage({ type: "progress", data: msg });
      });

      const items = data;
      const embeddings: Record<number, number[]> = {};

      // Генерируем text embeddings для Description всех панелей
      const descriptions = items.map((item: any) => item.Description);

      const textInputs = await SiglipService.tokenizer(descriptions, {
        padding: "max_length",
        truncation: true,
      });

      const { pooler_output: textOutput } = await SiglipService.textModel(textInputs);

      // SigLIP base использует размерность эмбеддингов 768
      const embeddingSize = 768;

      for (let i = 0; i < items.length; i++) {
        const start = i * embeddingSize;
        const end = start + embeddingSize;
        const textVector = textOutput.data.slice(start, end);
        const itemId = items[i].ID;
        embeddings[itemId] = Array.from(textVector);
      }

      self.postMessage({ type: "textembeddingsready", data: embeddings });
    }

    if (type === "image") {
      // Создаём временный URL для изображения
      const imageUrl = URL.createObjectURL(data);

      // RawImage позволяет загружать и обрабатывать изображения
      const image = await RawImage.read(imageUrl);
      const imageInputs = await SiglipService.processor(image);
      const { pooler_output } = await SiglipService.visionModel(imageInputs);

      self.postMessage({
        type: "imageembeddingready",
        data: Array.from(pooler_output.data),
      });

      // Освобождаем память
      URL.revokeObjectURL(imageUrl);
    }
  } catch (error) {
    console.error(error);
    self.postMessage({ type: "error", data: error });
  }
});
