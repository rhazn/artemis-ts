import {EntitySystem} from "./../core/EntitySystem";
import {Aspect} from "./../core/Aspect";
/**
 * A system that processes entities at a interval in milliseconds.
 * A typical usage would be a collision system or physics system.
 *
 * @author Arni Arent
 *
 */
export abstract class IntervalEntitySystem extends EntitySystem {
    private acc_ = 0;
    private interval_ = 0;

    constructor(aspect: Aspect, interval: number) {
        super(aspect);
        this.interval_ = interval;
    }

    protected checkProcessing(): boolean {
        if ((this.acc_ += this.world.getDelta()) >= this.interval_) {
            this.acc_ -= this.interval_;
            return true;
        }
        return false;
    }
}
