const request = require('supertest');
const app = require('../index');
const Booking = require('../api/models/Bookings.js');
const BookingStatus = require('../models/BookingsStatus.js');

jest.mock('../models/Bookings.js');
jest.mock('../models/BookingsStatus.js');

describe('Bookings API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/bookings', () => {
    it('should create a booking when status "Activa" exists', async () => {
      const mockStatus = { _id: 'statusId', status: 'Activa' };
      BookingStatus.findOne.mockResolvedValue(mockStatus);

      const mockBooking = {
        lodge: 'lodgeId',
        checkIn: '2025-01-15',
        checkOut: '2025-01-20',
        user: 'userId',
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
        status: mockStatus._id,
      };

      Booking.prototype.save.mockResolvedValue({ ...mockBooking, _id: 'bookingId' });

      const res = await request(app).post('/api/bookings').send(mockBooking);

      expect(res.status).toBe(200);
      expect(res.text).toBe('Booking registered correctly');
      expect(Booking.prototype.save).toHaveBeenCalled();
    });

    it('should return an error if status "Activa" does not exist', async () => {
      BookingStatus.findOne.mockResolvedValue(null);

      const mockBooking = {
        lodge: 'lodgeId',
        checkIn: '2025-01-15',
        checkOut: '2025-01-20',
        user: 'userId',
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
      };

      const res = await request(app).post('/api/bookings').send(mockBooking);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('El estado "Activa" no existe en la base de datos');
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

      Booking.find.mockResolvedValue(mockBookings);

      const res = await request(app).get('/api/bookings');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBookings);
      expect(Booking.find).toHaveBeenCalledWith({});
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

      Booking.findById.mockResolvedValue(mockBooking);

      const res = await request(app).get('/api/bookings/bookingId1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBooking);
      expect(Booking.findById).toHaveBeenCalledWith('bookingId1');
    });

    it('should return 404 if booking not found', async () => {
      Booking.findById.mockResolvedValue(null);

      const res = await request(app).get('/api/bookings/nonExistentId');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Booking not found');
    });
  });

  describe('PATCH /api/bookings/:id/status-completed', () => {
    it('should update booking status to "Completada"', async () => {
      const mockCompletedStatus = { _id: 'statusCompletedId', status: 'Completada' };
      BookingStatus.findOne.mockResolvedValue(mockCompletedStatus);

      const mockUpdatedBooking = {
        _id: 'bookingId1',
        status: { status: 'Completada' },
      };

      Booking.findByIdAndUpdate.mockResolvedValue(mockUpdatedBooking);

      const res = await request(app).patch('/api/bookings/bookingId1/status-completed');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUpdatedBooking);
      expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(
        'bookingId1',
        { status: mockCompletedStatus._id },
        { new: true }
      );
    });

    it('should return an error if "Completada" status does not exist', async () => {
      BookingStatus.findOne.mockResolvedValue(null);

      const res = await request(app).patch('/api/bookings/bookingId1/status-completed');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('El estado "Completada" no existe en la base de datos');
    });
  });
});
