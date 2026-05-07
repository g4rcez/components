export class Dict<K, V> extends Map<K, V> {
    public remove(key: K) {
        super.delete(key);
        return this;
    }

    public map(callback: (v: V, i: number) => any) {
        let i = 0;
        const out: any[] = [];
        for (const v of this.values()) out.push(callback(v, i++));
        return out;
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
