import { Element } from 'corky/tags/element';
import template from '../template';
import {app} from '../main';
import {getProjections} from '../ducks/cinemaSearchDuck';
import {IProjection} from '../ducks/cinemaSearchDuck';

@template("movie-result", null)
export abstract class MovieResult extends Element {
    Title: string;
    ImdbID: string;
    Poster: string;
    Runtime: string;
    Plot: string;
    Genre: string;
    CinemaId: string;
    Projections: Array<IProjection>
    hide: boolean;

    constructor(opts){
        super();
        this.Title = opts.Title;
        this.ImdbID = opts.ImdbID;
        this.Poster = opts.Poster;
        this.Runtime = opts.Runtime;
        this.Plot = opts.Plot;
        this.Genre = opts.Genre;
        this.CinemaId = opts.CinemaId;
        this.Projections = [];
        this.hide = true;
    }
    searchProjections(event){
        event.stopPropagation();
        this.hide = !this.hide;
        if(!this.hide){
            app.dispatch(getProjections.payload({template: { cinemaId: this.CinemaId, imdbId: this.ImdbID},query:{StartDate: "12/10/2016", EndDate: "12/14/2017"}}));
        }
        else{
            this.Projections.length = 0;
        }        
    }
}

