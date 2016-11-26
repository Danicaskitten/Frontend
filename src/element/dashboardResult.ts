import { Element } from 'corky/tags/element';
import template from '../template';
import {ITimeAndLocation} from '../ducks/dashboardDuck';

@template("dashboard-result", null)
export abstract class Result extends Element{
    id: string;
    url: string;
    timeAndLocation: Array<ITimeAndLocation>;
    hide: boolean;
    title: string;
    description: string;

    constructor(opts){
        super();
        this.id = opts.id;
        this.url = opts.url;
        this.timeAndLocation = opts.timeAndLocation;
        this.hide = true;
        this.title = opts.title;
        this.description = opts.descripiton;
    }

    changeVisibility(event){
        this.hide = !this.hide;
    }  
}