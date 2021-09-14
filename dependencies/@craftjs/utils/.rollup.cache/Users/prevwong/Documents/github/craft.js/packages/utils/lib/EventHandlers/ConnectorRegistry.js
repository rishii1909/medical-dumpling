import isEqual from 'shallowequal';
import shortid from 'shortid';
/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
export class ConnectorRegistry {
    constructor() {
        this.elementIdMap = new WeakMap();
        this.registry = new Map();
    }
    getElementId(element) {
        const existingId = this.elementIdMap.get(element);
        if (existingId) {
            return existingId;
        }
        const newId = shortid();
        this.elementIdMap.set(element, newId);
        return newId;
    }
    getConnectorId(element, connectorName) {
        const elementId = this.getElementId(element);
        return `${connectorName}--${elementId}`;
    }
    register(element, toRegister) {
        if (this.get(element, toRegister.name)) {
            if (isEqual(toRegister.required, this.get(element, toRegister.name).required)) {
                return;
            }
            this.get(element, toRegister.name).disable();
        }
        let cleanup = null;
        this.registry.set(this.getConnectorId(element, toRegister.name), {
            required: toRegister.required,
            enable: () => {
                if (cleanup) {
                    cleanup();
                }
                cleanup = toRegister.connector(element, toRegister.required, toRegister.options);
            },
            disable: () => {
                if (!cleanup) {
                    return;
                }
                cleanup();
            },
        });
        this.registry.get(this.getConnectorId(element, toRegister.name)).enable();
    }
    get(element, name) {
        return this.registry.get(this.getConnectorId(element, name));
    }
    enable() {
        this.registry.forEach((connectors) => {
            connectors.enable();
        });
    }
    disable() {
        this.registry.forEach((connectors) => {
            connectors.disable();
        });
    }
    clear() {
        this.elementIdMap = new WeakMap();
        this.registry.clear();
    }
}
//# sourceMappingURL=ConnectorRegistry.js.map