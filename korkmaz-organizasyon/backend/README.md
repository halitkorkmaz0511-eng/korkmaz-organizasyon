# Korkmaz Organizasyon Backend

Production-ready backend for the Korkmaz Organizasyon event booking platform.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer for email notifications
- dotenv for environment variables
- CORS enabled

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and set real values.
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/reservations`
  - Create a new reservation
- `GET /api/reservations`
  - List all reservations
- `GET /api/reservations/availability?date=YYYY-MM-DD`
  - Get reservation availability for a specific date

## Notes
- Duplicate bookings are prevented by checking the same date and time.
- New reservations trigger an email notification to the business owner.
- Data is validated before saving.
