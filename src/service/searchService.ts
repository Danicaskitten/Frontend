import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {ISearchMovieData,searchMovieByTitle} from '../ducks/searchDuck';

export class SearchService extends Service {
    selector =
    (state: IModel) => (
        {
           result: state.search.movieDataResult,
           active: <number> state.app.active,
           loadingBasicData: state.search.loadingBasicSearchData
        }
    );
    actions = {
        basicMovieSearch:(title: string) => searchMovieByTitle.payload({template:{title:title}})
    }
}

var searchService = new SearchService();

export default searchService;