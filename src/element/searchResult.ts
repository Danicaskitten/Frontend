import { Element } from 'corky/tags/element';
import template from '../template';


@template("search-result", null)
export abstract class SearchResult extends Element {
    show:boolean;

    constructor(opts){
        super();         
        this.show = false;        
    }

    toggleShowMore(){
        this.show = !this.show;
    }
         
}