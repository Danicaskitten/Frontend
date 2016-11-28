import { Element } from 'corky/tags/element';
import template from '../template';
import {ITimeAndLocation, getProjections} from '../ducks/dashboardDuck';
import {app} from '../main';

@template("dashboard-result", null)
export abstract class Result extends Element{
    id: string;
    url: string;
    hide: boolean;
    title: string;
    description: string;
    genre: string;
    runtime: string;
    timeAndLocation: Array<ITimeAndLocation>

    constructor(opts){
        super();
        this.id = opts.id;
        this.url = opts.url;
        this.hide = true;
        this.title = opts.title;
        this.description = opts.description;
        this.genre = opts.genre;
        this.runtime = opts.runtime;
        this.timeAndLocation = opts.timeAndLocation;
    }

    changeVisibility(event){
        this.hide = !this.hide;
        if(!this.hide){
            app.dispatch(getProjections.payload({ query: { imdbid: this.id }}));
        }
        else{
            this.timeAndLocation.length = 0;
        }
    }  
}