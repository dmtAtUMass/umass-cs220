import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    return new FluentBusinesses(this.data.filter(b => b.city === city && b.state === state));
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    return new FluentBusinesses(this.data.filter(b => (b.stars ? b.stars >= stars : false)));
  }

  inCategory(category: string): FluentBusinesses {
    return new FluentBusinesses(this.data.filter(b => (b.categories ? b.categories.includes(category) : false)));
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    return new FluentBusinesses(
      this.data.filter(b => (b.hours ? days.some(d => (b.hours ? b.hours[d] : false)) : false))
    );
  }

  hasAmbience(ambience: string): FluentBusinesses {
    return new FluentBusinesses(
      this.data.filter(b => (b.attributes && b.attributes.Ambience ? b.attributes.Ambience[ambience] : false))
    );
  }

  bestPlace(): Business | undefined {
    return this.data.sort((a, b) => {
      if (a.stars && b.stars) {
        if (a.stars !== b.stars) {
          return b.stars - a.stars;
        } else if (a.review_count && b.review_count) {
          return b.review_count - a.review_count;
        }
      }
      return 0;
    })[0];
  }

  mostReviews(): Business | undefined {
    return this.data.sort((a, b) => {
      if (a.review_count && b.review_count) {
        if (a.review_count !== b.review_count) {
          return b.review_count - a.review_count;
        } else if (a.stars && b.stars) {
          return b.stars - a.stars;
        }
      }
      return 0;
    })[0];
  }
}
