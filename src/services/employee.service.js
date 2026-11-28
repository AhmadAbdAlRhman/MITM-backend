const employeeRepository = require('../repositories/employee.repository');

async function getEmployeeByCode(employeeCode) {
  return employeeRepository.findByEmployeeCode(employeeCode);
}

module.exports = { getEmployeeByCode };
