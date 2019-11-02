export class TrigLUT {

    public static sin(rad:number):number {
        return TrigLUT.sin_[(rad * TrigLUT.radToIndex) & TrigLUT.SIN_MASK];
    }

    public static cos(rad:number):number {
        return TrigLUT.cos_[(rad * TrigLUT.radToIndex) & TrigLUT.SIN_MASK];
    }

    public static sinDeg(deg:number):number {
        return TrigLUT.sin_[(deg * TrigLUT.degToIndex) & TrigLUT.SIN_MASK];
    }

    public static cosDeg(deg:number):number {
        return TrigLUT.cos_[(deg * TrigLUT.degToIndex) & TrigLUT.SIN_MASK];
    }

    private static RAD:number;
    private static DEG:number;
    private static SIN_BITS:number;
    private static SIN_MASK:number;
    private static SIN_COUNT:number;
    private static radFull:number;
    private static radToIndex:number;
    private static degFull:number;
    private static degToIndex:number;
    private static sin_:number[];
    private static cos_:number[];

    static init(update:boolean) {
        TrigLUT.RAD = Math.PI / 180.0;
        TrigLUT.DEG = 180.0 / Math.PI;

        TrigLUT.SIN_BITS = 12;
        TrigLUT.SIN_MASK = ~(-1 << TrigLUT.SIN_BITS);
        TrigLUT.SIN_COUNT = TrigLUT.SIN_MASK + 1;

        TrigLUT.radFull = (Math.PI * 2.0);
        TrigLUT.degFull = (360.0);
        TrigLUT.radToIndex = TrigLUT.SIN_COUNT / TrigLUT.radFull;
        TrigLUT.degToIndex = TrigLUT.SIN_COUNT / TrigLUT.degFull;

        TrigLUT.sin_ = new Array(TrigLUT.SIN_COUNT);
        TrigLUT.cos_ = new Array(TrigLUT.SIN_COUNT);

        for (var i = 0; i < TrigLUT.SIN_COUNT; i++) {
            TrigLUT.sin_[i] = Math.sin((i + 0.5) / TrigLUT.SIN_COUNT * TrigLUT.radFull);
            TrigLUT.cos_[i] = Math.cos((i + 0.5) / TrigLUT.SIN_COUNT * TrigLUT.radFull);
        }

        if (update) {
            Math.sin = TrigLUT.sin;
            Math.cos = TrigLUT.cos;
        }
    }
}