import * as prompt_sync from 'prompt-sync';
import * as bigInt from 'big-integer';
import { sha1 } from './lab9';
import {
    EDSA_singing,
    find_ord_point,
    get_ellipt,
    EDSA_verifySignature,
} from './utils';

const prompt = prompt_sync();

let a = 1;
const arr = get_ellipt(23);
const beautifyArray = arr.map((item) => `(${item.join(';')})`);
let point = [17, 20];

console.log('\nFirst part');
console.log('All points of elliptic curve:');
console.table(beautifyArray);
console.log(`Count of points: ${arr.length}`);
console.log(`Order of point G(${point.join(';')}) on elliptic curve: ${find_ord_point(point, 23, a)}`,);

console.log('\nSecond part');
point = [0, 14];
a = 15;
const modul = 43;
const pointOrder = find_ord_point(point, modul, a);

const inputText = prompt('Enter message for signing: ');
const H = sha1(inputText);
const h = bigInt(parseInt(H, 16)).modPow(1, pointOrder).toJSNumber();

const [r, s, Q] = EDSA_singing(point, a, modul, pointOrder, h);

console.log(`Signed message: ("${inputText}", ${r}, ${s}, text)`);

console.log(
    `Checking the validity of the signature --- ${
        EDSA_verifySignature(
            r as number,
            s as number,
            pointOrder,
            Q as number[],
            point,
            modul,
            a,
            h,
        )
            ? 'Signed' : 'Unsigned'}`,
);
