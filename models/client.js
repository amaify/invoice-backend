const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
	clientName: {
		type: String,
		required: true,
	},

	clientEmail: {
		type: String,
		required: true,
	},

	clientAddress: {
		street: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		postCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
});

module.exports = mongoose.model("Client", clientSchema);
