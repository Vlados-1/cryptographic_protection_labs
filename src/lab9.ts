import * as promptSync from 'prompt-sync';

const prompt = promptSync();

function raw_hex(raw) {
    let hex = '';
    const hexChars = '0123456789abcdef';
    for (let i = 0; i < raw.length; i++) {
        const c = raw.charCodeAt(i);
        hex += hexChars.charAt((c >>> 4) & 0x0f) + hexChars.charAt(c & 0x0f);
    }
    return hex;
}

function sha1_raw(raw) {
    return binary_raw(sha1_bin(raw_binary(raw), raw.length * 8));
}

function binary_raw(bin) {
    let raw = '';
    for (let i = 0, il = bin.length * 32; i < il; i += 8) {
        raw += String.fromCharCode((bin[i >> 5] >>> (24 - (i % 32))) & 0xff);
    }
    return raw;
}

function sha1_bin(bin, len) {
    bin[len >> 5] |= 0x80 << (24 - (len % 32));
    bin[(((len + 64) >> 9) << 4) + 15] = len;

    const w = new Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    for (let i = 0, il = bin.length; i < il; i += 16) {
        const _a = a;
        const _b = b;
        const _c = c;
        const _d = d;
        const _e = e;

        for (let j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = bin[i + j];
            } else {
                w[j] = _rotateL(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            const t = _add(_add(_rotateL(a, 5), _ft(j, b, c, d)), _add(_add(e, w[j]), _kt(j)));
            e = d;
            d = c;
            c = _rotateL(b, 30);
            b = a;
            a = t;
        }

        a = _add(a, _a);
        b = _add(b, _b);
        c = _add(c, _c);
        d = _add(d, _d);
        e = _add(e, _e);
    }
    return [a, b, c, d, e];
}

function _add(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
}

function _rotateL(n, count) {
    return (n << count) | (n >>> (32 - count));
}

function _ft(t, b, c, d) {
    if (t < 20) {
        return (b & c) | (~b & d);
    } else if (t < 40) {
        return b ^ c ^ d;
    } else if (t < 60) {
        return (b & c) | (b & d) | (c & d);
    } else {
        return b ^ c ^ d;
    }
}

function _kt(t) {
    if (t < 20) {
        return 1518500249;
    } else if (t < 40) {
        return 1859775393;
    } else if (t < 60) {
        return -1894007588;
    } else {
        return -899497514;
    }
}

function raw_binary(raw) {
    const binary = new Array(raw.length >> 2);
    for (let i = 0, il = binary.length; i < il; i++) {
        binary[i] = 0;
    }
    for (let i = 0, il = raw.length * 8; i < il; i += 8) {
        binary[i >> 5] |= (raw.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    }
    return binary;
}

function string_raw(string) {
    let raw = '',
        x,
        y;
    let i = -1;
    const il = string.length;
    while (++i < il) {
        x = string.charCodeAt(i);
        y = i + 1 < il ? string.charCodeAt(i + 1) : 0;
        if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
            x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
            ++i;
        }
        if (x <= 0x7f) {
            raw += String.fromCharCode(x);
        } else if (x <= 0x7ff) {
            raw += String.fromCharCode(0xc0 | ((x >>> 6) & 0x1f), 0x80 | (x & 0x3f));
        } else if (x <= 0xffff) {
            raw += String.fromCharCode(
                0xe0 | ((x >>> 12) & 0x0f),
                0x80 | ((x >>> 6) & 0x3f),
                0x80 | (x & 0x3f),
            );
        } else if (x <= 0x1fffff) {
            raw += String.fromCharCode(
                0xf0 | ((x >>> 18) & 0x07),
                0x80 | ((x >>> 12) & 0x3f),
                0x80 | ((x >>> 6) & 0x3f),
                0x80 | (x & 0x3f),
            );
        }
    }
    return raw;
}

export const sha1 = (s) => {
    return raw_hex(sha1_raw(string_raw(s)));
};

const textToHash = prompt('Enter text to hash(SHA-1): ');
const hash = sha1(textToHash);
console.log(`Hashed text: \n-> ${hash} <-`);
