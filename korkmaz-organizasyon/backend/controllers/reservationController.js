const Reservation = require('../models/reservationModel');
const { sendNewReservationEmail } = require('../services/emailService');

const TIME_SLOTS = ['17:00', '19:00', '21:00'];
const VALID_EVENT_TYPES = ['Nişan', 'Kına', 'Doğum Günü', 'Diğer Organizasyon'];

const normalizeDate = (dateString) => {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const createReservation = async (req, res, next) => {
  try {
    const { name, phone, eventType, date, time, price, note } = req.body;

    if (!name || !phone || !eventType || !date || !time || price == null) {
      return res.status(400).json({ message: 'Tüm zorunlu alanları doldurun.' });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ message: 'Geçerli bir isim girin.' });
    }

    const phonePattern = /^05\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    if (!phonePattern.test(phone.trim())) {
      return res.status(400).json({ message: 'Geçerli bir telefon numarası girin.' });
    }

    if (!VALID_EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({ message: 'Geçerli bir organizasyon türü seçin.' });
    }

    if (!TIME_SLOTS.includes(time)) {
      return res.status(400).json({ message: 'Geçerli bir saat seçin.' });
    }

    const reservationDate = normalizeDate(date);
    if (!reservationDate) {
      return res.status(400).json({ message: 'Geçerli bir tarih formatı girin.' });
    }

    const existingReservation = await Reservation.findOne({ date: reservationDate, time });
    if (existingReservation) {
      return res.status(409).json({ message: 'Bu tarih ve saat dolu' });
    }

    const reservation = await Reservation.create({
      name: name.trim(),
      phone: phone.trim(),
      eventType,
      date: reservationDate,
      time,
      price: Number(price),
      note: typeof note === 'string' ? note.trim() : ''
    });

    await sendNewReservationEmail(reservation);

    return res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Bu tarih ve saat dolu' });
    }
    next(error);
  }
};

const getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Tarih parametresi gereklidir.' });
    }

    const reservationDate = normalizeDate(date);
    if (!reservationDate) {
      return res.status(400).json({ message: 'Geçerli bir tarih formatı girin.' });
    }

    const bookedReservations = await Reservation.find({ date: reservationDate }).select('time -_id');
    const bookedTimes = bookedReservations.map((reservation) => reservation.time);

    const availability = TIME_SLOTS.map((slot) => ({
      time: slot,
      status: bookedTimes.includes(slot) ? 'booked' : 'available'
    }));

    return res.status(200).json({ success: true, date: reservationDate.toISOString().split('T')[0], availability });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservations,
  getAvailability
};
