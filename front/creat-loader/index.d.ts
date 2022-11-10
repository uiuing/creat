import { AppResponse, AppState } from './types';
export default function creatLoader(state: AppState): {
    mount: (mountEl: string | Object | HTMLElement) => AppResponse;
};
