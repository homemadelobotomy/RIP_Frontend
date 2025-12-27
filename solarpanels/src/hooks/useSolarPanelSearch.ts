import { useState, useRef, useEffect } from "react";
import type { SolarPanel } from "../slices/dataSlice";
import { cosineSimilarity } from "../utils/math";

export interface IProcessedSolarPanel extends SolarPanel {
  score: number;
  isVisible: boolean;
}

export const useSolarPanelSearch = (initialItems: SolarPanel[]) => {
  const [items, setItems] = useState<IProcessedSolarPanel[]>(
    initialItems.map((item) => ({ ...item, score: 0, isVisible: true }))
  );
  const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const [textEmbeddings, setTextEmbeddings] = useState<Record<number, number[]>>({});

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/search.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { type, data } = e.data;

      switch (type) {
        case "progress":
          if (data.status === "progress") {
            setProgress(data.progress);
          } else if (data.status === "ready") {
            setReady(true);
          }
          break;

        case "textembeddingsready":
          setTextEmbeddings(data);
          setReady(true);
          break;

        case "imageembeddingready":
          setImageEmbedding(data);
          break;
      }
    };

    return () => workerRef.current?.terminate();
  }, []); 

  useEffect(() => {
    if (initialItems.length > 0 && workerRef.current) {
      workerRef.current.postMessage({ type: "init", data: initialItems });
    }
  }, [initialItems]);

  useEffect(() => {
    if (!imageEmbedding) {
      setItems(
        initialItems.map((item) => ({
          ...item,
          embedding: textEmbeddings[item.ID],
          score: 0,
          isVisible: true,
        }))
      );
    } else {
      const threshold = 0.08;

      const processed = initialItems.map((item) => {
        const embedding = textEmbeddings[item.ID];
        if (!embedding) {
          return { ...item, score: 0, isVisible: true, embedding };
        }

        const similarity = cosineSimilarity(imageEmbedding, embedding);

        return {
          ...item,
          embedding,
          score: similarity,
          isVisible: similarity > threshold,
        };
      });

      processed.sort((a, b) => b.score - a.score);

      setItems(processed);
    }
  }, [initialItems, textEmbeddings, imageEmbedding]);

  const searchByImage = (file: File) => {
    workerRef.current?.postMessage({ type: "image", data: file });
  };

  const resetSearch = () => {
    setImageEmbedding(null);
  };

  return {
    items,
    ready,
    progress,
    imageEmbedding,
    searchByImage,
    resetSearch,
  };
};
