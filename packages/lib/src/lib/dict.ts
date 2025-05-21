export class Dict<K, V> extends Map<K, V> {
    private list: [K, V][] = [];

    public constructor(init?: [K, V][] | Dict<K, V>) {
        super(init);
        this.list = [];
        if (Array.isArray(init)) this.list = init;
        if (init instanceof Dict) this.list = Array.from(init.entries());
    }

    public set(key: K, value: V): this {
        super.set(key, value);
        this.list = (this.list ?? []).concat([[key, value]]);
        return this;
    }

    public remove(key: K) {
        super.delete(key);
        this.list = Array.from(this.entries()) ?? [];
        return this;
    }

    public map(callback: (v: V, i: number) => any) {
        return this.list.map((x, i): any => callback(x[1], i));
    }

    public clone(fn?: (dict: Dict<K, V>) => Dict<K, V>) {
        const clone = new Dict(this);
        if (fn) return fn(clone);
        return clone;
    }

    public static from<T>(items: T[], selector: (t: T) => any) {
        return new Dict(items.map((x) => [selector(x), x]));
    }

    public static unique<T>(items: T[], selector: (t: T) => any) {
        return Array.from(Dict.from(items, selector).values());
    }

    public toArray() {
        return Array.from(this.values());
    }
}
