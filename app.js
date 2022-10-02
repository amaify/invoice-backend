const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authentication");
const invoiceRoutes = require("./routes/invoice");
const isAuth = require("./middleware/isAuth");

const DBUsername = process.env.DB_USERNAME;
const DBPassword = process.env.DB_PASSWORD;
const DB = process.env.MONGODB_DEFAULT_DB;

const app = express();

const MONGODB_URI = `mongodb+srv://${DBUsername}:${DBPassword}@invoice-app.kj0qv.mongodb.net/${DB}?retryWrites=true&w=majority`;

app.use(express.json());

app.use(isAuth);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(isAuth);

app.use("/authentication", authRoutes);
app.use("/invoice", invoiceRoutes);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => app.listen(process.env.PORT || 8080))
	.catch((err) => console.log(err.message));
