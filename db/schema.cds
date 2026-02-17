namespace hotel.reservation;

using {
    cuid,
    managed,
    Currency,
    Country
} from '@sap/cds/common';

entity Hotels : cuid, managed {
    name        : String(100);
    address     : String(200);
    city        : String(100);
    country     : Country;
    rating      : Integer enum {
        One   = 1;
        Two   = 2;
        Three = 3;
        Four  = 4;
        Five  = 5;
    };
    rooms       : Composition of many Rooms
                      on rooms.hotel = $self;
}

entity Rooms : cuid, managed {
    hotel       : Association to Hotels;
    roomNumber  : String(10);
    type        : String(50); // e.g. Single, Double, Suite
    pricePerNight : Decimal(10, 2);
    currency    : Currency;
    reservations : Composition of many Reservations on reservations.room = $self;
}

entity Guests : cuid, managed {
    firstName   : String(100);
    lastName    : String(100);
    email       : String(100);
    phoneNumber : String(20);
    reservations : Association to many Reservations on reservations.guest = $self;
}

entity Reservations : cuid, managed {
    room        : Association to Rooms;
    guest       : Association to Guests;
    checkInDate : Date;
    checkOutDate : Date;
    status      : String(20) enum {
        Booked     = 'Booked';
        CheckedIn  = 'CheckedIn';
        CheckedOut = 'CheckedOut';
        Cancelled  = 'Cancelled';
    } default 'Booked';
}
