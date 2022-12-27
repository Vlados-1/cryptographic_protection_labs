import { randomInt } from 'mathjs';
import * as bigInt from 'big-integer';
import * as promptSync from 'prompt-sync';
import { ElGamal_decryption, ElGamal_encryption, generate_prime, getG } from './utils';

const prompt = promptSync();

console.log('\nKey exchange protocol Diffie-Hellman');
console.log('------------------------------------------------');
let p = generate_prime(3, 50);
let g = getG(p);
const a = randomInt(1, 30);
const b = randomInt(1, 30);

const A = bigInt(g).modPow(a, p).toJSNumber();
const B = bigInt(g).modPow(b, p).toJSNumber();
const key2 = bigInt(A).modPow(b, p).toJSNumber();
const key1 = bigInt(B).modPow(a, p).toJSNumber();

console.log(`Received value B (User1 from User2) => ${B}`);
console.log(`Received value A (User2 from User1) => ${A}`);
console.log(`Secret key => ${key1}`);

console.log('\n\nElGamal algorithm');
p = generate_prime(30, 100);
g = getG(p);
const x = randomInt(1, p);
const y = bigInt(g).modPow(x, p).toJSNumber();
const publicKey = [p, g, y];
const privateKey = x;

let m = prompt(`Enter the number in range [0;${p - 1}]: `);
while (!m.match(/^\d+$/) || parseInt(m) < 0 || parseInt(m) > p - 1) {
    console.log(`Invalid input. m must be a number in range [0; ${p - 1}]`);
    m = prompt(`Enter the number in range [0;${p - 1}]: `);
}

const encrypted_number = ElGamal_encryption(parseInt(m), p, g, y);
console.log(`Encrypted number => [${encrypted_number.join(' ')}]`);

const value = ElGamal_decryption(encrypted_number[0], encrypted_number[1], x, p);
console.log(`Decrypted number => ${value}`);
