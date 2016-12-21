import Flux from 'corky/flux';
import {clientSecret} from '../config';
import {app} from '../main';
import {loginUser, logoutUser, readStorage} from './appDuck';


export interface IConversationStartResponse{
    conversationId: string, 
    token: string,
    expires_in: any
}
export interface IMessageActivity{
    content: {
        title: string,
        subtitle: string,
        buttons: Array<{
            title: string,
            value: string
        }>
    }
}
export interface IReceiveBotMessage {
    conversation:{
        id: string
    },
    timestamp: string,
    id: string,
    text: string,
    from: {
        id: string
    },
    created: string,
    attachments: Array<IMessageActivity>
}
export interface IConversationMessagesResonse{
  activities: Array<IReceiveBotMessage>,
  watermark:string
}
export interface IRefreshTokenRequestPayload{template:{conversationId: string}}

export interface ISendMessageRequestPayload{
    data:{    
        type: string,
        from: {
            id: string
        },
        text: string,    
    },
    options: any,
    template:{conversationId: string},
    directSend:boolean

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
    id: string,
    sender: ReplySender,
    alreadySent: boolean,
    buttons: Array<{
        value:string,
        text: string,
        selected:boolean
    }>
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

export const startConversation = new Flux.RequestAction<{},IConversationStartResponse>("START_CONVERSATION","https://directline.botframework.com/v3/directline/conversations","POST");
export const refreshToken = new Flux.RequestAction<IRefreshTokenRequestPayload, string>("REFRESH_TOKEN","https://directline.botframework.com/v3/directline/tokens/refresh","POST");

export const pushMessage = new Flux.Action<{ text: string }>("SEND_MESSAGE");
export const sendBotReply = new Flux.RequestAction<ISendMessageRequestPayload, any>("SEND_BOT_REPLY", "https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities", "POST");
export const getChatMessages = new Flux.RequestAction<{query: {watermark: string}}, IConversationMessagesResonse>("GET_CHAT","https://directline.botframework.com/v3/directline/conversations/{conversationId}/activities","GET");

export var chatReducer = new Flux.Reducer<IChatState>([
    {
        action:logoutUser,
        reduce:(state: IChatState, payload:any)=>{
            state = initialChat;
        }
    },
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
               payload.activities.filter((item) => {
                   return item.from.id === "Movie_Bot";
               }).forEach((value) => {
                   var attachments;
                   console.log(value.attachments)
                   if(value.attachments !== undefined && value.attachments.length > 0 )
                        attachments = value.attachments[0].content.buttons.map(function(option){ 
                                return {text: option.title, value: option.value, selected: false} 
                        });
                   else
                        attachments = [];
                   var message : IChatReply = {
                        url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
                        username: value.from.id,
                        replyText: value.text,
                        timestamp: new Date(value.timestamp),
                        sender: ReplySender.Bot,
                        alreadySent: true,
                        id: value.id,
                        buttons: attachments
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
                replyText: payload.text.trim(),
                timestamp: new Date(),
                sender: ReplySender.User,
                alreadySent: false,
                id: "usermessage",
                buttons: []
            });

            return state;
        }
    },
    {
        action: sendBotReply.request,
        reduce: (state: IChatState, payload: ISendMessageRequestPayload) => {

            var selectedText = "";
            if(payload.directSend === false)
            selectedText = state.conversation.filter((reply) => {
                                                        return reply.alreadySent === false && reply.sender === ReplySender.User;
                                                    })
                                                    .reduce((message, reply) => {
                                                        reply.alreadySent = true;
                                                        return message + " " + reply.replyText;
                                                    }, "");
            else
            {
                    selectedText = payload.data.text.split('{')[0];
                    var id = payload.data.text.split('{')[1].replace('}',"");
                    state.conversation.filter(function(item){
                        return item.id === id;
                    })[0].buttons.filter(function(button){
                        return button.value === selectedText;
                    })[0].selected = true;
            }
            
            payload.data.from =  {id:state.username};
            payload.data.text = selectedText.trim();
            payload.data.type = "message";
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
                replyText: "There was an error senging the request, what do you wish to do?" ,
                timestamp: new Date(),
                sender: ReplySender.Bot,
                alreadySent: true,
                id: "idofthebot",
                buttons: [{
                    text:"Nothing",
                    value: "send A",
                    selected: false
                },
                {
                    text:"More nothing",
                    value: "send B",
                    selected:false
                }
                ]
            });
            console.log("Payload : " +  payload)
            return state;
        }
    }

], initialChat);

function setTimeoutForToken(state){
    if(state.conversationId !== undefined)
    setTimeout(function(k){
                  /* app.dispatch(refreshToken.payload({                      
                           template :
                           { conversationId: state.conversationId}
                        
                   }));*/
               }
    ,state.tokenExpires - 3*60);
}
