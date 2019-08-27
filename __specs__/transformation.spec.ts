import * as path from 'path';
import { transformFileSync } from '@babel/core';

test('Transformations', () => {
  expect(transformFileSync(path.join(__dirname, '__fixtures__/index.ts'))!.code)
    .toMatchInlineSnapshot(`
    "\\"use strict\\";

    const c1 = function* () {
      yield fetch(\\"/foo\\");
    };

    const c2 = flow(function* () {
      yield fetch(\\"/foo\\");
    });
    const c3 = flow(function* fetchData() {
      yield fetch(\\"/foo\\");
    });"
  `);
});
