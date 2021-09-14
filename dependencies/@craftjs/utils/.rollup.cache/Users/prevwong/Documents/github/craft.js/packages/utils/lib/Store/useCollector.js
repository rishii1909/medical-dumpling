import { useState, useEffect, useMemo, useRef } from 'react';
export function useCollector(store, collector) {
    const [collected, setCollected] = useState(collector ? collector(store.getState()) : {});
    const collectorRef = useRef(collector);
    collectorRef.current = collector;
    const unsubscribe = useMemo(() => {
        const { current: collector } = collectorRef;
        if (!collector) {
            return;
        }
        return store.subscribe(collectorRef.current, (collected) => setCollected(collected));
    }, [store]);
    // Collect state on state change
    useEffect(() => {
        return () => {
            if (!unsubscribe) {
                return;
            }
            unsubscribe();
        };
    }, [unsubscribe]);
    return collected;
}
//# sourceMappingURL=useCollector.js.map