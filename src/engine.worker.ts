/* eslint-disable no-restricted-globals */
import * as ElephantOps from "elephantops";

// Sử dụng cách truy cập an toàn cho môi trường Worker
const ElephantClass: any = (ElephantOps as any).Xiangqi;

let engine: any;
try {
  engine = new ElephantClass();
} catch (e) {
  console.error("Failed to init Elephant engine");
}

self.onmessage = (e: MessageEvent) => {
  const { fen } = e.data;
  if (!engine) return;

  try {
    engine.parseFen(fen);
    // Độ sâu 5-6 để đảm bảo tốc độ phản hồi trên trình duyệt
    const bestMove = engine.search(5);
    if (bestMove) {
      self.postMessage(bestMove);
    }
  } catch (err) {
    console.error("Engine Worker Error:", err);
  }
};

export {};
