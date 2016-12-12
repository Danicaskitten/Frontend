import { Service } from 'corky/flux/service';
import {IModel} from '../model';
import {IAdvancedSearchMovieResult} from '../ducks/advancedSearchDuck';

export class AdvancedSearchService extends Service {
    selector = (state: IModel) => ({
        result: state.advancedSearch.result
    });
}

var advancedSearchService = new AdvancedSearchService();

export default advancedSearchService;