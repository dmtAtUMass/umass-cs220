import fetch from "../include/fetch";

/**
 * Exercise 1
 */

export type ObjsWithName = { name: string; [key: string]: unknown };

export function getObjsWithName(urls: string[]): Promise<ObjsWithName[]> {
  return Promise.allSettled(urls.map((url: string) => fetch(url).then(res => res.json()))).then(firstarr =>
    firstarr
      .filter((res): res is PromiseFulfilledResult<(Object | ObjsWithName)[]> => res.status === "fulfilled")
      .map(r => r["value"])
      .map(objarr => objarr.filter(obj => "name" in obj) as ObjsWithName[])
      .flat()
  );
}

// Lets try using our function!
const urls: string[] = [
  "https://api.github.com/users/umass-compsci-220/repos",
  "https://api.github.com/users/umass-cs-230/repos",
];

getObjsWithName(urls)
  .then(obs => obs.map(obj => obj["name"]))
  .then(console.log)
  .catch(console.log);

/**
 * Exercise 2
 */

// composeFunctionsAsync
export function composeFunctionsAsync<T>(asyncFuncArr: ((a: any) => Promise<any>)[]): (a: T) => Promise<any> {
  return (a: T) => {
    return asyncFuncArr.reduce((acc: Promise<any>, f: (a: T) => Promise<T>) => acc.then(f), Promise.resolve(a));
  };
}

const getjson = composeFunctionsAsync([
  fetch,
  (res: Response) => (res.ok ? res.json() : Promise.reject(`${res.status} : ${res.statusText}`)),
]);

/* test async function composition */
getjson("https://api.github.com/users/umass-cs-230/repos")
  .then(res => res[0]["owner"])
  .then(console.log)
  .catch(console.log);
