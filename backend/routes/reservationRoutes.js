const express = require('express');
const {
  createReservation,
  getReservations,
  getAvailability
} = require('../controllers/reservationController');

const router = express.Router();

router.post('/', createReservation);
router.get('/', getReservations);
router.get('/availability', getAvailability);

module.exports = router;
