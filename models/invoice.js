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
		// required: true,
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
		// required: true,
	},

	clientEmail: {
		type: String,
		// required: true,
	},

	// clientAddress: {
	// 	street: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	city: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	postCode: {
	// 		type: String,
	// 		required: true,
	// 	},
	// 	country: {
	// 		type: String,
	// 		required: true,
	// 	},
	// },

	clientStreet: {
		type: String,
		// required: true,
	},

	clientCity: {
		type: String,
		// required: true,
	},

	clientPostCode: {
		type: String,
		// required: true,
	},

	clientCountry: {
		type: String,
		// required: true,
	},

	items: [
		{
			name: {
				type: String,
				// required: true,
			},

			quantity: {
				type: Number,
				// required: true,
			},

			price: {
				type: Number,
				// required: true,
			},

			total: {
				type: Number,
				// required: true,
			},
		},
	],
	total: {
		type: Number,
		// required: true,
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = mongoose.model("Invoice", invoiceSchema);
