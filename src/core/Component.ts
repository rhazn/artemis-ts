/**
 * A tag class. All components in the system must extend this class.
 *
 * @author Arni Arent
 */
export abstract class Component {
    public abstract initialize(...args: any[]): void;
}
