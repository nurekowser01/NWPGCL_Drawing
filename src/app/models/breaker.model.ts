export interface Breaker {
  id: string;
  description: string;
  manufacturerDrawing: string;
  asBuiltDrawing?: string;
  drawingNumber?: string; // ✅ add this line

}