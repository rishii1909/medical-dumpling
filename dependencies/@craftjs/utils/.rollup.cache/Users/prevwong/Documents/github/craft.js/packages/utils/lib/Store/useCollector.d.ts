import { Store, StateForStore } from './Store';
export declare function useCollector<S extends Store, C = null>(store: S, collector?: (state: StateForStore<S>) => C): C extends null ? {} : C;
