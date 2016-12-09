import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {sendBotReply, pushMessage,ISendMessageRequestPayload} from '../ducks/chatDuck';

export class ChatService extends Service {
    selector = (state: IModel) => ({
        reply: state.chat.conversation.map((reply) => {
            return {
                url: reply.url,
                id: reply.id,
                name: reply.username,
                text: reply.replyText,
                time: reply.timestamp.getHours() + ':' +  (reply.timestamp.getMinutes()<10?'0':'') + reply.timestamp.getMinutes(),
                me: reply.sender === 1,
                buttons:  reply.buttons.map(function(btn){
                    return {title: btn.text, value: btn.value, selected: btn.selected}
                })
            }
        })
    });
    actions = {
        sendReply: () => sendBotReply.payload({
            data: undefined, options: undefined, template: undefined,directSend: false 
        }),
        sendButton: (value)=>sendBotReply.payload({
            data: {text: value, from: undefined,type:"message"}, options: undefined, template: undefined,directSend: true 
        }),
        pushReply: (text) => pushMessage.payload({ text: text })
    }
}

var chatService = new ChatService();

export default chatService;