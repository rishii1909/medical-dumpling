import { Connector } from './interfaces';
declare type ConnectorToRegister = {
    name: string;
    required: any;
    options?: Record<string, any>;
    connector: Connector;
};
declare type RegisteredConnector = {
    required: any;
    enable: () => void;
    disable: () => void;
};
/**
 * Stores all connected DOM elements and their connectors here
 * This allows us to easily enable/disable and perform cleanups
 */
export declare class ConnectorRegistry {
    private elementIdMap;
    private registry;
    private getElementId;
    private getConnectorId;
    register(element: HTMLElement, toRegister: ConnectorToRegister): void;
    get(element: HTMLElement, name: string): RegisteredConnector;
    enable(): void;
    disable(): void;
    clear(): void;
}
export {};
