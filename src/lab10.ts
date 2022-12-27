import * as prompt_sync from 'prompt-sync';
import { generate_params, getH, singing, verify_signature } from './utils';

const prompt = prompt_sync();

const [p, g, x, y] = generate_params();
const message = prompt('Enter message to sign: ');
const H = getH(message, p);
const [k, r, s] = singing(p, g, x, y, H);
console.log(`\nSigned message: ("${message}", ${r}, ${s})`);
console.log(
    `\nChecking the validity of the signature --- ${
        verify_signature(r, p, s, H, y, g) ? 'Signed' : 'Unsigned'}`,
);
