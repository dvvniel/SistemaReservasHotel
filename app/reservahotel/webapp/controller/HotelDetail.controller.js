sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, History, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("com.reservahotel.controller.HotelDetail", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteHotelDetail").attachPatternMatched(this._onObjectMatched, this);

            // Model for new room data
            var oNewRoomModel = new JSONModel({
                roomNumber: "",
                type: "Single",
                pricePerNight: 0,
                currency_code: "USD",
                status: "Available"
            });
            this.getView().setModel(oNewRoomModel, "newRoom");
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

        onAddRoom: function () {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.reservahotel.view.fragments.AddRoomDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onSaveRoom: function () {
            var oModel = this.getView().getModel();
            var oNewRoomData = this.getView().getModel("newRoom").getData();

            // Basic validation
            if (!oNewRoomData.roomNumber) {
                sap.m.MessageToast.show("Room number is required");
                return;
            }

            var oContext = oModel.createEntry("/Rooms", {
                properties: {
                    hotel_ID: this._sHotelId,
                    roomNumber: oNewRoomData.roomNumber,
                    type: oNewRoomData.type,
                    pricePerNight: parseFloat(oNewRoomData.pricePerNight),
                    currency_code: oNewRoomData.currency_code,
                    status: oNewRoomData.status
                },
                success: function () {
                    sap.m.MessageToast.show("Room added successfully");
                    this._closeAddRoomDialog();
                }.bind(this),
                error: function () {
                    sap.m.MessageToast.show("Error adding room");
                }
            });

            oModel.submitChanges({
                success: function () {
                    // Refresh the binding to show the new room
                    this.getView().getElementBinding().refresh();
                }.bind(this)
            });
        },

        onCancelAddRoom: function () {
            this._closeAddRoomDialog();
        },

        _closeAddRoomDialog: function () {
            this._pDialog.then(function (oDialog) {
                oDialog.close();
                // Reset model
                this.getView().getModel("newRoom").setData({
                    roomNumber: "",
                    type: "Single",
                    pricePerNight: 0,
                    currency_code: "USD",
                    status: "Available"
                });
            }.bind(this));
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
