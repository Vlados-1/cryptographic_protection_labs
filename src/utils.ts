import * as nj from 'numjs';
import * as bigInt from 'big-integer';
import { mod, randomInt } from 'mathjs';


export const insert = (array: nj.NdArray<any>, index: number, values: any[], axis: 0 | 1) => {
    if (axis === 0) {
        const firstPart = array.slice([0, index], null).tolist();
        const secondPart = array.slice([index, array.shape[0]], null).tolist();
        return nj.array([...firstPart, values, ...secondPart]);
    } else {
        const result = [];
        const copy = array.tolist();
        for (let i = 0; i < copy.length; i++) {
            const firstPart = copy[i].slice(0, index);
            const secondPart = copy[i].slice(index, copy[i].length);
            result.push([...firstPart, values[i], ...secondPart]);
        }
        return nj.array(result);
    }
};

export const focdex = (a: number, b: number) => {
    let [a0, a1] = [a, b];
    let [x0, x1] = [1, 0];
    let [y0, y1] = [0, 1];

    while (a1 !== 0) {
        let q = Math.floor(a0 / a1);
        [a0, a1] = [a1, a0 - q * a1];
        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    return [a0, x0, y0];
};

export const inverse_element = (a: number, n: number) => {
    const [d, x] = focdex(a, n);
    if (d !== 1) {
        throw new Error(`a(${a}) and n(${n}) are not mutually prime`);
    }
    return mod(x, n);
};

export const phi = (n: number) => {
 
    function foc(a, b) {
        if (a === 0) {
            return b;
        }

        return foc(mod(b, a), a);
    }
    let result = 1;
  
    for (let i = 2; i < n; i++) {
        if (foc(i, n) === 1) {
            result++;
        }
    }
    return result;
};

export const inverse_element2 = (a: number, n: number) => {
    return mod(Math.pow(a, phi(n) - 1), n);
};

export const miller_rabin_test = (n: number, a: number) => {
    if (focdex(n, a)[0] > 1) {
        return false;
    }
    let s = 0;
    let nCopy = n - 1;
    while (nCopy % 2 === 0) {
        s++;
        nCopy /= 2;
    }
    const d = (n - 1) / Math.pow(2, s);
    const x = mod(Math.pow(a, d), n);
    if (x === 1 || x === -1) {
        return true;
    }
    for (let i = 1; i < s; i++) {
        const v = mod(Math.pow(x, Math.pow(2, i)), n);
        if (v === 1) {
            return false;
        } else if (v === -1) {
            return true;
        }
    }
    return true;
};

export const isPrime = (n: number) => {
    for (let i = 0; i < 100; i++) {
        const a = randomInt(0, n);
        if (!miller_rabin_test(n, a)) {
            return false;
        }
    }
    return true;
};

export const generate_prime = (firstRangeValue: number, lastRangeValue: number) => {
    let value = randomInt(firstRangeValue, lastRangeValue);
    while (!isPrime(value)) {
        value = randomInt(firstRangeValue, lastRangeValue);
    }
    return value;
};

export const RSA_Encoding = (m: number, publicKey: number[]) => {
    const n = publicKey[0];
    const e = publicKey[1];
    return bigInt(m).modPow(bigInt(e), bigInt(n)).toJSNumber();
};

export const RSA_Decoding = (c: number, privateKey: number[]) => {
    const n = privateKey[0];
    const d = privateKey[1];
    return bigInt(c).modPow(bigInt(d), bigInt(n)).toJSNumber();
};

export const mul02 = (byte) => {
    let byteInDes = byte;
    let inputBinByte = byteInDes.toString(2);
    let shiftedDesByte = byteInDes << 1;
    let shiftedBinByte = shiftedDesByte.toString(2);
    if (shiftedBinByte.length > 8) {
        shiftedBinByte = shiftedBinByte.slice(shiftedBinByte.length - 8, shiftedBinByte.length);
        shiftedDesByte = parseInt(shiftedBinByte, 2);
    }
    let result = shiftedDesByte;
    if (inputBinByte.length === 8 && inputBinByte[0] === '1') {
        const XOR_VALUE = '00011011';
        const XOR_DEC_VALUE = parseInt(XOR_VALUE, 2);
        result = shiftedDesByte ^ XOR_DEC_VALUE;
    }
    return result;
};

export const mul03 = (byte) => {
    return mul02(byte) ^ byte;
};

export const easy_root = (g: number, p: number) => {
    for (let i = 1; i < p - 1; i++) {
        if (mod(Math.pow(g, i), p) === 1) {
            return false;
        }
    }
    return true;
};

export const getG = (p: number) => {
    while (true) {
        const g = randomInt(2, p);
        if (easy_root(g, p)) {
            return g;
        }
    }
};

export const ElGamal_encryption = (value: number, p: number, g: number, y: number) => {
    const k = randomInt(1, p - 1);
    const a = bigInt(g).modPow(bigInt(k), bigInt(p)).toJSNumber();
    const b = mod(bigInt(y).modPow(bigInt(k), bigInt(p)).multiply(bigInt(value)).toJSNumber(), p);
    return [a, b];
};

export const ElGamal_decryption = (a: number, b: number, x: number, p: number) => {
    return bigInt(b)
        .multiply(bigInt(a).pow(p - 1 - x))
        .mod(p)
        .toJSNumber();
};

export const generate_params = () => {
    const p = generate_prime(3000, 10000);
    const g = getG(p);
    const x = randomInt(1, p - 2);
    const y = bigInt(g).modPow(bigInt(x), bigInt(p)).toJSNumber();
    return [p, g, x, y];
};

export const singing = (p: number, g: number, x: number, y: number, m: number) => {
    const k = generate_prime(2, p - 2);
    const r = bigInt(g).modPow(bigInt(k), bigInt(p)).toJSNumber();
    const s = mod(
        bigInt(m)
            .minus(bigInt(x).multiply(bigInt(r)))
            .multiply(bigInt(inverse_element(k, p - 1)))
            .toJSNumber(),
        p - 1,
    );
    return [k, r, s];
};

export const verify_signature = (
    r: number,
    p: number,
    s: number,
    m: number,
    y: number,
    g: number,
) => {
    if (!((0 < r && r < p) || (0 < s && s < p - 1))) {
        return false;
    }
    const temp = mod(
        bigInt(y)
            .modPow(bigInt(r), bigInt(p))
            .multiply(bigInt(r).modPow(bigInt(s), bigInt(p)))
            .toJSNumber(),
        p,
    );
    if (bigInt(g).modPow(bigInt(m), bigInt(p)).toJSNumber() !== temp) {
        return false;
    }
    return true;
};

export const getH = (m: string, p: number) => {
    let H = 0;
    for (let i = 0; i < m.length; i++) {
        H += m.charCodeAt(i);
    }
    if (H > p - 1) {
        H = H % p;
    }
    return H;
};

export const get_ellipt = (count: number) => {
    const arr = [];
    for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
            if (mod(Math.pow(y, 2) - (Math.pow(x, 3) + x + 1), count) === 0) {
                arr.push([x, y]);
            }
        }
    }
    return arr;
};

export const add_point = (first_point: number[], second_point: number[], count: number, a: number) => {
    let numerator = 3 * Math.pow(first_point[0], 2) + a;
    let denominator = 2 * first_point[1];
    let temp = mod(Math.pow(inverse_element(denominator, count), 1), count) * numerator;
    let s = mod(Math.pow(temp, 1), count);
    let x = mod(Math.pow(Math.pow(s, 2) - 2 * first_point[0], 1), count);
    let y = mod(Math.pow(s * (first_point[0] - x) - first_point[1], 1), count);

    if (first_point[0] !== second_point[0] || first_point[1] !== second_point[1]) {
        numerator = second_point[1] - first_point[1];
        denominator = second_point[0] - first_point[0];
        temp = mod(Math.pow(inverse_element(denominator, count), 1), count) * numerator;
        s = mod(Math.pow(temp, 1), count);
        x = mod(Math.pow(Math.pow(s, 2) - (second_point[0] + first_point[0]), 1), count);
        y = mod(Math.pow(s * (second_point[0] - x) - second_point[1], 1), count);
    }

    return [x, y];
};

export const find_ord_point = (first_point: number[], count: number, a: number) => {
    let second_point = add_point(first_point, first_point, count, a);
    let d = 2;
    while (first_point[0] !== second_point[0]) {
        d += 1;
        second_point = add_point(first_point, second_point, count, a);
    }
    d += 1;
    return d;
};

export const EDSA_singing = (
    point: number[],
    a: number,
    modl: number,
    point_ord: number,
    h: number,
) => {
    let Q = point;
    const d = randomInt(2, point_ord - 2);
    for (let i = 0; i < d - 1; i++) {
        Q = add_point(Q, point, modl, a);
    }
    const k = randomInt(2, point_ord - 2);
    let C = point;
    for (let i = 0; i < k - 1; i++) {
        C = add_point(C, point, modl, a);
    }
    const r = mod(Math.pow(C[0], 1), point_ord);
    const temp = inverse_element(k, point_ord);
    const s = mod(Math.pow((h + d * r) * temp, 1), point_ord);
    return [r, s, Q];
};

export const EDSA_verifySignature = (
    r: number,
    s: number,
    point_ord: number,
    Q: number[],
    point: number[],
    modl: number,
    a: number,
    h: number,
) => {
    const u = mod(Math.pow(h * inverse_element(s, point_ord), 1), point_ord);
    const v = mod(Math.pow(r * inverse_element(s, point_ord), 1), point_ord);
    let point_first = point;
    let point_second = Q;
    for (let i = 0; i < u - 1; i++) {
        point_first = add_point(point_first, point, modl, a);
    }
    for (let i = 0; i < v - 1; i++) {
        point_second = add_point(point_second, Q, modl, a);
    }
    const final_dot = add_point(point_first, point_second, modl, a);
    const r_h = mod(Math.pow(final_dot[0], 1), point_ord);
    return r === r_h;
};
