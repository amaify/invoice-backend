const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	userName: {
		type: String,
		required: true,
	},

	userEmail: {
		type: String,
		required: true,
	},

	userPassword: {
		type: String,
		required: true,
	},

	resetLink: {
		data: String,
		default: "",
	},

	senderAddress: {
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

	invoice: [
		{
			type: Schema.Types.ObjectId,
			ref: "Invoice",
		},
	],
});

module.exports = mongoose.model("User", userSchema);
