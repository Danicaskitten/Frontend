import Flux from 'corky/flux';

export interface IDashboardState {
    dashboard: {
        result: Array<ISuggestion>
    }
}

//dummy data
var timeAndLoc: ITimeAndLocation = {
    location: "Cinestar Zagreb",
    time: "4:30",
}

var timeAndLoc2: ITimeAndLocation = {
    location: "Rijeka",
    time: "6:30",
}

var initialState: IDashboardState = {
    dashboard: {
        result: []
    }
}

export interface ISuggestion {
    id: string,
    title: string,
    timeAndLocation: Array<ITimeAndLocation>,
    url: string,
    description: string
}

export interface ITimeAndLocation {
    location: string,
    time: string,
}

export interface IDashboardResponse {
    title: string;
    imdbDb: string;
}

export interface IGiphyResponse {
    data: {
        image_original_url: string;
    }
}

export interface IGiphyArrayResponse {
    data: Array<{
        id: string,
        images: {
            original: {
                url: string;
            },
            fixed_width: {
                url: string
            }
        }
    }>
}

export const dashboardInit = new Flux.RequestAction<{ query: { q: string } }, Array<IGiphyResponse>>("DASHBOARD_LOADED", "http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=5", "GET");

export var dashboardReducer = new Flux.Reducer<IDashboardState>(
    [
        {
            action: dashboardInit.response,
            reduce: (state: IDashboardState, payload: IGiphyArrayResponse) => {
                state.dashboard.result = payload.data.map((obj) => {
                    return {
                        id: obj.id,
                        url: obj.images.original.url,
                        timeAndLocation: [timeAndLoc, timeAndLoc2],
                        title: "Avengers",
                        description: "This is a movie about superheroes"
                    }
                });
                return state;
            }
        }
    ], initialState
);