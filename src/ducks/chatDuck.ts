import Flux from 'corky/flux';
import {clientSecret} from '../config';
import {app} from '../main';
import {loginUser, readStorage} from './appDuck';


export interface IConversationStartResponse{
    conversationId: string, 
    token: string,
    expires_in: any
}
export interface IReceiveBotMessage {
    conversation: string,
    id: string,
    text: string,
    from: string,
    created: string
  }
export interface IConversationMessagesResonse{
  messages: Array<IReceiveBotMessage>,
  watermark:string
}
export interface IRefreshTokenRequestPayload{template:{conversationId: string}}
export interface ISendMessageRequestPayload{
    data:{    
        conversationId: string,
        created: Date,
        from: string,
        text: string,    
    },
    options: any,
    template:{conversationId: string}

}

export enum ReplySender {
    Bot,
    User
}

export interface IChatReply {
    url: string,
    username: string,
    replyText: string,
    timestamp: Date,
    sender: ReplySender,
    alreadySent: boolean
};

export interface IChatState {
    conversation: Array<IChatReply>,
    tokenExpires: number,
    token:string,
    conversationId: string,
    username: string,
    watermark: string
};

var initialChat: IChatState = {
    conversation: [],
    conversationId: undefined,
    tokenExpires: 0,
    username: undefined,
    token: undefined,
    watermark: undefined
}

export const startConversation = new Flux.RequestAction<{},IConversationStartResponse>("START_CONVERSATION","https://directline.botframework.com/api/conversations","POST");
export const refreshToken = new Flux.RequestAction<IRefreshTokenRequestPayload, string>("START_CONVERSATION","https://directline.botframework.com/api/tokens/{conversationId}/renew","GET");

export const pushMessage = new Flux.Action<{ text: string }>("SEND_MESSAGE");
export const sendBotReply = new Flux.RequestAction<ISendMessageRequestPayload, any>("SEND_BOT_REPLY", "https://directline.botframework.com/api/conversations/{conversationId}/messages", "POST");
export const getChatMessages = new Flux.RequestAction<{query: {watermark: string}}, IConversationMessagesResonse>("GET_CHAT","https://directline.botframework.com/api/conversations/{conversationId}/messages","GET");

export var chatReducer = new Flux.Reducer<IChatState>([
    {
        action:readStorage,
        reduce:(state: IChatState, payload:any)=>{
            state.username = localStorage.getItem("user");
        }
    },
    {
        action: getChatMessages.request,
        reduce:(state: IChatState, payload: any) =>{
            if(state.watermark === undefined)
            {
                payload.query = {};
            }
            else {
                payload.query.watermark = state.watermark;
            }
            payload.options = {};
            payload.template = { conversationId: state.conversationId};
            payload.options["Authorization"] = "Bearer " + clientSecret;
        }
    },
    {
        action: getChatMessages.response,
        reduce: (state: IChatState, payload: IConversationMessagesResonse)=> {
               state.watermark = payload.watermark;
               payload.messages.filter((item) => {
                   return item.from === "Movie_Bot";
               }).forEach((value) => {
                   var message : IChatReply = {
                        url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
                        username: value.from,
                        replyText: value.text,
                        timestamp: new Date(value.created),
                        sender: ReplySender.Bot,
                        alreadySent: true
                   }
                   state.conversation.push(message);
               });
        }
    },
    {
        action: startConversation.request,
        reduce:(state: IChatState, payload: any) =>{
             payload.options = {};
            payload.options["Authorization"] = "Bearer " + clientSecret;
        }
    },
    {
        action: startConversation.response,
        reduce: (state: IChatState, payload: IConversationStartResponse)=> {
               state.conversationId = payload.conversationId;
               state.token = payload.token;
               state.tokenExpires = 1800;
               setTimeoutForToken(state);
        }
    },
    {
        action: refreshToken.request,
        reduce: (state: IChatState, payload: any) => {
            payload.options = {};
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: refreshToken.response,
        reduce: (state: IChatState, payload: string) => {
            state.token = payload;
            state.tokenExpires = 1800;
            setTimeoutForToken(state);
        }
    },
    {
        action: loginUser.response,
        reduce: (state: IChatState, payload: {userName:string}) => {
            state.username = payload.userName;
        }
    },
    {
        action: pushMessage,
        reduce: (state: IChatState, payload: { text: string }) => {
            state.conversation.push({
                url: "https://api.adorable.io/avatars/face/eyes5/nose7/mouth3/47B39D",
                username: state.username,
                replyText: payload.text,
                timestamp: new Date(),
                sender: ReplySender.User,
                alreadySent: false
            });

            return state;
        }
    },
    {
        action: sendBotReply.request,
        reduce: (state: IChatState, payload: ISendMessageRequestPayload) => {
            var selectedText = state.conversation.filter((reply) => {
                                                        return reply.alreadySent === false && reply.sender === ReplySender.User;
                                                    })
                                                    .reduce((message, reply) => {
                                                        reply.alreadySent = true;
                                                        return message + " " + reply.replyText;
                                                    }, "");
            payload.data.conversationId = state.conversationId;
            payload.data.created = new Date();
            payload.data.from =  state.username;
            payload.data.text = selectedText;

            payload.template = { conversationId: state.conversationId};
            payload.options = {};
            payload.options["Content-Type"] = "application/json";
            payload.options["Authorization"] = "Bearer " + state.token;
            return state;
        }
    },
    {
        action: sendBotReply.response,
        reduce: (state: IChatState, payload: any) => {
           console.log("Succeded in sending")

            return state;
        }
    },
    {
        action: sendBotReply.error,
        reduce: (state: IChatState, payload: any) => {
            state.conversation.push({
                url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
                username: "Movie Bot",
                replyText: "There was an error senging the request" ,
                timestamp: new Date(),
                sender: ReplySender.Bot,
                alreadySent: true
            });
            console.log("Payload : " +  payload)
            return state;
        }
    }

], initialChat);

function setTimeoutForToken(state){
    if(state.conversationId !== undefined)
    setTimeout(function(k){
                   app.dispatch(refreshToken.payload({                      
                           template :
                           { conversationId: state.conversationId}
                        
                   }));
               }
    ,state.tokenExpires - 3*60);
}
