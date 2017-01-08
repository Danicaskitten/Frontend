import Flux from 'corky/flux';
import { ConditionalRequestAction } from '../flux/conditional';

import { loginUser, logoutUser, readStorage } from './appDuck';

export enum ISeatPositionHorizontal {
    Left,
    Right,
    Center
}

export enum ISeatPositionVertical {
    Up,
    Down,
    Middle
}
export interface IReservationHistory {
    city: string,
    cinema: string,
    date: string,
    movie: string,
    numberOfSeats: number,
    pricePerSeat: number
}
export interface IReservation {
    city: string,
    cinema: string,
    date: string,
    movie: string,
    numberOfSeats: number,
    positionVertical: ISeatPositionVertical,
    positionHorisontal: ISeatPositionHorizontal,
    pricePerSeat: number,
    projectionId: number,
    freeSeats: number,
    reservationId: number
}
export interface ISeatNumberPayload {
    "Data": {
        "ProjectionId": number,
        "FreeSeats": number
    }
}

export interface IReservationState {
    reservations: Array<IReservationHistory>,
    token: string,
    username: string,
    reservation: IReservation,
    errorMessage: string;
}

export interface IHistoryResponse {
    Quantity: number,
    Date: string,
    Time: string,
    Status: string,
    Cinema: string,
    Movie: string,
    City: string
}

export const getUserReservationHistory = new Flux.RequestAction<{ options: {} }, { Data: Array<IHistoryResponse> }>
    ("GET_USER_RESERVATION_HISTORY", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/getByUserId", "GET");
export const setSeatNumber = new Flux.Action<{ seats: number }>("SET_SEAT_NUMBER");
export const setPosition = new Flux.Action<{ vertical: number, horizontal: number }>("SET_POSITION");
export const confirmReservation = new Flux.Action<{ confirm: boolean }>("CONFIRM_RESERVATION");
export const setReservation = new Flux.Action<{ city: string, cinema: string, date: Date, movie: string, projectionId: string }>("SET_RESERVATION");

export const addReservation = new Flux.RequestAction<{ template: { ProjectionId: string }, options: any }, any>
    ("ADD_RESERVATION", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/add/{ProjectionId}", "POST");

export const completeReservation = new Flux.RequestAction<{ template: any, options: any }, any>
    ("FINALIZE_RESERVATION", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/complete/{reservationId}/{quantity}", "PUT");

export const cancelReservation = new Flux.RequestAction<{ template: any, options: any }, any>(
    "CANCEL_RESERVATION", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/cancel/{reservationId}", "PUT"
);

export const reservation = new ConditionalRequestAction<{ template: { ProjectionId: string }, options: any, payload2: { template: { ProjectionId: string }, options: any } }, any>
    ("CHECK_AND_RESERVE", "http://moviebot-rage.azurewebsites.net/api/v2/reservations/getFreeSeats/{ProjectionId}",
    "GET", addReservation, function (data: ISeatNumberPayload) {
        return data.Data.ProjectionId > 0;
    });

var initialState: IReservationState = {
    reservation: undefined,
    username: "",
    token: "",
    errorMessage: "",
    reservations: []
}

export var reservationReducer = new Flux.Reducer<IReservationState>([
    {
        action: cancelReservation.request,
        reduce: (state: IReservationState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            state.errorMessage = "";
            payload.template = { reservationId: state.reservation.reservationId };
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: cancelReservation.response,
        reduce: (state: IReservationState, payload: any) => {
            console.log("Successfully canceled");
            state.reservation = {
                cinema: "",
                city: "",
                date: "",
                movie: "",
                projectionId: -1,
                pricePerSeat: 0,
                freeSeats: 0,
                numberOfSeats: 0,
                positionVertical: 0,
                positionHorisontal: 0,
                reservationId: -1
            };
        }
    },
    {
        action: completeReservation.request,
        reduce: (state: IReservationState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            state.errorMessage = "";
            payload.template = { quantity: state.reservation.numberOfSeats, reservationId: state.reservation.reservationId };
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: completeReservation.response,
        reduce: (state: IReservationState, payload: any) => {
            console.log("Successfully reserved");
            if ((state.reservation.freeSeats - state.reservation.numberOfSeats) >= 0)
                state.reservations.push(state.reservation);
            state.reservation = {
                cinema: "",
                city: "",
                date: "",
                movie: "",
                projectionId: -1,
                pricePerSeat: 0,
                freeSeats: 0,
                numberOfSeats: 0,
                positionVertical: 0,
                positionHorisontal: 0,
                reservationId: -1
            };
        }
    },
    {
        action: setSeatNumber,
        reduce: (state: IReservationState, payload: { seats: number }) => {

            state.reservation.numberOfSeats = payload.seats;
        }
    },
    {
        action: setPosition,
        reduce: (state: IReservationState, payload: { vertical: number, horizontal: number }) => {
            state.reservation.positionVertical = payload.vertical;
            state.reservation.positionHorisontal = payload.horizontal;
        }
    },
    {
        action: confirmReservation,
        reduce: (state: IReservationState, payload: { confirm: boolean }) => {

        }
    },
    {

        action: setReservation,
        reduce: (state: IReservationState, payload: any) => {
            state.reservation = {
                cinema: "",
                city: "",
                date: "",
                movie: "",
                projectionId: -1,
                pricePerSeat: 0,
                freeSeats: 0,
                numberOfSeats: 0,
                positionVertical: 0,
                positionHorisontal: 0,
                reservationId: -1
            };
            state.reservation.cinema = payload.cinema;
            state.reservation.city = payload.city;
            state.reservation.date = payload.date + " " + payload.time;
            state.reservation.movie = payload.movie;
            state.reservation.projectionId = payload.projectionId;
            state.reservation.pricePerSeat = getRandomInt(1, 30);
            // state.reservation.freeSeats = getRandomInt(0, 50);
        }
    },
    {
        action: logoutUser,
        reduce: (state: IReservationState, payload: any) => {
            state = initialState;
        }
    },
    {
        action: readStorage,
        reduce: (state: IReservationState, payload: any) => {
            state.username = localStorage.getItem("user");
            state.token = localStorage.getItem("token");
        }
    },
    {
        action: loginUser.response,
        reduce: (state: IReservationState, payload: { userName: string, access_token: string }) => {
            state.username = payload.userName;
            state.token = payload.access_token;
        }
    },
    {
        action: reservation.request,
        reduce: (state: IReservationState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            state.errorMessage = "";
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: reservation.response,
        reduce: (state: IReservationState, payload: ISeatNumberPayload) => {
            console.log(payload);
            state.reservation.freeSeats = payload.Data.FreeSeats;
            // state.reservation.ProjectionId = payload.Data.ProjectionId;
        }
    },
    {
        action: addReservation.response,
        reduce: (state: IReservationState, payload: any) => {
            state.reservation.reservationId = payload.Data.ReservationId;
            console.log("DID IT");
        }
    },
    {
        action: addReservation.request,
        reduce: (state: IReservationState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: addReservation.error,
        reduce: (state: IReservationState, payload: any) => {
            state.errorMessage = payload.response.body.Message;
        }
    },
    {
        action: getUserReservationHistory.request,
        reduce: (state: IReservationState, payload: any) => {
            payload.options = {};
            payload.options["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            payload.options["Authorization"] = "Bearer " + state.token;
        }
    },
    {
        action: getUserReservationHistory.response,
        reduce: (state: IReservationState, payload: { Data: Array<IHistoryResponse> }) => {
            state.reservations = [];
            payload.Data.forEach(element => {
                if(element.Status === "Complete")
                state.reservations.push({
                    city: element.City,
                    cinema: element.Cinema,
                    date: element.Date + " " + element.Time,
                    movie: element.Movie,
                    numberOfSeats: element.Quantity,
                    pricePerSeat: getRandomInt(1, 30)
                })
            });
        }
    }
], initialState);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}