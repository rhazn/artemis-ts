export class Timer {
    private delay: number;
    private repeat: boolean;
    private acc: number;
    private done: boolean;
    private stopped: boolean;

    constructor(delay: number, repeat = false) {
        this.delay = delay;
        this.repeat = repeat;
        this.acc = 0;
    }

    public update(delta: number): void {
        if (!this.done && !this.stopped) {
            this.acc += delta;

            if (this.acc >= this.delay) {
                this.acc -= this.delay;

                if (this.repeat) {
                    this.reset();
                } else {
                    this.done = true;
                }

                this.execute();
            }
        }
    }

    public reset(): void {
        this.stopped = false;
        this.done = false;
        this.acc = 0;
    }

    public isDone(): boolean {
        return this.done;
    }

    public isRunning(): boolean {
        return !this.done && this.acc < this.delay && !this.stopped;
    }

    public stop(): void {
        this.stopped = true;
    }

    public setDelay(delay: number): void {
        this.delay = delay;
    }

    public execute = (): void => {};

    public getPercentageRemaining(): number {
        if (this.done) return 100;
        else if (this.stopped) return 0;
        else return 1 - (this.delay - this.acc) / this.delay;
    }

    public getDelay(): number {
        return this.delay;
    }
}
