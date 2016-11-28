import { Element } from 'corky/tags/element';
import template from '../template';


@template("search-result", null)
export abstract class ChatReply extends Element {
    poster: string;
    title: string;
    genre: string;
    runtime: string;
    show:boolean;

    constructor(opts){
        super(); 
        this.poster = opts.poster;
        this.title = opts.title;
        this.genre = opts.genre;
        this.runtime = opts.runtime;
        this.show = false;
        
    }

    toggleShowMore(){
        this.show = !this.show;
    }
         
}