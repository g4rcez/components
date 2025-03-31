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

    public map(callback: (v: V) => any) {
        return this.list.map((x): any => callback(x[1]));
    }

    public clone(fn?: (dict: Dict<K,V>) => Dict<K,V>) {
        const clone = new Dict(this);
        if (fn) return fn(clone);
        return clone
    }
}
