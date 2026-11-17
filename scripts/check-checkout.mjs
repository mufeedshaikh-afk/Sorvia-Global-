import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Use Vite's installed compiler; no additional test dependencies are needed.
const require = createRequire(import.meta.url);
const { buildSync } = createRequire(require.resolve('vite/package.json'))('esbuild');
const output = buildSync({ entryPoints: ['src/checkoutValidation.ts'], bundle: true, write: false, format: 'cjs', platform: 'node' });
const compiled = { exports: {} };
new Function('module', 'exports', 'require', output.outputFiles[0].text)(compiled, compiled.exports, require);
const { validateDelivery, emptyDelivery } = compiled.exports;
const delivery = { email: 'alex@example.com', name: 'Alex Sample', phone: '+91 00000 00000', address: '12 Example Street', apartment: '', city: 'Mumbai', area: 'Maharashtra', postal: '400001' };

assert.deepEqual(validateDelivery(delivery, 'IN'), {});
assert.equal(Object.keys(validateDelivery(emptyDelivery, 'IN')).length, 7);
for (const [country, postal] of [['US', '10001-1234'], ['GB', 'SW1A 1AA'], ['DE', '10115'], ['FR', '75001']]) {
  assert.deepEqual(validateDelivery({ ...delivery, postal }, country), {});
}
for (const [country, postal] of [['IN', '000000'], ['US', '1234'], ['GB', '12345'], ['DE', '12ABC'], ['FR', '7500']]) {
  assert.ok(validateDelivery({ ...delivery, postal }, country).postal);
}
assert.ok(validateDelivery({ ...delivery, email: 'bad email' }, 'IN').email);
assert.ok(validateDelivery({ ...delivery, phone: 'abcdefg' }, 'IN').phone);
assert.ok(validateDelivery({ ...delivery, name: '   ', address: '   ' }, 'IN').name);
assert.ok(validateDelivery(delivery, 'OTHER').country);
assert.ok(validateDelivery(delivery, 'XX').country);
console.log('16 checkout validation assertions passed.');
