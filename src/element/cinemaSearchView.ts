import { Element } from 'corky/tags/element';
import template from '../template';
import cinemaSearchService from '../service/cinemaSearchService';
import {ICinemaSearchMovieResult} from '../ducks/cinemaSearchDuck';
import {app} from '../main';
import {cinemaMovieSearch, cinemaMovieSearchLocation, getLocationFromBing} from '../ducks/cinemaSearchDuck';
import {mapKey} from '../config';


@template("cinema-search-view", cinemaSearchService)
export abstract class CinemaSearchView extends Element {
    result: Array<ICinemaSearchMovieResult>

    cinemaSearch() {
        var isChecked = (<HTMLInputElement>document.getElementById('search-option')).checked;
        if (isChecked){
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
        else{
            var city = (<HTMLInputElement>document.getElementById("city-input")).value;
            city = city.trim();
            if(city !== "" && city !== undefined && city !== null)
                getLocation(city);
            
            var date = (<HTMLInputElement>document.getElementById("datepicker")).value;
            date = date.trim();
            //if(date !== "" && city !)
        }
    }
}

var onSuccess = function(position) {
    //app.dispatch(cinemaMovieSearch.payload({ query: { title: "avengers"}}));
    app.dispatch(cinemaMovieSearchLocation.payload({ query: { longitude: position.coords.longitude, latitude: position.coords.latitude}}));
}

function onError(error){
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

function getLocation(value){
    app.dispatch(getLocationFromBing.payload({query: {query: value, key: mapKey}}));
}
