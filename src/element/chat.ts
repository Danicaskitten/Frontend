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
    

}