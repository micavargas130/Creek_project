import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../index.js";
import Booking from "../api/models/Bookings.js";
import BookingStatus from "../api/models/BookingsStatus.js";

// Usa chai correctamente en un entorno ESM
chai.use(chaiHttp);
const { expect } = chai;

describe("Bookings API", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore(); // Limpia todos los mocks y stubs después de cada prueba
  });

  describe("POST /api/bookings", () => {
    it('should create a booking when status "Activa" exists', async () => {
      const mockStatus = { _id: "statusId", status: "Activa" };
      sandbox.stub(BookingStatus, "findOne").resolves(mockStatus);

      const mockBooking = {
        lodge: "lodgeId",
        checkIn: "2025-01-15",
        checkOut: "2025-01-20",
        user: "userId",
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
      };

      sandbox.stub(Booking.prototype, "save").resolves({ ...mockBooking, _id: "bookingId" });

      const res = await chai.request(app).post("/api/bookings").send(mockBooking);

      expect(res).to.have.status(200);
      expect(res.text).to.equal("Booking registered correctly");
      expect(Booking.prototype.save.calledOnce).to.be.true;
    });

    it('should return an error if status "Activa" does not exist', async () => {
      sandbox.stub(BookingStatus, "findOne").resolves(null);

      const mockBooking = {
        lodge: "lodgeId",
        checkIn: "2025-01-15",
        checkOut: "2025-01-20",
        user: "userId",
        numberOfAdults: 2,
        numberOfChildren: 1,
        totalAmount: 500,
      };

      const res = await chai.request(app).post("/api/bookings").send(mockBooking);

      expect(res).to.have.status(500);
      expect(res.body.error).to.equal('El estado "Activa" no existe en la base de datos');
    });
  });
});

 