import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {sendBotReply, pushMessage} from '../ducks/chatDuck';

export class ChatService extends Service {
    selector = (state: IModel) => ({
        reply: state.chat.conversation.map((reply) => {
            return {
                url: reply.url,
                name: reply.username,
                text: reply.replyText,
                time: reply.timestamp.getHours() + ' ' + reply.timestamp.getMinutes(),
                me: reply.sender === 1
            }
        })
    });
    actions = {
        sendReply: () => sendBotReply.payload({ query: { text: "" } }),
        pushReply: (text) => pushMessage.payload({ text: text })
    }
}

var chatService = new ChatService();

export default chatService;