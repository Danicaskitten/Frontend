import { IAction, Action } from 'corky/flux/action';
import { IAsyncAction } from 'corky/flux/asyncAction';
import { RequestAction } from 'corky/flux/requestAction';

export interface IConditionalPayload {
    data?: Object,
     query?: Object, 
     url?: string, 
     requestType?: string, 
     template?: Object, 
     options?: Object ,
     payload2?:Object
}

export declare class ConditionalRequestAction<Payload extends IConditionalPayload, Respone> implements IAction<Payload>, IAsyncAction<Payload, Respone> {

    constructor(type: string, url: string, requestType: string,
     requestAction: RequestAction<IConditionalPayload, Respone>,
      callback: any, options?: any);

    request: Action<Payload>;

    response: Action<Respone>;

    error: Action<Error>;

    payload(payload: Payload);
}