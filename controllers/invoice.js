const User = require("../models/user");
const Invoice = require("../models/invoice");

const utilityController = require("../utils/totalPrice");

// const invoice = require("../models/invoice");
// const invoice = require("../models/invoice");

exports.createInvoice = async (req, res, next) => {
	let dateCreated, sumTotal;

	const generateRandomString = function () {
		return Math.random().toString(20).toUpperCase().substr(2, 6);
	};

	const paymentTerms = req.body.paymentTerms;

	dateCreated = new Date(req.body.date);
	dateCreated.setDate(dateCreated.getDate() + paymentTerms);

	const createdAt = req.body.date;
	const paymentDue = dateCreated.toISOString().split("T")[0];
	const description = req.body.description;

	const status = req.body.status;
	const items = req.body.listOfItems;

	sumTotal = items.map((item) => {
		let eachPrice = item.quantity * item.price;
		const roundedPrice = utilityController.roundNumber(eachPrice, 2);

		return roundedPrice;
	});

	const street = req.body.clientStreet;
	const city = req.body.clientCity;
	const postCode = req.body.clientPostCode;
	const country = req.body.clientCountry;
	const clientName = req.body.clientName;
	const clientEmail = req.body.clientEmail;

	const user = await User.findById(req.userId);

	// console.log(`${req.userId} invoice`);

	if (!user) {
		return res
			.status(401)
			.json({ message: "Not Authorized! You must be logged in." });
	}

	const totalSum = utilityController.getPriceSum(sumTotal);
	const roundedSum = utilityController.roundNumber(totalSum, 2);

	const newInvoice = new Invoice({
		id: generateRandomString(),
		createdAt: createdAt,
		paymentDue: paymentDue,
		description: description,
		paymentTerms: paymentTerms,
		status: status,
		creator: user,
		clientName: clientName,
		clientEmail: clientEmail,
		// clientAddress: {
		// 	street: street,
		// 	city: city,
		// 	postCode: postCode,
		// 	country: country,
		// },
		clientStreet: street,
		clientPostCode: postCode,
		clientCity: city,
		clientCountry: country,
		items: items.map((item) => {
			let totalValue = item.price * item.quantity;
			return {
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				total: utilityController.roundNumber(totalValue, 2),
			};
		}),

		total: roundedSum,
	});

	const createdInvoice = await newInvoice.save();

	if (user) {
		user.invoice.push(createdInvoice);
		await user.save();
	}

	if (createdInvoice) {
		// return res.status(201).json({ invoice: createdInvoice, statusCode: 201 });
		return res
			.status(201)
			.json({ message: "Invoice successfully created", statusCode: 201 });
	} else {
		return res.status(401).json({ message: "Error", statusCode: 401 });
	}
};

exports.getInvoices = async (req, res, next) => {
	if (!req.isAuth) {
		return res.status(401).json({ message: "Not Authenticated" });
	}

	// const user = req.userId;
	const user = await User.findById(req.userId);
	// const invoiceId = req.params.invoiceId;

	// console.log(req.userId);

	const invoice = await Invoice.find({ creator: { $eq: user } });

	const mainInvoice = await Invoice.find({}, function (err, result) {
		if (err) {
			console.log(error);
			return res.status(400).json({ errorMessage: error });
		} else {
			// console.log(result);
			return res.status(200).json({ invoice: invoice, statusCode: 200 });
		}
	});

	return mainInvoice;
};

exports.getInvoice = async (req, res, next) => {
	console.log(req.isAuth);
	if (!req.isAuth) {
		return res
			.status(401)
			.json({ message: "Not Authenticated", statusCode: 401 });
	}

	const invoiceId = req.params.invoiceId;

	if (!invoiceId) {
		return res
			.status(401)
			.json({ message: "Invoice does not exist", statusCode: 401 });
	}

	const invoice = await Invoice.find({
		_id: { $eq: invoiceId },
	});

	return res.status(200).json({ invoice: invoice, statusCode: 200 });
};

exports.updateInvoice = async (req, res, next) => {
	let dateCreated, sumTotal;

	const paymentTerms = req.body.paymentTerms;

	dateCreated = new Date(req.body.createdAt);
	dateCreated.setDate(dateCreated.getDate() + paymentTerms);

	const createdAt = req.body.createdAt;
	const paymentDue = dateCreated.toISOString().split("T")[0];
	const description = req.body.description;

	const status = req.body.status;
	const items = req.body.items;

	sumTotal = items.map((item) => {
		let eachPrice = item.quantity * item.price;
		const roundedPrice = utilityController.roundNumber(eachPrice, 2);

		return roundedPrice;
	});

	const street = req.body.clientStreet;
	const city = req.body.clientCity;
	const postCode = req.body.clientPostCode;
	const country = req.body.clientCountry;
	const clientName = req.body.clientName;
	const clientEmail = req.body.clientEmail;

	if (!req.isAuth) {
		return res.status(401).json({
			message: "Not Authorized to perform this operation",
			statusCode: 401,
		});
	}

	const invoiceId = req.params.invoiceId;

	if (!invoiceId) {
		return res
			.status(401)
			.json({ message: "Invoice does not exist", statusCode: 401 });
	}

	const update = await Invoice.find({ _id: { $eq: invoiceId } });

	if (!update) {
		return res
			.status(401)
			.json({ message: "Invoice does not exist", statusCode: 401 });
	}

	const totalSum = utilityController.getPriceSum(sumTotal);
	const roundedSum = utilityController.roundNumber(totalSum, 2);

	const updatedInvoice = new Invoice({
		_id: update[0]._id,
		createdAt: createdAt,
		paymentDue: paymentDue,
		description: description,
		paymentTerms: paymentTerms,
		status: status,
		clientName: clientName,
		clientEmail: clientEmail,
		// clientAddress: {
		// 	street: street,
		// 	city: city,
		// 	postCode: postCode,
		// 	country: country,
		// },
		clientStreet: street,
		clientPostCode: postCode,
		clientCity: city,
		clientCountry: country,
		items: items.map((item) => {
			let totalValue = item.price * item.quantity;
			return {
				name: item.name,
				price: item.price,
				quantity: item.quantity,
				total: utilityController.roundNumber(totalValue, 2),
			};
		}),

		total: roundedSum,
	});

	const mainUpdate = await Invoice.updateOne(
		{ _id: invoiceId },
		updatedInvoice
	);

	if (!mainUpdate) {
		return res.status(400).json({ message: "Update Failed", statusCode: 400 });
	}

	// console.log(updatedInvoice.status);

	return res.status(201).json({
		message: "Invoice Successfully updated!",
		statusCode: 200,
	});
};

exports.deleteInvoice = async (req, res, next) => {
	if (!req.isAuth) {
		return res.status(400).json({
			message: "Not Authorized to perform this operation",
			statusCode: 401,
		});
	}

	const userId = req.userId;
	const invoiceId = req.params.invoiceId;
	const invoice = await Invoice.findById(invoiceId);
	const user = await User.findById(userId);

	if (!user) {
		return res
			.status(400)
			.json({ message: "User does not exist!", statusCode: 400 });
	}

	if (!invoice) {
		return res.status(400).json({
			message: "Invoice does not exist, operation failed!",
			statusCode: 400,
		});
	}

	if (userId.toString() !== invoice.creator.toString()) {
		return res.status(400).json({ message: "Not Authorized!" });
	}

	await Invoice.deleteOne({ _id: invoiceId });

	await user.invoice.pull(invoiceId);
	await user.save();

	return res
		.status(200)
		.json({ message: "Invoice Successfully deleted!", statusCode: 200 });
};
