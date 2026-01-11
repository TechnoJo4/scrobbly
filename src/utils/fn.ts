export const by = <T, K>(arr: T[], f: (t: T) => K): Map<K, T[]> => {
    const m = new Map<K,T[]>();
    for (const t of arr) {
        const k = f(t);
        if (!m.has(k)) m.set(k, []);
        m.get(k)!.push(t);
    }
    return m;
};

export const by1 = <T, K>(arr: T[], f: (t: T) => K): Map<K, T> => {
    const m = new Map<K,T>();
    for (const t of arr) m.set(f(t), t);
    return m;
};

export const map = <T, K, U>(arr: T[], f: (t: T) => [K,U]): Map<K, U> => {
    const m = new Map<K,U>();
    for (const t of arr) m.set(...f(t));
    return m;
};
