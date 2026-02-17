using { hotel.reservation as my } from '../db/schema';

service AdminService {
    @cds.redirection.target
    entity Hotels as projection on my.Hotels;
    entity Rooms as projection on my.Rooms;
    entity Guests as projection on my.Guests;
    entity Reservations as projection on my.Reservations;

    @readonly
    entity HotelAnalytics as select from my.Hotels {
        key ID,
        name,
        rooms.reservations.status,
        count(rooms.reservations.ID) as reservationCount : Integer
    } group by ID, name, rooms.reservations.status;
}
