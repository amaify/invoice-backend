const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
	id: {
		type: String,
		required: true,
	},

	createdAt: {
		type: String,
		required: true,
	},

	paymentDue: {
		type: String,
		required: true,
	},

	description: {
		type: String,
	},

	paymentTerms: {
		type: Number,
		required: true,
	},

	status: {
		type: String,
		required: true,
	},

	clientName: {
		type: String,
	},

	clientEmail: {
		type: String,
	},

	clientStreet: {
		type: String,
	},

	clientCity: {
		type: String,
	},

	clientPostCode: {
		type: String,
	},

	clientCountry: {
		type: String,
	},

	items: [
		{
			name: {
				type: String,
			},

			quantity: {
				type: Number,
			},

			price: {
				type: Number,
			},

			total: {
				type: Number,
			},
		},
	],
	total: {
		type: Number,
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Invoice", invoiceSchema);
