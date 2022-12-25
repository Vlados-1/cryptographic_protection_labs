import { randomInt } from 'mathjs';
import * as promptSync from 'prompt-sync';
import { decoding, encoding, gcdex, generatePrime, inverse_element } from './utils';

const prompt = promptSync();

const lastRangeValue = 10000;
const p = generatePrime(lastRangeValue);
let q = generatePrime(lastRangeValue);

while (p === q) {
    q = generatePrime(lastRangeValue);
}
const n = p * q;
const phi = (p - 1) * (q - 1);

let e = randomInt(1, phi);
while (gcdex(e, phi)[0] !== 1) {
    e = randomInt(1, phi);
}

const d = inverse_element(e, phi);
const publicKey = [n, e];
const privateKey = [n, d];

let m = prompt(`Enter the number in range [1 - ${n - 2}]: `);
while (!m.match(/^\d+$/) || parseInt(m) < 1 || parseInt(m) > n - 2) {
    console.log(`Invalid input, m must be a number in range [1; ${n - 2}]`);
    m = prompt(`Enter the number in range [1 - ${n - 2}]: `);
}

const c = encoding(parseInt(m), publicKey);
console.log(`Encoded message: ${c}`);

const decodedM = decoding(c, privateKey);
console.log(`Decoded message: ${decodedM}`);
