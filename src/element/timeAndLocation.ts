import { Element } from 'corky/tags/element';
import template from '../template';

@template("time-and-location", null)
export abstract class TimeAndLocation extends Element {
    location: string;
    time: string;

    constructor(opts){
        super();
        this.location = opts.location;
        this.time = opts.time;
    }

    reserve(event){
        event.stopPropagation();
        this.router.redirect("/reserve");
    }
}