import { CoreEventHandlers } from './CoreEventHandlers';
import { Indicator, NodeId, NodeTree } from '../interfaces';
import { CraftDOMEvent } from '../utils/Handlers';
export * from '../utils/Handlers';
declare type DraggedElement = NodeId | NodeTree;
/**
 * Specifies Editor-wide event handlers and connectors
 */
export declare class DefaultEventHandlers extends CoreEventHandlers {
    static draggedElementShadow: HTMLElement;
    static draggedElement: DraggedElement;
    static indicator: Indicator;
    defineNodeEventListener(eventName: string, handler: (e: CraftDOMEvent<Event>, id: NodeId) => void, capture?: boolean): [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean];
    handlers(): {
        connect: {
            init: (el: any, id: any) => void;
        };
        select: {
            init: () => () => void;
            events: [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean][];
        };
        hover: {
            init: () => () => void;
            events: [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean][];
        };
        drop: {
            events: [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean][];
        };
        drag: {
            init: (el: any, id: any) => () => void;
            events: [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean][];
        };
        create: {
            init: (el: any) => () => any;
            events: [string, (e: CraftDOMEvent<Event>, opts: any) => void, boolean][];
        };
    };
    private dropElement;
}
