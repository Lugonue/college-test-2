import { beforeEach, test, expect } from '@jest/globals';

import { execFileSync } from 'child_process';
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rows1;
let rows2;

beforeEach(() => {
  const options = { encoding: 'utf8', cwd: path.join(__dirname, '..') };

  const result1 = execFileSync(
    'index.js',
    ['table.csv'],
    options,
  );
  rows1 = result1.trim().split('\n')

});


test('Проверка количества существ', () => {

expect(rows1).toBe('HeyhEy');

})