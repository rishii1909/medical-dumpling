import { ConnectorRegistry } from './ConnectorRegistry';
import { EventHandlerUpdates, } from './interfaces';
import { isEventBlockedByDescendant } from './isEventBlockedByDescendant';
export class EventHandlers {
    constructor(options) {
        this.registry = new ConnectorRegistry();
        this.subscribers = new Set();
        this.options = options;
    }
    listen(cb) {
        this.subscribers.add(cb);
        return () => this.subscribers.delete(cb);
    }
    disable() {
        this.registry.disable();
        this.subscribers.forEach((listener) => {
            listener(EventHandlerUpdates.HandlerDisabled);
        });
    }
    enable() {
        this.registry.enable();
        this.subscribers.forEach((listener) => {
            listener(EventHandlerUpdates.HandlerEnabled);
        });
    }
    cleanup() {
        this.disable();
        this.subscribers.clear();
        this.registry.clear();
    }
    addCraftEventListener(el, eventName, listener, options) {
        const bindedListener = (e) => {
            if (!isEventBlockedByDescendant(e, eventName, el)) {
                e.craft.stopPropagation = () => {
                    if (!e.craft.blockedEvents[eventName]) {
                        e.craft.blockedEvents[eventName] = [];
                    }
                    e.craft.blockedEvents[eventName].push(el);
                };
                listener(e);
            }
        };
        el.addEventListener(eventName, bindedListener, options);
        return () => el.removeEventListener(eventName, bindedListener, options);
    }
    get connectors() {
        const connectors = this.handlers();
        return Object.keys(connectors).reduce((accum, connectorName) => ({
            ...accum,
            [connectorName]: (el, required, options) => {
                this.registry.register(el, {
                    required,
                    name: connectorName,
                    options,
                    connector: connectors[connectorName],
                });
                return el;
            },
        }), {});
    }
    derive(type, opts) {
        return new type(this, opts);
    }
    // This method allows us to execute multiple connectors and returns a single cleanup method for all of them
    createProxyHandlers(instance, cb) {
        const connectorsToCleanup = [];
        const handlers = instance.handlers();
        const proxiedHandlers = new Proxy(handlers, {
            get: (target, key, receiver) => {
                if (key in handlers === false) {
                    return Reflect.get(target, key, receiver);
                }
                return (el, ...args) => {
                    const cleanup = handlers[key](el, ...args);
                    if (!cleanup) {
                        return;
                    }
                    connectorsToCleanup.push(cleanup);
                };
            },
        });
        cb(proxiedHandlers);
        return () => {
            connectorsToCleanup.forEach((cleanup) => {
                cleanup();
            });
        };
    }
    // This lets us to execute and cleanup sibling connectors
    reflect(cb) {
        return this.createProxyHandlers(this, cb);
    }
}
//# sourceMappingURL=EventHandlers.js.map