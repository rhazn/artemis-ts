import {BlackBoard} from "./BlackBoard";
import {TriggerStateType} from "./TriggerStateType";

export abstract class Trigger {
    /** Occurs when [on fire]. */
    //private onFire:(t:Trigger)=>void;
    protected onFire: any;

    /** Gets the blackboard. */
    public blackboard: BlackBoard;

    /** Gets the state of the trigger. */
    public triggerStateType: TriggerStateType;

    /** Gets or sets the entityWorld properties monitored. */
    public worldPropertiesMonitored: Array<string>;

    /** Gets or sets a value indicating whether this instance is fired. */
    public isFired: boolean;

    /**
     * Initializes a new instance of the Trigger class
     * @param propertyName Name of the property.
     */
    constructor(propertyName) {
        this.isFired = false;
        this.worldPropertiesMonitored = [].concat(propertyName);
    }

    /**
     * Removes the this trigger.
     */
    public removeThisTrigger() {
        this.blackboard.removeTrigger(this);
    }

    /**
     * Fires the specified trigger state.
     * @param triggerStateType
     */
    public fire(triggerStateType: TriggerStateType) {
        this.isFired = true;
        this.triggerStateType = triggerStateType;
        if (this.checkConditionToFire()) {
            this.calledOnFire(triggerStateType);
            if (this.onFire !== null) {
                this.onFire(this);
            }
        }
        this.isFired = false;
    }

    /**
     * Called if is fired.
     * @param triggerStateType  State of the trigger.
     */
    protected abstract calledOnFire(triggerStateType: TriggerStateType);

    /**
     * Checks the condition to fire.
     * @returns {boolean} if XXXX, false otherwise
     */
    protected checkConditionToFire(): boolean {
        return true;
    }
}
