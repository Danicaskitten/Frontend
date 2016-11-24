import { Element } from 'corky/tags/element';
import template from '../template';
import chatService from '../service/chatService';


@template("chat-view", chatService)
export abstract class Chat extends Element {
    abstract sendReply(); 
    abstract pushReply(text); 

    sendTimeout: any;

    sendReplyToBot(){
        var value = (<HTMLInputElement>document.getElementById("chat-reply")).value;
        if(value.trim().length > 0){
            this.pushReply(value);
            (<HTMLInputElement>document.getElementById("chat-reply")).value ="";
            if(this.sendTimeout === undefined){
                this.sendTimeout = setTimeout( this.sendReply, 2000);
            }  
        }
    }

    checkIfWriting(event){
       if (event.keyCode == 13) {
            document.getElementById("send-reply-button").click();
        }
        if (this.sendTimeout != undefined){ 
            clearTimeout(this.sendTimeout);
            this.sendTimeout = undefined; // so we can detect it in the buton click 
        }
        var value = (<HTMLInputElement>document.getElementById("chat-reply")).value;
        if(event.target === document.activeElement && value.trim().length > 0){
            // o if the user is standing still in the input that has value don't set a new timeout
        }
        else
            this.sendTimeout = setTimeout( this.sendReply, 5000);
        return true;
    }

}