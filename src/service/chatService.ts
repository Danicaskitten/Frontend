import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {sendBotReply, pushMessage,ISendMessageRequestPayload} from '../ducks/chatDuck';

export class ChatService extends Service {
    selector = (state: IModel) => ({
        reply: state.chat.conversation.map((reply) => {
            return {
                url: reply.url,
                name: reply.username,
                text: reply.replyText,
                time: reply.timestamp.getHours() + ':' +  (reply.timestamp.getMinutes()<10?'0':'') + reply.timestamp.getMinutes(),
                me: reply.sender === 1
            }
        })
    });
    actions = {
        sendReply: () => sendBotReply.payload({
            data: undefined, options: undefined, template: undefined
        }),
        pushReply: (text) => pushMessage.payload({ text: text })
    }
}

var chatService = new ChatService();

export default chatService;