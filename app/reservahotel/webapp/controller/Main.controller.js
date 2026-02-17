sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("com.reservahotel.controller.Main", {
        onInit: function () {
        },

        onPressHotel: function (oEvent) {
            var oItem = oEvent.getSource();
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("RouteHotelDetail", {
                hotelId: oItem.getBindingContext().getProperty("ID")
            });
        }
    });
});