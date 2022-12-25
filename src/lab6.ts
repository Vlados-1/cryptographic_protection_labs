import { mul02, mul03 } from './utils';

const byte02 = 0xd4;
const byte03 = 0xbf;
console.log(`mul02(0xD4) = 0x${mul02(byte02).toString(16).toUpperCase()}`);
console.log(`mul03(0xBF) = 0x${mul03(byte03).toString(16).toUpperCase()}`);
