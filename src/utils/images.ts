import { Canvas, loadImage } from 'canvas';

export async function loadCanvasFromUri(width: number, height: number,
  imageUri: string): Promise<Canvas> {

  const canvas = new Canvas(width, height);
  const context = canvas.getContext('2d');
  const image = await loadImage(imageUri);
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}
