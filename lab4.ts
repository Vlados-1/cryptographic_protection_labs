import * as promptSync from 'prompt-sync';
import { gcdex, inverse_element, inverse_element2, phi } from './utils';
const prompt = promptSync();

console.log(`gcdex(612, 342) = [${gcdex(612, 342)}]`);
console.log(`inverse_element (5, 18) = ${inverse_element (5, 18)}`);
let m = prompt('Enter m: ');
while (!m.match(/^\d+$/)) {
    console.log('m should be a number');
    m = prompt('Enter m: ');
}
console.log(`phi(${m}) = ${phi(parseInt(m))}`);
console.log(`inverse_element2 (5, 18) = ${inverse_element2 (5, 18)}`);
