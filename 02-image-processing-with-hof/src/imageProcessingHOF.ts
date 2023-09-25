import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const newImage = img.copy();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      newImage.setPixel(i, j, func(img, i, j));
    }
  }
  return newImage;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  return imageMapCoord(img, (image, x, y) => (cond(image, x, y) ? func(image.getPixel(x, y)) : image.getPixel(x, y)));
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  return imageMapIf(
    img,
    (img, x, y) => xInterval[0] <= x && x <= xInterval[1] && yInterval[0] <= y && y <= yInterval[1],
    func
  );
}

export function isGrayish(p: Color): boolean {
  return Math.abs(Math.max(...p) - Math.min(...p)) <= 85;
}

export function mean(p: Color): number {
  return Math.floor(p.reduce((a, b) => a + b) / 3);
}

export function getNeighbors(img: Image, x: number, y: number): Color[] {
  const neighbor = [];
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i >= 0 && i < img.width && j >= 0 && j < img.height) {
        neighbor.push(img.getPixel(i, j));
      }
    }
  }
  return neighbor;
}

export function makeGrayish(img: Image): Image {
  return imageMapIf(
    img,
    (img, x, y) => !isGrayish(img.getPixel(x, y)),
    p => [mean(p), mean(p), mean(p)]
  );
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  const neighbor = getNeighbors(img, x, y);
  return neighbor.reduce((a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]).map(e => Math.floor(e / neighbor.length));
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => pixelBlur(img, x, y));
}
