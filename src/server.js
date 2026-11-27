require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({
  origin: ["http://192.168.56.30:5173", "http://localhost:5173"],
}));
app.get("/api/health", async(req, res)=>{
	try{
		await db.query("SELECT 1");
		res.json({
			success: true,
			project: "DataLeak Impact Lab",
			status: "running",
			database: "connected"
		});
	} catch(error) {
		res.status(500).json({
			success: false,
			database: "disconnected"
		});
	}
});

app.get("/api/demo/employee", async(req, res) => {
	try {
		const [rows] = await db.execute(
			`SELECT  *  FROM employess WHERE employee_code = ?` ,  ["EMP_1001"]
		);
		if (rows.length === 0 ) {

			return res.status(404).json({
				success: false,
				message: "employee nit found"
			});
		}
		res.json({
			success: true,
			data: rows[0]
		});
	} catch(error) {
		console.error( "Employee query failed:" , error.message);
		res.status(500).json({
			sucess: false,
			message: "Internal server error"
		});
	}
});

app.get("/api/demo/invoices", async(req, res) => {
	try {
		const [rows] = await db.execute(
			`SELECT  i.invoice_number, i.amount, i.description, i.payment_status, e.full_name AS employee_name FROM invoices i JOIN employees e ON e.id = i.employee_id `
		);
		res.json({
			success: true,
			count: rows.length,
			data: rows
		});
	} catch(error) {
		console.error( "Employee query failed:" , error.message);
		res.status(500).json({
			sucess: false,
			message: "Internal server error"
		});
	}
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () =>  {
	console.log(`DataLeak Impact Lab running on port ${PORT}`);
});
