using { hotel.reservation as my } from '../db/schema';

service AdminService @(requires: 'authenticated-user') {
    entity Hotels as projection on my.Hotels;
    entity Rooms as projection on my.Rooms;
    entity Guests as projection on my.Guests;
    entity Reservations as projection on my.Reservations;
}
