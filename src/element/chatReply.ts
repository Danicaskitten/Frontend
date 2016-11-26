import { Element } from 'corky/tags/element';
import template from '../template';


@template("chat-reply", null)
export abstract class ChatReply extends Element {
    url: string;
    name: string;
    text: string;
    time: string;
    me:boolean;

    constructor(opts){
        super(); 
        this.url = opts.url;
        this.name = opts.name;
        this.text = opts.text;
        this.time = opts.time;
        this.me = opts.me;
        
        this.on('update', function(){
            var chatElement = document.getElementsByTagName("chat")[0];
            if(chatElement !== undefined)
            chatElement.scrollTop = chatElement.scrollHeight;
        }.bind(this));
    }
}