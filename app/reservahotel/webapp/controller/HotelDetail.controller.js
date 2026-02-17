sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent, History) {
    "use strict";

    return Controller.extend("com.reservahotel.controller.HotelDetail", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHotelDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            this._sHotelId = oEvent.getParameter("arguments").hotelId;
            this.getView().bindElement({
                path: "/Hotels(ID=" + this._sHotelId + ")",
                parameters: {
                    expand: "rooms,rooms/reservations"
                }
            });
        },

        onPressBook: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteCreateReservation", {
                hotelId: this._sHotelId
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain", {}, true);
            }
        }
    });
});
