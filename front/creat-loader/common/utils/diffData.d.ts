import { DiffNodesRes, DiffStateRes, LocalData, NodeArray, State } from '../../types';
export declare function isEqual(oldData: any, nowData: any): boolean;
export declare function getDiffData(oldData: LocalData, nowData: LocalData): {
    type: string;
    nodes?: undefined;
} | {
    type: string;
    nodes: any[];
} | undefined;
export declare function parseDiffNodes(oldNodes: NodeArray, { type, nodes }: DiffNodesRes): NodeArray;
export declare function getDiffState(oldData: LocalData, nowData: LocalData): {
    type: string;
    state: any;
} | undefined;
export declare function parseDiffState(oldState: State, { state }: DiffStateRes): State;
