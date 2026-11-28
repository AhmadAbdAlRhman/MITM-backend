const { Router } = require('express');
const { getInvoices } = require('../controllers/invoice.controller');

const router = Router();

router.get('/', getInvoices);

module.exports = router;
