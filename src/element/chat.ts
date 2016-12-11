import { Element } from 'corky/tags/element';
import template from '../template';
import chatService from '../service/chatService';


@template("chat", chatService)
export abstract class Chat extends Element {

    reply: Array<{
          url: string,
          name: string,
          text: string,
          time: string,
          me: boolean,
          buttons: Array<{title: string, value: string, selected: boolean}>
    }>;
    static arrayCount = 0;
    constructor(){
        super();
        this.on('update',function(){
            if(this.reply.length > this.arrayCount)
            console.log("IN BABAY")
                this.scrollToBottom();
                this.arrayCount = this.reply.length;
        } )
    }

    scrollToBottom(){
             var chatElement = document.getElementsByTagName("chat")[0];
             if(chatElement !== undefined)
             chatElement.scrollTop = chatElement.scrollHeight;
    }

}