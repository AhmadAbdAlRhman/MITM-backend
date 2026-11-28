const { Router } = require('express');
const healthRouter   = require('./health.routes');
const employeeRouter = require('./employee.routes');
const invoiceRouter  = require('./invoice.routes');

const router = Router();

router.use('/health',       healthRouter);
router.use('/demo/employee', employeeRouter);
router.use('/demo/invoices', invoiceRouter);

module.exports = router;
