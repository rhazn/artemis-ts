export interface Map<K, V> {
    clear(): void;
    containsKey(key): boolean;
    containsValue(value): boolean;
    get(key): V;
    isEmpty(): boolean;
    put(key, value): void;
    remove(key): V;
    size(): number;
    values(): V[];
}
