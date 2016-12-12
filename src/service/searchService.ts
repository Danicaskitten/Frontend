import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {ISearchMovie} from '../ducks/searchDuck';

export class SearchService extends Service {
    selector =
    (state: IModel) => (
        {
           result: state.search.movieResult
        }
    );
}

var searchService = new SearchService();

export default searchService;