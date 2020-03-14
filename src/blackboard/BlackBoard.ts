import {Trigger} from "./Trigger";
import {TriggerStateType} from "./TriggerStateType";
interface HashMap {
    [key: string]: any;
}

interface TriggerList {
    [key: string]: Array<Trigger>;
}

/**
 *
 */
export class BlackBoard {
    /** the intelligence. */
    private intelligence: HashMap;

    /** the triggers. */
    private triggers: TriggerList;

    /**
     * Initializes a new instance of the BlackBoard class
     */
    constructor() {
        this.intelligence = {};
        this.triggers = {};
    }

    /**
     * Adds the trigger.
     *
     * @param trigger   The trigger.
     * @param evaluateNow if set to true [evaluate now].
     */
    public addTrigger(trigger: Trigger, evaluateNow = false): void {
        trigger.blackboard = this;
        for (const i in trigger.worldPropertiesMonitored) {
            const intelName: string = trigger.worldPropertiesMonitored[i];
            // changed logic
            if (this.triggers[intelName]) {
                this.triggers[intelName].push(trigger);
            } else {
                this.triggers[intelName] = [trigger];
            }
        }

        if (evaluateNow) {
            if (trigger.isFired === false) {
                trigger.fire(TriggerStateType.TriggerAdded);
            }
        }
    }

    /**
     * Atomics the operate on entry.
     * @param operation The operation.
     */
    public atomicOperateOnEntry(operation: Function): void {
        operation(this);
    }

    /**
     * Gets the entry.
     *
     * @param name  The name.
     * @returns {T} The specified element.
     */
    getEntry<T>(name: string): T {
        return this.intelligence[name];
    }

    /**
     * Removes the entry.
     * @param name  The name.
     */
    removeEntry(name: string): void {
        if (this.intelligence[name]) {
            delete this.intelligence[name];
            if (this.triggers[name]) {
                for (const i in this.triggers[name]) {
                    const item = this.triggers[name][i];
                    if (item.isFired === false) {
                        item.fire(TriggerStateType.ValueRemoved);
                    }
                }
            }
        }
    }

    /**
     * Removes the trigger.
     * @param trigger The trigger.
     */
    removeTrigger(trigger: Trigger): void {
        for (const i in trigger.worldPropertiesMonitored) {
            const intelName = trigger.worldPropertiesMonitored[i];
            const t = this.triggers[intelName].indexOf(trigger);
            if (t !== -1) {
                this.triggers[intelName].slice(t, 1);
            }
        }
    }

    /**
     * Sets the entry.
     * @param name  The name.
     * @param intel The intel.
     */
    setEntry<T>(name: string, intel: T): void {
        const triggerStateType: TriggerStateType = this.intelligence[name]
            ? TriggerStateType.ValueChanged
            : TriggerStateType.ValueAdded;
        this.intelligence[name] = intel;

        if (this.triggers[name]) {
            for (const i in this.triggers[name]) {
                const item: Trigger = this.triggers[name][i];
                if (item.isFired === false) {
                    item.fire(triggerStateType);
                }
            }
        }
    }

    /**
     * Get a list of all related triggers.]
     *
     * @param name  The name.
     * @returns {Array<Trigger>}  List of appropriated triggers.
     */
    triggerList(name: string): Trigger[] {
        return this.triggers[name];
    }
}
