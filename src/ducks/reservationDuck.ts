import Flux from 'corky/flux';

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
    freeSeats: number
}
export interface ISeatNumberPayload {
    "Data": {
        "ProjectionId": number,
        "FreeSeats": number
    }
}

export interface IReservationState {
    reservations: Array<IReservation>,
    token: string,
    username: string,
    reservation: IReservation
}
export const setSeatNumber = new Flux.Action<{ seats: number }>("SET_SEAT_NUMBER");
export const setPosition = new Flux.Action<{ vertical: number, horizontal: number }>("SET_POSITION");
export const confirmReservation = new Flux.Action<{ confirm: boolean }>("CONFIRM_RESERVATION");
export const setReservation = new Flux.Action<{ city: string, cinema: string, date: Date, movie: string, projectionId: string }>("SET_RESERVATION");


var initialState: IReservationState = {
    reservation: undefined,
    username: "",
    token: "",
    reservations: [
        {
            city: "Zagreb",
            cinema: "Cinestar Branimir centar",
            date: "01-01-2017 17h",
            movie: "Avengers 3",
            projectionId: 0,
            numberOfSeats: 5,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3,
            freeSeats: 0

        },
        {
            city: "Milano",
            cinema: "Cinema Orfeo",
            date: "01-01-2017 17h",
            movie: "Avengers 2",
            numberOfSeats: 10,
            projectionId: 0,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10,
            freeSeats: 0

        },
        {
            city: "Split",
            cinema: "Cinestar Joker",
            date: "01-01-2017 17h",
            movie: "Dr. Strange",
            projectionId: 0,
            numberOfSeats: 12,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3,
            freeSeats: 0

        },
        {
            city: "Rome",
            cinema: "Cinema Orfeo in Rome",
            date: "01-01-2017 17h",
            movie: "Avengers 1",
            projectionId: 0,
            numberOfSeats: 1,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10,
            freeSeats: 0

        }
    ]
}

export var reservationReducer = new Flux.Reducer<IReservationState>([
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
            if (payload.confirm && (state.reservation.freeSeats - state.reservation.numberOfSeats) >= 0)
                state.reservations.push(state.reservation);
            state.reservations
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
                positionHorisontal: 0
            };
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
                positionHorisontal: 0
            };
            state.reservation.cinema = payload.cinema;
            state.reservation.city = payload.city;
            state.reservation.date = payload.date + " " + payload.time;
            state.reservation.movie = payload.movie;
            state.reservation.projectionId = payload.projectionId;
            state.reservation.pricePerSeat = getRandomInt(1, 30);
            state.reservation.freeSeats = getRandomInt(0, 50);
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
    }
], initialState);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}