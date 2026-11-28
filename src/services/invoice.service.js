const invoiceRepository = require('../repositories/invoice.repository');

async function getAllInvoices() {
  return invoiceRepository.findAllWithEmployee();
}

module.exports = { getAllInvoices };
