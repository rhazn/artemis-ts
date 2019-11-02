export class MathUtils {

    public static nextBool() {
        return ((~~(Math.random() * 32767)) & 1) === 1;
    }

    /*
     * Generates a random real value from 0.0, inclusive, to 1.0, exclusive.
     */

    public static nextDouble() {
        return Math.random();
    }

    /*
     * Generates a random int value from 0, inclusive, to max, exclusive.
     */

    public static nextInt(max) {
        return ~~(Math.random() * max);
    }


    public static random(start, end?) {
        if (end === undefined) {
            return MathUtils.nextInt(start + 1);
        } else if (parseInt(start) === parseFloat(start) && parseInt(end) === parseFloat(end)) {
            return start + MathUtils.nextInt(end - start + 1);
        } else {
            return start + MathUtils.nextDouble() * (end - start);
        }
    }
}
