import * as nj from 'numjs';
import * as _ from 'lodash';
import * as promptSync from 'prompt-sync';
import { insert } from './utils';

const prompt = promptSync();

interface IKeys {
    horizontalKey: string;
    verticalKey: string;
}

const encodeDecode = (array: nj.NdArray<string[]>, keys: IKeys, encodeFlag) => {
    console.log('------------------------');
    console.log(`${encodeFlag ? 'Encoding' : 'Decoding'} started...`);
    let { horizontalKey, verticalKey } = keys;

    let horizontal_key = horizontalKey.split('');
    let vertical_key = verticalKey.split('');

    if (encodeFlag) {
        horizontal_key.sort();
        vertical_key.sort();
    }

    let arrayLocalNj = array.transpose();
    let arrayLocal = arrayLocalNj.tolist();
    let temp = _.cloneDeep(arrayLocal);

    for (let i = 0; i < horizontal_key.length; i++) {
        arrayLocal[i + 1] = temp[array.tolist()[0].indexOf(horizontal_key[i])];
    }

    let arrayCopy = _.cloneDeep(arrayLocal);
    arrayLocalNj = nj.array(arrayLocal).transpose();
    arrayLocal = arrayLocalNj.tolist();
    temp = _.cloneDeep(arrayLocal);

    for (let i = 0; i < vertical_key.length; i++) {
        arrayLocal[i + 1] = temp[arrayCopy[0].indexOf(vertical_key[i])];
    }

    const encodedArray = _.cloneDeep(arrayLocal);
    let encodedText = '';

    for (const row of encodedArray.slice(1)) {
        encodedText += row.slice(1).join('');
    }

    console.log(`${encodeFlag ? 'Encoded' : 'Decoded'} array:`);
    console.table(encodedArray);
    console.log(`${encodeFlag ? 'Encoded' : 'Decoded'} text: "${encodedText}"`);

    return { encodedArray, encodedText: encodedText.trim() };
};

const horizontalKey = prompt('Enter horizontal text key: ');
const verticalKey = prompt('Enter vertical text key: ');

const horizontalKeyLength = horizontalKey.length;
const verticalKeyLength = verticalKey.length;
const arrayLength = horizontalKeyLength * verticalKeyLength;

let text_to_encode = prompt(`Enter text to encode(*max ${arrayLength} symbols): `);
while (text_to_encode.length > arrayLength) {
    console.log('Text is too long. Try again.');
    text_to_encode = prompt(`Enter text to encode(*max ${arrayLength} symbols): `);
}

const arrayToEncode = nj.array(text_to_encode.split(''));
const emptyArray = nj.array<string>(
    Array(arrayLength - text_to_encode.length)
        .join('.')
        .split('.'),
);
let array = nj
    .concatenate(arrayToEncode, emptyArray)
    .reshape<string[]>(verticalKeyLength, horizontalKeyLength);

array = insert(array, 0, horizontalKey.split(''), 0);
array = insert(array, 0, ['', ...verticalKey.split('')], 1);

const { encodedArray } = encodeDecode(array, { horizontalKey, verticalKey }, true);
encodeDecode(nj.array(encodedArray), { horizontalKey, verticalKey }, false);
