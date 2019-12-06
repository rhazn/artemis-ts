import {Component} from "./Component";
/**
 * Component type that recycles instances.
 * <p>
 * Expects no <code>final</code> fields.
 */
export class PooledComponent extends Component {
    public initialize(): void {}
    public reset(): void {}
}
