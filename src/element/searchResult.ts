import { Element } from 'corky/tags/element';
import template from '../template';
import {app} from '../main';
import {ICinemaSearchMovieResult} from '../ducks/cinemaSearchDuck';
import {getCinemasFromMovie} from '../ducks/advancedSearchDuck';

@template("imdb-search-result", null)
@template("search-result", null)
export abstract class SearchResult extends Element {
    Title: string;
    ImdbID: string;
    Poster: string;
    Runtime: string;
    Plot: string;
    Genre: string;
    Cinemas: Array<ICinemaSearchMovieResult>;
    hide: boolean;
    show:boolean;
    cin: boolean;

    constructor(opts){
        super();
        this.Title = opts.Title;
        this.ImdbID = opts.ImdbID;
        this.Poster = opts.Poster;
        this.Runtime = opts.Runtime;
        this.Plot = opts.Plot;
        this.Genre = opts.Genre;
        this.Cinemas = [];
        this.hide = true;
        this.show = false;   
        this.cin = false;
    }

    toggleShowMore(event){
        this.show = !this.show;
        var elementScroll = (document.getElementById("basic-search-div"));
      //  elementScroll.scrollTop = event.target.offsetTop;
    }

    changeVisibilityMovie(event){
        event.stopPropagation();
        this.hide = !this.hide;
         if(!this.hide){
            this.cin = true;
            app.dispatch(getCinemasFromMovie.payload({ template: {imdbId: this.ImdbID, latitude: "", longitude: ""},query:{EndDate:"", StartDate:""}}));
        }
        else{
            this.Cinemas.length = 0;
            this.cin = false;
        }
    }  
         
}