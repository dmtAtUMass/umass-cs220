// import { constants } from "buffer";
import type { Color, Image } from "../include/image.js";

/**
 * Removes all red color from an image
 * @param img An image
 * @returns A new image where each pixel has the red channel removed
 */
export function removeRed(img: Image): Image {
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const pixel = newImg.getPixel(x, y);
      newImg.setPixel(x, y, [0, pixel[1], pixel[2]]);
    }
  }
  return newImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixel's channel has been
 *  set as the truncated average of the other two
 */
export function flipColors(img: Image): Image {
  const newImg = img.copy();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const pixel = newImg.getPixel(x, y);
      newImg.setPixel(x, y, [
        Math.floor((pixel[1] + pixel[2]) / 2),
        Math.floor((pixel[0] + pixel[2]) / 2),
        Math.floor((pixel[0] + pixel[1]) / 2),
      ]);
    }
  }
  return newImg;
}

/**
 * Modifies the given `img` such that the value of each pixel
 * in the given line is the result of applying `func` to the
 * corresponding pixel of `img`. If `lineNo` is not a valid line
 * number, then `img` should not be modified.
 * @param img An image
 * @param lineNo A line number
 * @param func A color transformation function
 */
export function mapLine(img: Image, lineNo: number, func: (c: Color) => Color): void {
  if (lineNo < 0 || lineNo >= img.height) {
    return;
  }
  for (let x = 0; x < img.width; x++) {
    const pixel = img.getPixel(x, lineNo);
    img.setPixel(x, lineNo, func(pixel));
  }
  return;
}

/**
 * The result must be a new image with the same dimensions as `img`.
 * The value of each pixel in the new image should be the result of
 * applying `func` to the corresponding pixel of `img`.
 * @param img An image
 * @param func A color transformation function
 */
export function imageMap(img: Image, func: (c: Color) => Color): Image {
  const newImg = img.copy();
  for (let y = 0; y < newImg.height; y++) {
    mapLine(newImg, y, func);
    // console.log(newImg.getPixel(0,y))
  }
  return newImg;
}

/**
 * Removes all red color from an image
 * @param img An image
 * @returns A new image where each pixel has the red channel removed
 */
export function mapToGB(img: Image): Image {
  let newImg = img.copy();
  newImg = imageMap(newImg, c => [0, c[1], c[2]]);
  return newImg;
}

/**
 * Flips the colors of an image
 * @param img An image
 * @returns A new image where each pixels channel has been
 *  set as the truncated average of the other two
 */
export function mapFlipColors(img: Image): Image {
  let newImg = img.copy();
  newImg = imageMap(newImg, c => [
    Math.floor((c[1] + c[2]) / 2),
    Math.floor((c[0] + c[2]) / 2),
    Math.floor((c[0] + c[1]) / 2),
  ]);
  return newImg;
}
