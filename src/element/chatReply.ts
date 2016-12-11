import { Element } from 'corky/tags/element';
import template from '../template';


@template("chat-reply", null)
export abstract class ChatReply extends Element {
    url: string;
    name: string;
    text: string;
    time: string;
    id:string;
    me:boolean;
    buttons: Array<{title: string, value: string, selected: boolean}>

    abstract sendButton(value: string);

    constructor(opts){
        super(); 
        this.url = opts.url;
        this.name = opts.name;
        this.text = opts.text;
        this.time = opts.time;
        this.id = opts.id;
        this.me = opts.me;
        this.buttons = opts.buttons;
      
    }
    sendReply(text){
        return function(e){
            if(this.buttons.filter(function(button){
                return button.selected === true;
            }).lenght >0 ) return;
            
            console.log(e.target.style.backgroundColor,e.target.style.color);
            this.sendButton(text+"{" + this.id + "}"); 
        } 
    }

}