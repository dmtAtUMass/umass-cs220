import { Observable } from "../include/observable.js";
import { snode, Stream, sempty } from "../include/stream.js";

export class Economy extends Observable<number> {
  updateRate(rate: number): void {
    this.update(rate)
  }
}

export class Stock extends Observable<number> {
  name:string
  base: number
  price: number
  constructor(name: string, base: number, price: number) {
    super();
    // TODO: Implement the constructor
    this.name = name
    this.base = base
    this.price = price
  }

  updatePrice(rate: number): void {
    // TODO: Implement this method
    this.price = this.base * rate
    this.update(this.price)
  }
}

//  Should observe and report Stock's price
export class Newscast extends Observable<[string, number]> {
  constructor() {
    super();
  }

  report(name: string, price: number): void {
    console.log(`Stock ${name} has price ${price}.`);
    this.update([name, price])
  }

  observe(...stocks: Stock[]): void {
    stocks.forEach(
      stock => stock.subscribe(price => this.report(stock.name, price))
    )
  }
}

const USEconomy = new Economy();
const stock = new Stock("GME", 5.0, 1.0);
const news = new Newscast();

USEconomy.subscribe(rate => stock.updatePrice(rate));
stock.subscribe(price => news.report("GME", price));

USEconomy.updateRate(5); // “Stock GME has price 5.”
USEconomy.updateRate(1); // “Stock GME has price 1.”

function helper(s: Stream<number>, maxVal:number): Stream<number>{
  if (s.isEmpty()) return sempty()
  return s.head() > maxVal ? snode(s.head(), () => helper(s.tail(), s.head())) : snode(maxVal, () => helper(s.tail(), maxVal))
}

export function maxUpTo(s: Stream<number>): Stream<number> {
  return helper(s, -Infinity)
}
