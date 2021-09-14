import { Patch } from 'immer';
export declare class Store<S = any> {
    private subscribers;
    private state;
    constructor(initialState: S);
    subscribe<C>(collector: (state: S) => C, onChange: (collected: C) => void, init?: boolean): () => void;
    getState(): S;
    setState(setter: (state: S) => void, opts?: Partial<{
        onPatch: (patches: Patch[], inversePatches: Patch[]) => void;
    }>): void;
    private notify;
}
export declare type StateForStore<S extends Store> = S extends Store<infer I> ? I : never;
