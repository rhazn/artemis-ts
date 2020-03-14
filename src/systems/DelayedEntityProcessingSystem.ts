import {EntitySystem} from "./../core/EntitySystem";
import {Aspect} from "./../core/Aspect";
import {ImmutableBag} from "./../utils/ImmutableBag";
import {Entity} from "./../core/Entity";
/**
 * The purpose of this class is to allow systems to execute at varying intervals.
 *
 * An example system would be an ExpirationSystem, that deletes entities after a certain
 * lifetime. Instead of running a system that decrements a timeLeft value for each
 * entity, you can simply use this system to execute in a future at a time of the shortest
 * lived entity, and then reset the system to run at a time in a future at a time of the
 * shortest lived entity, etc.
 *
 * Another example system would be an AnimationSystem. You know when you have to animate
 * a certain entity, e.g. in 300 milliseconds. So you can set the system to run in 300 ms.
 * to perform the animation.
 *
 * This will save CPU cycles in some scenarios.
 *
 * Implementation notes:
 * In order to start the system you need to override the inserted(Entity e) method,
 * look up the delay time from that entity and offer it to the system by using the
 * offerDelay(float delay) method.
 * Also, when processing the entities you must also call offerDelay(float delay)
 * for all valid entities.
 *
 * @author Arni Arent
 *
 */
export abstract class DelayedEntityProcessingSystem extends EntitySystem {
    private delay_: number;
    private running_: boolean;
    private acc_: number;

    constructor(aspect: Aspect) {
        super(aspect);
    }

    protected processEntities(entities: ImmutableBag<Entity>): void {
        for (let i = 0, s = entities.size(); s > i; i++) {
            const entity: Entity = entities.get(i);
            this.processDelta(entity, this.acc_);
            const remaining: number = this.getRemainingDelay(entity);
            if (remaining <= 0) {
                this.processExpired(entity);
            } else {
                this.offerDelay(remaining);
            }
        }
        this.stop();
    }

    public inserted(e: Entity): void {
        const delay: number = this.getRemainingDelay(e);
        if (delay > 0) {
            this.offerDelay(delay);
        }
    }

    /**
     * Return the delay until this entity should be processed.
     *
     * @param e entity
     * @return delay
     */
    protected abstract getRemainingDelay(e: Entity): number;

    protected checkProcessing(): boolean {
        if (this.running_) {
            if ((this.acc_ += this.world.getDelta()) >= this.delay_) {
                return true;
            }
        }
        return false;
    }

    /**
     * Process a entity this system is interested in. Substract the accumulatedDelta
     * from the entities defined delay.
     *
     * @param e the entity to process.
     * @param accumulatedDelta the delta time since this system was last executed.
     */
    protected abstract processDelta(e: Entity, accumulatedDelta: number): void;

    protected abstract processExpired(e: Entity): void;

    /**
     * Start processing of entities after a certain amount of delta time.
     *
     * Cancels current delayed run and starts a new one.
     *
     * @param delta time delay until processing starts.
     */
    public restart(delay: number): void {
        this.delay_ = delay;
        this.acc_ = 0;
        this.running_ = true;
    }

    /**
     * Restarts the system only if the delay offered is shorter than the
     * time that the system is currently scheduled to execute at.
     *
     * If the system is already stopped (not running) then the offered
     * delay will be used to restart the system with no matter its value.
     *
     * If the system is already counting down, and the offered delay is
     * larger than the time remaining, the system will ignore it. If the
     * offered delay is shorter than the time remaining, the system will
     * restart itself to run at the offered delay.
     *
     * @param delay
     */
    public offerDelay(delay: number): void {
        if (!this.running_ || delay < this.getRemainingTimeUntilProcessing()) {
            this.restart(delay);
        }
    }

    /**
     * Get the initial delay that the system was ordered to process entities after.
     *
     * @return the originally set delay.
     */
    public getInitialTimeDelay(): number {
        return this.delay_;
    }

    /**
     * Get the time until the system is scheduled to run at.
     * Returns zero (0) if the system is not running.
     * Use isRunning() before checking this value.
     *
     * @return time when system will run at.
     */
    public getRemainingTimeUntilProcessing(): number {
        if (this.running_) {
            return this.delay_ - this.acc_;
        }
        return 0;
    }

    /**
     * Check if the system is counting down towards processing.
     *
     * @return true if it's counting down, false if it's not running.
     */
    public isRunning(): boolean {
        return this.running_;
    }

    /**
     * Stops the system from running, aborts current countdown.
     * Call offerDelay or restart to run it again.
     */
    public stop(): void {
        this.running_ = false;
        this.acc_ = 0;
    }
}
