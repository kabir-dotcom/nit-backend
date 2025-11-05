const express = require('express');
const authRoutes = require('./authRoutes');
const infoRoutes = require('./infoRoutes');
const patientRoutes = require('./patientRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/content', infoRoutes);
router.use('/patient', patientRoutes);

module.exports = router;
