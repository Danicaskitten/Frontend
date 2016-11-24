import Flux from 'corky/flux';

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
    conversation: Array<IChatReply>
};

var initialChat: IChatState = {
    conversation: [{
        url: "https://api.adorable.io/avatars/face/eyes5/nose7/mouth3/47B39D",
        username: "Danica",
        replyText: "why hello there, when are the Avengers?",
        timestamp: new Date(),
        sender: ReplySender.User,
        alreadySent: true
    },
        {
            url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
            username: "Movie Bot",
            replyText: "Could you please try to watch something else?",
            timestamp: new Date(),
            sender: ReplySender.Bot,
            alreadySent: true
        }
    ]
}

export const pushMessage = new Flux.Action<{ text: string }>("SEND_MESSAGE");
export const sendBotReply = new Flux.RequestAction<{ query: { text: string } }, any>("SEND_BOT_REPLY", "{API-FOR-THE-BOT}", "GET");


export var chatReducer = new Flux.Reducer<IChatState>([
    {
        action: pushMessage,
        reduce: (state: IChatState, payload: { text: string }) => {
            state.conversation.push({
                url: "https://api.adorable.io/avatars/face/eyes5/nose7/mouth3/47B39D",
                username: "Danica",
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
        reduce: (state: IChatState, payload: { query: { text: string } }) => {
            var selectedText = state.conversation.filter((reply) => {
                return reply.alreadySent === false && reply.sender === ReplySender.User;
            }).reduce((message, reply) => {
                reply.alreadySent = true;
                return message + " " + reply.replyText;
            }, "");
            payload.query.text = selectedText;
            return state;
        }
    },
    {
        action: sendBotReply.response,
        reduce: (state: IChatState, payload: any) => {
            state.conversation.push({
                url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
                username: "Movie Bot",
                replyText: "GO AWAY",
                timestamp: new Date(),
                sender: ReplySender.Bot,
                alreadySent: true
            });

            return state;
        }
    },
    {
        action: sendBotReply.error,
        reduce: (state: IChatState, payload: any) => {
            state.conversation.push({
                url: "https://api.adorable.io/avatars/face/eyes1/nose1/mouth6/B05F6D",
                username: "Movie Bot",
                replyText: "You sent: " + decodeURI(payload.url.split('?')[1]),
                timestamp: new Date(),
                sender: ReplySender.Bot,
                alreadySent: true
            });

            return state;
        }
    }

], initialChat);