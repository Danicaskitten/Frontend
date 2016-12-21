import { Element } from 'corky/tags/element';
import template from '../template';

@template("projection-result", null)
export abstract class SearchResult extends Element {

    reserve(event){
        event.stopPropagation();
    }
}

