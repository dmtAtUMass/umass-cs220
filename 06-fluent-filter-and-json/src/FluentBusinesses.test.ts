import assert from "assert";
import { Business } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
    categories: ["Restaurants", "Spicy Food", "American"],
    hours: {
      Monday: "0:0-0:0",
      Tuesday: "8:0-18:30",
      Wednesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
    attributes: {
      Ambience: {
        romantic: true,
        intimate: false,
      },
    },
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
    categories: ["Restaurants", "Chinese"],
    hours: {
      Monday: "0:0-0:0",
      Tuesday: "8:0-18:30",
      Wednesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
    categories: ["Roofing", "Home Services"],
    hours: {
      Tuesday: "8:0-18:30",
      Wednesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
    categories: ["Automotive", "Auto Services", "Car Wash"],
    hours: {
      Tuesday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
];

describe("fluentBusinesses methods testing", () => {
  it("returns the correct data", () => {
    const list = new FluentBusinesses(testData).getData();
    for (let i = 0; i < 4; i++) {
      assert(list[i].name === testData[i].name);
    }
  });
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });
  it("hasStarsGeq", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
  it("inCategory", () => {
    const list = new FluentBusinesses(testData).inCategory("Restaurants").getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
  it("hasHoursOnDays", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays(["Monday"]).getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
  it("hasAmbience", () => {
    const list = new FluentBusinesses(testData).hasAmbience("romantic").getData();

    assert(list.length === 1);
    assert(list[0].name === "Applebee's");
  });
});

describe("bestPlace", () => {
  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });
});

describe("mostReviews", () => {
  it("should return the business with the most reviews", () => {
    const most = new FluentBusinesses(testData).mostReviews();

    assert(most);
    expect(most.name).toEqual("Beach Ventures Roofing");
  });
});
