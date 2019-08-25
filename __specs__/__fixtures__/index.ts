import a2g from '../../async-to-generator.macro';

declare const fetch: (url: string) => Promise<void>;
declare const flow: (i: Generator) => void;

const c1 = a2g(async () => {
  await fetch("/foo");
});

const c2 = flow(a2g(async function () {
  await fetch("/foo");
}));

const c3 = flow(a2g(async function fetchData() {
  await fetch("/foo");
}));
