const express = require("express");
const invoiceController = require("../controllers/invoice");

const router = express.Router();

router.post("/new-invoice", invoiceController.createInvoice);
router.get("/invoice", invoiceController.getInvoices);
router.get("/invoice/:invoiceId", invoiceController.getInvoice);
router.put("/invoice/:invoiceId", invoiceController.updateInvoice);
router.delete("/invoice/:invoiceId", invoiceController.deleteInvoice);

module.exports = router;
