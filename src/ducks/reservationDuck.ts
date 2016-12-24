import Flux from 'corky/flux';

export enum ISeatPositionHorizontal{
    Left,
    Right,
    Center
}

export enum ISeatPositionVertical{
    Up,
    Down,
    Middle
}

export interface IReservation{
     city: string, 
     cinema: string,
     date: Date,
     movie: string,
     numberOfSeats: number,
     positionVertical: ISeatPositionVertical,
     positionHorisontal: ISeatPositionHorizontal,
     pricePerSeat: number 
}

export interface IReservationState {
    reservations: Array<IReservation>
}

var initialState : IReservationState = {
    reservations: [
        {
            city: "Zagreb",
            cinema: "Cinestar Branimir centar",
            date: new Date(),
            movie: "Avengers 3",
            numberOfSeats: 5,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3

        },
         {
            city: "Milano",
            cinema: "Cinema Orfeo",
            date: new Date(),
            movie: "Avengers 2",
            numberOfSeats: 10,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10

        }, 
        {
            city: "Split",
            cinema: "Cinestar Joker",
            date: new Date(),
            movie: "Dr. Strange",
            numberOfSeats: 12,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 3

        },
         {
            city: "Rome",
            cinema: "Cinema Orfeo in Rome",
            date: new Date(),
            movie: "Avengers 1",
            numberOfSeats: 1,
            positionVertical: ISeatPositionVertical.Down,
            positionHorisontal: ISeatPositionHorizontal.Center,
            pricePerSeat: 10

        }
    ]
}

export var reservationReducer = new Flux.Reducer<IReservationState>([

],initialState);