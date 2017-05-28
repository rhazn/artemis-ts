export class Timer {

    private delay:number;
    private repeat:boolean;
    private acc:number;
    private done:boolean;
    private stopped:boolean;

    constructor(delay:number, repeat:boolean = false) {
        this.delay = delay;
        this.repeat = repeat;
        this.acc = 0;
    }

    public update(delta:number) {
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

    public reset() {
        this.stopped = false;
        this.done = false;
        this.acc = 0;
    }

    public isDone():boolean {
        return this.done;
    }

    public isRunning():boolean {
        return !this.done && this.acc < this.delay && !this.stopped;
    }

    public stop() {
        this.stopped = true;
    }

    public setDelay(delay:number) {
        this.delay = delay;
    }

    public execute = () => {
    };

    public getPercentageRemaining():number {
        if (this.done)
            return 100;
        else if (this.stopped)
            return 0;
        else
            return 1 - (this.delay - this.acc) / this.delay;
    }

    public getDelay():number {
        return this.delay;
    }
}

