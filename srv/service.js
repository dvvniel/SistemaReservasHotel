const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    
    // Entity references
    const { Reservations } = this.entities;

    /**
     * Validation before creating or updating a reservation
     */
    this.before(['CREATE', 'UPDATE'], 'Reservations', async (req) => {
        const { checkInDate, checkOutDate } = req.data;
        
        if (checkInDate && checkOutDate) {
            const start = new Date(checkInDate);
            const end = new Date(checkOutDate);

            if (end <= start) {
                req.error(400, 'Check-out date must be after check-in date.');
            }
        }
    });

});
