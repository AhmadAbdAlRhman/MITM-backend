const employeeService = require('../services/employee.service');

async function getEmployee(req, res, next) {
  try {
    const employee = await employeeService.getEmployeeByCode('EMP_1001');
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
    res.json({
      success: true,
      data: employee,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEmployee };
