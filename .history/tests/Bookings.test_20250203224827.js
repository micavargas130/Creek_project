
  describe('GET /api/bookings/:id', () => {
    it('should return a single booking by ID', async () => {
      const mockBooking = {
        _id: 'bookingId1',
        lodge: { name: 'Cabin 1' },
        user: { first_name: 'John', last_name: 'Doe' },
        status: { status: 'Activa' },
      };

      sandbox.stub(Booking, 'findById').resolves(mockBooking);

      const res = await chai.request(app).get('/api/bookings/bookingId1');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockBooking);
    });

    it('should return 404 if booking not found', async () => {
      sandbox.stub(Booking, 'findById').resolves(null);

      const res = await chai.request(app).get('/api/bookings/nonExistentId');

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Booking not found');
    });
  });

  describe('PATCH /api/bookings/:id/status-completed', () => {
    it('should update booking status to "Completada"', async () => {
      const mockCompletedStatus = { _id: 'statusCompletedId', status: 'Completada' };
      sandbox.stub(BookingStatus, 'findOne').resolves(mockCompletedStatus);

      const mockUpdatedBooking = {
        _id: 'bookingId1',
        status: { status: 'Completada' },
      };

      sandbox.stub(Booking, 'findByIdAndUpdate').resolves(mockUpdatedBooking);

      const res = await chai.request(app).patch('/api/bookings/bookingId1/status-completed');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockUpdatedBooking);
    });

    it('should return an error if "Completada" status does not exist', async () => {
      sandbox.stub(BookingStatus, 'findOne').resolves(null);

      const res = await chai.request(app).patch('/api/bookings/bookingId1/status-completed');

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('El estado "Completada" no existe en la base de datos');
    });
  });
});
