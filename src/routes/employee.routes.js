const { Router } = require('express');
const { getEmployee } = require('../controllers/employee.controller');

const router = Router();

router.get('/', getEmployee);

module.exports = router;
