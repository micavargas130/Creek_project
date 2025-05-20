import { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../index.js";

import Booking from "../api/models/Bookings.js";
import BookingStatus from "../api/models/BookingsStatus.js";

const { expect } = chai;
chai.use(chaiHttp);

describe('Bookings API', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore(); // Limpia todos los mocks y stubs después de cada prueba
  });

  describe('POST /api/bookings', () => {
    it('should create a booking when status "Activa" exists', async () => {
      const mockStatus = { _id: 'statusId', status: 'Activa' };
      sandbox.stub(BookingStatus, 'findOne').resolves(mockStatus);

      const mockBooking = {
        lodge: 'lodgeId',
        checkIn: '2025-01-15',
        checkOut: '2025-01-20',
        user: 'userId',
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
      };

      sandbox.stub(Booking.prototype, 'save').resolves({ ...mockBooking, _id: 'bookingId' });

      const res = await chai.request(app).post('/api/bookings').send(mockBooking);

      expect(res).to.have.status(200);
      expect(res.text).to.equal('Booking registered correctly');
      expect(Booking.prototype.save.calledOnce).to.be.true;
    });

    it('should return an error if status "Activa" does not exist', async () => {
      sandbox.stub(BookingStatus, 'findOne').resolves(null);

      const mockBooking = {
        lodge: 'lodgeId',
        checkIn: '2025-01-15',
        checkOut: '2025-01-20',
        user: 'userId',
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
      };

      const res = await chai.request(app).post('/api/bookings').send(mockBooking);

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('El estado "Activa" no existe en la base de datos');
    });
  });

  describe('GET /api/bookings', () => {
    it('should return all bookings with populated fields', async () => {
      const mockBookings = [
        {
          _id: 'bookingId1',
          lodge: { name: 'Cabin 1' },
          user: { first_name: 'John', last_name: 'Doe' },
          status: { status: 'Activa' },
        },
      ];

      sandbox.stub(Booking, 'find').resolves(mockBookings);

      const res = await chai.request(app).get('/api/bookings');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockBookings);
      expect(Booking.find.calledOnce).to.be.true;
    });
  });

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
