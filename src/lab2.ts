import * as promptSync from 'prompt-sync';

const prompt = promptSync();
const letters = {
    A:'11',
    B:'12',
    C:'13',
    D:'14',
    E:'15',
    F:'21',
    G:'22',
    H:'23',
    I:'24',
    J:'25',
    K:'31',
    L:'32',
    M:'33',
    N:'34',
    O:'35',
    P:'41',
    Q:'42',
    R:'43',
    S:'44',
    T:'45',
    U:'51',
    V:'52',
    W:'53',
    X:'54',
    Y:'55',
    Z:'61',
    ' ':'62',
};

const encryption = (textToEncrypt) => {
    let horizontalCords = '';
    let verticalCords = '';

    for (const char of textToEncrypt) {
        horizontalCords += letters[char][0];
        verticalCords += letters[char][1];
    }

    return (horizontalCords + verticalCords).replace(/.{1,2}(?=(.{2})+$)/g, '$& ');
};
function decryption(text_coordinates) {
    const horizontalCords = text_coordinates
        .slice(0, text_coordinates.length / 2)
        .replaceAll(' ', '');
    const verticalCords = text_coordinates.slice(text_coordinates.length / 2).replaceAll(' ', '');

    const swappedAlphabet = Object.fromEntries(
        Object.entries(letters).map(([key, value]) => [value, key]),
    );

    let decrypted_text = '';
    for (let i = 0; i < horizontalCords.length; i++) {
        console.log(horizontalCords[i] + verticalCords[i]);
        decrypted_text += swappedAlphabet[horizontalCords[i] + verticalCords[i]];
    }
    return decrypted_text;
}

const text_to_encrypt = prompt('Text to encrypt: ').toUpperCase();

console.log('\nEncrypting...');
const encrypted_text = encryption(text_to_encrypt);
console.log('Encrypted text: ', encrypted_text);

console.log('\nDecrypting...');
const decrypted_text = decryption(encrypted_text);
console.log('Decrypted text: ', decrypted_text);
