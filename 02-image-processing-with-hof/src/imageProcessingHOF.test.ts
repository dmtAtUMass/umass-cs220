import assert from "assert";
import { Color, COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  imageBlur,
  makeGrayish,
  isGrayish,
  mapWindow,
  pixelBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });
});

describe("imageMapIf", () => {
  it("should only change RGB pixels with R > 120", () => {
    const input = Image.create(4, 4, [20, 30, 40]);
    input.setPixel(2, 2, [130, 130, 130]);
    const output = imageMapIf(
      input,
      (img, x, y) => img.getPixel(x, y)[0] > 120,
      () => [100, 100, 100]
    );
    assert(output.getPixel(2, 2)[0] === 100);
    assert(output.getPixel(2, 2)[1] === 100);
  });
});

describe("mapWindow", () => {
  it("should map correct window", () => {
    const input = Image.create(5, 5, COLORS.WHITE);
    const output = mapWindow(input, [2, 3], [2, 3], p => [p[0] - 100, p[1] - 100, p[2] - 100]);
    assert(output.getPixel(0, 0)[0] === 255);
    assert(output.getPixel(2, 3)[0] === 155);
  });
});

describe("isGrayish", () => {
  it("should return isGrayish iff max - min <= 85", () => {
    const input = Image.create(1, 1, [0, 85, 170]);
    const input2 = Image.create(1, 1, [0, 10, 20]);
    assert(!isGrayish(input.getPixel(0, 0)));
    assert(isGrayish(input2.getPixel(0, 0)));
  });
});

describe("makeGrayish", () => {
  it("should make the 1x1 pixel grayish", () => {
    const input = Image.create(1, 1, [0, 85, 170]);
    const output = makeGrayish(input);
    assert(output.getPixel(0, 0)[0] === 85);
    assert(output.getPixel(0, 0)[1] === 85);
    assert(output.getPixel(0, 0)[2] === 85);
  });
  it("should not change the already grayish 1x1 pixel", () => {
    const input = Image.create(1, 1, [0, 10, 20]);
    const output = makeGrayish(input);
    assert(output.getPixel(0, 0)[0] === 0);
    assert(output.getPixel(0, 0)[1] === 10);
    assert(output.getPixel(0, 0)[2] === 20);
  });
  it("should only change the non-grayish pixels", () => {
    const input = Image.create(1, 1, [0, 10, 20]);
    const output = makeGrayish(input);
    assert(output.getPixel(0, 0)[0] === 0);
    assert(output.getPixel(0, 0)[1] === 10);
    assert(output.getPixel(0, 0)[2] === 20);
  });
});

describe("pixelBlur", () => {
  it("should blur pixels in the corner correctly", () => {
    const input = Image.create(3, 3, [0, 10, 20]);
    input.setPixel(0, 0, [0, 0, 0]);
    assert(pixelBlur(input, 0, 0)[0] === 0);
    assert(pixelBlur(input, 0, 0)[1] === 7);
    assert(pixelBlur(input, 0, 0)[2] === 15);
  });
  it("should blur pixels on the edge correctly", () => {
    const input = Image.create(3, 3, [0, 10, 20]);
    input.setPixel(0, 1, [0, 0, 0]);
    expectColorToBeCloseTo(pixelBlur(input, 0, 1), [0, 50 / 6, 50 / 3], 1);
  });
  it("should blur the pixels in the center correctly", () => {
    const input = Image.create(5, 5, [0, 10, 20]);
    input.setPixel(2, 2, [0, 0, 0]);
    expectColorToBeCloseTo(pixelBlur(input, 2, 2), [0, 80 / 9, 160 / 9]);
  });
});

describe("imageBlur", () => {
  it("modify the center pixel correctly", () => {
    const input = Image.create(3, 3, [90, 90, 90]);
    input.setPixel(1, 1, [0, 0, 0]);
    assert(input.getPixel(1, 1)[0] === 0);
    const output = imageBlur(input);
    assert(output.getPixel(1, 1)[0] === 80);
    assert(output.getPixel(1, 1)[1] === 80);
    assert(output.getPixel(1, 1)[2] === 80);
  });
});
