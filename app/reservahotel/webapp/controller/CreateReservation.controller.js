sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent, MessageToast, JSONModel, History) {
    "use strict";

    return Controller.extend("com.reservahotel.controller.CreateReservation", {
        onInit: function () {
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteCreateReservation").attachPatternMatched(this._onObjectMatched, this);

            this.getView().setModel(new JSONModel({
                checkInDate: null,
                checkOutDate: null,
                selectedRoomId: null,
                selectedGuestId: null
            }), "wizard");
        },

        _onObjectMatched: function (oEvent) {
            this._sHotelId = oEvent.getParameter("arguments").hotelId;
            var oWizard = this.byId("reservationWizard");
            if (oWizard) {
                oWizard.discardProgress(oWizard.getSteps()[0]);
            }

            // Filter Rooms by Hotel
            var oRoomSelect = this.byId("roomSelect");
            var oBinding = oRoomSelect.getBinding("items");
            if (oBinding) {
                var oFilter = new sap.ui.model.Filter("hotel_ID", "EQ", this._sHotelId);
                oBinding.filter([oFilter]);
            }
        },

        onDateChange: function (oEvent) {
            var oWizard = this.byId("reservationWizard");
            var oStep = this.byId("stepDate");
            if (oEvent.getParameter("valid")) {
                oWizard.validateStep(oStep);
            } else {
                oWizard.invalidateStep(oStep);
            }
        },

        onRoomSelect: function (oEvent) {
            var oWizard = this.byId("reservationWizard");
            var oStep = this.byId("stepRoom");
            if (oEvent.getParameter("selectedItem")) {
                oWizard.validateStep(oStep);
            } else {
                oWizard.invalidateStep(oStep);
            }
        },

        onGuestSelect: function (oEvent) {
            var oWizard = this.byId("reservationWizard");
            var oStep = this.byId("stepGuest");
            if (oEvent.getParameter("selectedItem")) {
                oWizard.validateStep(oStep);
            } else {
                oWizard.invalidateStep(oStep);
            }
        },

        onWizardCompleted: function () {
            this._handleMessageBoxOpen("Are you sure you want to book this room?", "confirm");
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            sap.m.MessageBox[sMessageBoxType](sMessage, {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        this._createReservation();
                    }
                }.bind(this)
            });
        },

        _createReservation: function () {
            var oModel = this.getView().getModel();
            var oWizardModel = this.getView().getModel("wizard");
            var oData = oWizardModel.getData();

            var oListBinding = oModel.bindList("/Reservations");
            var oContext = oListBinding.create({
                room_ID: oData.selectedRoomId,
                guest_ID: oData.selectedGuestId,
                checkInDate: oData.checkInDate,
                checkOutDate: oData.checkOutDate,
                status: 'Booked'
            });

            oContext.created().then(function () {
                MessageToast.show("Reservation created successfully!");
                this.onNavBack();
            }.bind(this), function (oError) {
                sap.m.MessageBox.error("Error creating reservation: " + oError.message);
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
