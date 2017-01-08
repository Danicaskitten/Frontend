import { Element } from 'corky/tags/element';
import template from '../template';
import cinemaSearchService from '../service/cinemaSearchService';
import {ICinemaSearchMovieResult} from '../ducks/cinemaSearchDuck';
import {app} from '../main';
import {cinemaMovieSearchLocation, getLocationFromOSMCinema, getLocationFromGoogleApi, setCinemaName} from '../ducks/cinemaSearchDuck';
import {mapKey} from '../config';


@template("cinema-search-view", cinemaSearchService)
export abstract class CinemaSearchView extends Element {
    cinemaResult: Array<ICinemaSearchMovieResult>
    myCity: string
    cinemaName: string

    cinemaSearch() {
        var city = "";
        var cinemaName = "";
        cinemaName = (<HTMLInputElement>document.getElementById("cinema-name-input")).value;
        cinemaName = cinemaName.trim();
        app.dispatch(setCinemaName.payload({name: cinemaName}));
        var isChecked = (<HTMLInputElement>document.getElementById('cinema-option')).checked;
        if (isChecked){
            var needsParsing = (<HTMLElement>document.getElementById('label-location-cinema')).textContent;
            city = parse(needsParsing);
        }
        else{
            city = (<HTMLInputElement>document.getElementById("cinema-city-input")).value;
            city = city.trim();
        }
        if(city !== "" && city !== undefined && city !== null){
            getLocation(city);
        }
    }
}

function getLocation(value){
    app.dispatch(getLocationFromOSMCinema.payload({template: {city: value}}));
}

function getLocationFromGoogle(){
    app.dispatch(getLocationFromGoogleApi.payload({query: {key: mapKey}}));
}

function parse(needsParsing){
    needsParsing = needsParsing.replace(/\s*$/, "");
    needsParsing = needsParsing.trim();
    var n = needsParsing.split(" ");
    return n[n.length - 1];
}