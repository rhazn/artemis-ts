import {Bag} from "./../utils/Bag";
import {PooledComponent} from "./PooledComponent";
import {ComponentType} from "./ComponentType";
export class ComponentPool {
    private pools: Bag<Pool>;

    constructor() {
        this.pools = new Bag<Pool>();
    }

    obtain<T extends PooledComponent>(componentClass, type: ComponentType): T {
        const pool: Pool = this.getPool(type.getIndex());
        return <T>(pool.size() > 0 ? pool.obtain() : new componentClass());
    }

    free(c: PooledComponent, type: ComponentType) {
        this.freeByIndex(c, type.getIndex());
    }

    freeByIndex(c: PooledComponent, typeIndex: number) {
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

class Pool {
    private cache: Bag<PooledComponent> = new Bag<PooledComponent>();

    obtain<T extends PooledComponent>(): T {
        return <T>this.cache.removeLast();
    }

    size(): number {
        return this.cache.size();
    }

    free(component: PooledComponent) {
        this.cache.add(component);
    }
}
