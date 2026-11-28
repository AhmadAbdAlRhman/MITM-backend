const invoiceService = require('../services/invoice.service');

async function getInvoices(req, res, next) {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInvoices };
