import {Bag} from "./../utils/Bag";
import {PooledComponent} from "./PooledComponent";
import {ComponentType} from "./ComponentType";

class Pool {
    private cache: Bag<PooledComponent> = new Bag<PooledComponent>();

    obtain<T extends PooledComponent>(): T {
        return this.cache.removeLast() as T;
    }

    size(): number {
        return this.cache.size();
    }

    free(component: PooledComponent): void {
        this.cache.add(component);
    }
}

export class ComponentPool {
    private pools: Bag<Pool>;

    constructor() {
        this.pools = new Bag<Pool>();
    }

    obtain<T extends PooledComponent>(componentClass, type: ComponentType): T {
        const pool: Pool = this.getPool(type.getIndex());
        return (pool.size() > 0 ? pool.obtain() : new componentClass()) as T;
    }

    free(c: PooledComponent, type: ComponentType): void {
        this.freeByIndex(c, type.getIndex());
    }

    freeByIndex(c: PooledComponent, typeIndex: number): void {
        c.reset();
        this.getPool(typeIndex).free(c);
    }

    private getPool<T extends PooledComponent>(typeIndex: number): Pool {
        let pool: Pool = this.pools.safeGet(typeIndex);
        if (pool == null) {
            pool = new Pool();
            this.pools.set(typeIndex, pool);
        }
        return pool;
    }
}
