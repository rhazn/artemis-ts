const ADDRESS_BITS_PER_WORD = 5;
const BITS_PER_WORD = 1 << ADDRESS_BITS_PER_WORD; // 32
const WORD_MASK = 0xffffffff;

/**
 * @see http://stackoverflow.com/questions/6506356/java-implementation-of-long-numberoftrailingzeros
 */
function numberOfTrailingZeros(i: number): number {
    if (i == 0) return 64;
    let x: number = i;
    let y: number;
    let n = 63;
    y = x << 32;
    if (y != 0) {
        n -= 32;
        x = y;
    }
    y = x << 16;
    if (y != 0) {
        n -= 16;
        x = y;
    }
    y = x << 8;
    if (y != 0) {
        n -= 8;
        x = y;
    }
    y = x << 4;
    if (y != 0) {
        n -= 4;
        x = y;
    }
    y = x << 2;
    if (y != 0) {
        n -= 2;
        x = y;
    }
    return n - ((x << 1) >>> 63);
}

export class BitSet {
    private words_: number[];

    constructor(nbits = 0) {
        if (nbits < 0) {
            throw RangeError("Negative Array Size: [" + nbits + "]");
        } else if (nbits === 0) {
            this.words_ = [];
        } else {
            const words = (this.words_ = new Array(((nbits - 1) >> ADDRESS_BITS_PER_WORD) + 1));
            for (let i = 0, l = words.length; i < l; i++) {
                words[i] = 0;
            }
        }
    }

    nextSetBit(fromIndex: number) {
        let u = fromIndex >> ADDRESS_BITS_PER_WORD;
        const words = this.words_;
        const wordsInUse = words.length;

        let word = words[u] & (WORD_MASK << fromIndex);
        while (true) {
            if (word !== 0) return u * BITS_PER_WORD + numberOfTrailingZeros(word);
            if (++u === wordsInUse) return -1;
            word = words[u];
        }
    }

    intersects(set: BitSet): boolean {
        const words = this.words_;
        const wordsInUse = words.length;

        for (let i = Math.min(wordsInUse, set.words_.length) - 1; i >= 0; i--)
            if ((words[i] & set.words_[i]) != 0) return true;
        return false;
    }

    // length():number {
    // 	return this.length_;
    // }

    // and(set:BitSet):BitSet {

    // }
    // or(set:BitSet):BitSet {

    // }
    // nand(set:BitSet):BitSet {

    // }
    // nor(set:BitSet):BitSet {

    // }
    // not(set:BitSet):BitSet {

    // }
    // xor(set:BitSet):BitSet {

    // }
    // equals(set:BitSet):boolean {

    // }
    // clone():BitSet {

    // }
    isEmpty(): boolean {
        return this.words_.length === 0;
    }

    // toString():string {

    // }
    // cardinality():number {

    // }

    // msb():number {

    // }

    set(bitIndex: number, value = true): number {
        const wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
        const words = this.words_;
        const wordsInUse = words.length;
        const wordsRequired = wordIndex + 1;

        if (wordsInUse < wordsRequired) {
            words.length = Math.max(2 * wordsInUse, wordsRequired);
            for (let i = wordsInUse, l = words.length; i < l; i++) {
                words[i] = 0;
            }
        }

        if (value) {
            return (words[wordIndex] |= 1 << bitIndex);
        } else {
            return (words[wordIndex] &= ~(1 << bitIndex));
        }
    }

    // setRange(from:number, to:number, value:number):number {

    // }

    get(bitIndex: number): boolean {
        const wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
        const words = this.words_;
        const wordsInUse = words.length;

        return wordIndex < wordsInUse && (words[wordIndex] & (1 << bitIndex)) != 0;
    }

    // getRange(from:number, to:number):number {

    // }

    clear(bitIndex?: number): number {
        if (bitIndex === null) {
            const words = this.words_;
            let wordsInUse = words.length;
            while (wordsInUse > 0) {
                words[--wordsInUse] = 0;
            }
            return;
        }

        const wordIndex = bitIndex >> ADDRESS_BITS_PER_WORD;
        this.words_[wordIndex] &= ~(1 << bitIndex);
    }

    // flip(from?:number, to?:number):number {

    // }

    // nextClearBit(fromIndex:number) {

    // }

    // nextSetBit(fromIndex:number) {

    // }
}
