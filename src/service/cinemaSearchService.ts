import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {ICinemaSearchMovieResult} from '../ducks/cinemaSearchDuck';

export class CinemaSearchService extends Service {
    selector = (state: IModel) => ({
        cinemaResult: state.cinemaSearch.cinemaResult,
        myCity: state.cinemaSearch.myCity,
        cinemaName: state.cinemaSearch.cinemaName
    });
}

var cinemaSearchService = new CinemaSearchService();

export default cinemaSearchService;