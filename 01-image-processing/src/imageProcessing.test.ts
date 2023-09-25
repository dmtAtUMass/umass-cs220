import assert from "assert";
import { COLORS, Image, Color } from "../include/image.js";
import { flipColors, removeRed, mapLine, imageMap, mapToGB, mapFlipColors } from "./imageProcessing.js";

describe("removeRed", () => {
  it("should remove red from the upper left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    const gbImage = removeRed(whiteImage);
    const p = gbImage.getPixel(0, 0);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 255, "The blue channel should be 255.");

    // or alternatively, using jest, if you'd like
    // https://jestjs.io/docs/expect#toequalvalue
    // Use expect with .toEqual to compare recursively all properties of object instances (also known as "deep" equality).

    expect(p).toEqual([0, 255, 255]);

    // This will produce output showing the exact differences between the two objects, which is really helpful
    // for debugging. However, again, please use the simpler assert syntax if this is too confusing.
    // Focus on making your tests well written and correct, rather than using one syntax or another.
  });

  it("should remove red from the center", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    const gbImage = removeRed(whiteImage);
    const p = gbImage.getPixel(5, 5);

    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 255, "The blue channel should be 255.");
  });

  // More tests for removeRed go here.
});

describe("flipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = flipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });

  // More tests for flipColors go here.
});

// TODOs;

describe("mapLine", () => {
  it("should create a strip of color in the middle row", () => {
    const blackImage = Image.create(10, 10, COLORS.BLACK);
    const mapfunc = (x: Color) => [x[0] + 50, x[1] + 100, x[2] + 150];
    mapLine(blackImage, 5, mapfunc);
    for (let i = 0; i < 10; i++) {
      const p = blackImage.getPixel(i, 5);
      assert(p[0] === 50, "The red channel should be 50.");
      assert(p[1] === 100, "The green channel should be 100.");
      assert(p[2] === 150, "The blue channel should be 150.");
    }
  });
});

describe("imageMap", () => {
  it("should remove red from the center", () => {
    let blackImage = Image.create(10, 10, COLORS.BLACK);
    const mapfunc = (x: Color) => [x[0] + 50, x[1] + 100, x[2] + 150];
    blackImage = imageMap(blackImage, mapfunc);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const p = blackImage.getPixel(i, j);
        assert(p[0] === 50, "The red channel should be 0.");
        assert(p[1] === 100, "The green channel should be 255.");
        assert(p[2] === 150, "The blue channel should be 255.");
      }
    }
  });
});

describe("mapToGB", () => {
  it("should remove red from the center", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    const gbImage = mapToGB(whiteImage);
    const p = gbImage.getPixel(5, 5);
    console.log(p);
    assert(p[0] === 0, "The red channel should be 0.");
    assert(p[1] === 255, "The green channel should be 255.");
    assert(p[2] === 255, "The blue channel should be 255.");
  });
});

describe("mapFlipColors", () => {
  it("should correctly flip top left corner", () => {
    const whiteImage = Image.create(10, 10, COLORS.WHITE);
    // A white image is not particularly helpful in this context
    whiteImage.setPixel(0, 0, [100, 0, 150]);
    const flippedWhiteImage = mapFlipColors(whiteImage);
    const p = flippedWhiteImage.getPixel(0, 0);

    assert(p[0] === 75);
    assert(p[1] === 125);
    assert(p[2] === 50);
  });
});
