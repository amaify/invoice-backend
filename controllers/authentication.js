const User = require("../models/user");

const bcrypt = require("bcryptjs");
const _ = require("lodash");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { resetPasswordEmail } = require("../utils/mail");

exports.createUser = async (req, res, next) => {
	const userName = req.body.userName;
	const email = req.body.email;
	const password = req.body.password;
	const streetName = req.body.senderStreet;
	const city = req.body.senderCity;
	const postCode = req.body.senderPostCode;
	const country = req.body.senderCountry;

	const existingUser = await User.findOne({ userEmail: email });

	if (!validator.isEmail(email)) {
		return res
			.status(401)
			.json({ message: "Wrong email format", statusCode: 401 });
	}

	if (
		validator.isEmpty(password) ||
		!validator.isLength(password, { min: 5 })
	) {
		return res
			.status(401)
			.json({ message: "Password too short!", statusCode: 401 });
	}

	if (existingUser) {
		return res
			.status(401)
			.json({ message: "User already exists!", statusCode: 401 });
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const user = new User({
		// firstName: firstName,
		// lastName: lastName,
		userName: userName,
		userEmail: email,
		userPassword: hashedPassword,
		senderAddress: {
			street: streetName,
			city: city,
			postCode: postCode,
			country: country,
		},
	});

	const createdUser = await user.save();

	return res.status(201).json({ user: createdUser, statusCode: 201 });
};

exports.userLogin = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await User.findOne({ userEmail: email });

	if (!user) {
		return res
			.status(401)
			.json({ message: "User does not exist!", statusCode: 401 });
	}

	const userPassword = await bcrypt.compare(password, user.userPassword);

	if (!userPassword) {
		return res
			.status(401)
			.json({ message: "Username or Password is invalid", statusCode: 401 });
	}

	const token = jwt.sign(
		{
			userId: user._id.toString(),
			email: user.email,
		},
		"secret",
		{ expiresIn: "1h" }
	);

	return res.status(200).json({
		token: token,
		senderAddress: {
			street: user.senderAddress.street,
			city: user.senderAddress.city,
			postCode: user.senderAddress.postCode,
			country: user.senderAddress.country,
		},
		statusCode: 200,
	});
};

exports.forgotPassword = async (req, res, next) => {
	const email = req.body.email;

	const user = await User.findOne({ userEmail: email });

	if (!user) {
		return res
			.status(401)
			.json({ message: "User does not exist!", statusCode: 400 });
	}

	const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1h" });

	return user.updateOne({ resetLink: token }, (err, success) => {
		if (!err) {
			resetPasswordEmail(token, email, user);
			return res.status(200).json({
				message: "Check your email for your reset link!",
				statusCode: 200,
			});
		}

		return res
			.status(400)
			.json({ message: "Something went wrong!", statusCode: 400 });
	});
};

exports.resetPassword = async (req, res, next) => {
	const { resetLink, password } = req.body;

	if (!resetLink) {
		return res.status(401).json({ message: "Authentication Error!" });
	}

	jwt.verify(resetLink, "secret", (err, decodedData) => {
		if (err) {
			return res
				.status(401)
				.json({ error: "Incorrect Token or it is expired!" });
		}
	});

	let user = await User.findOne({ resetLink: resetLink });

	if (!user) {
		return res.status(401).json({
			message: "User with this token does not exist",
			statusCode: 401,
		});
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const obj = {
		userPassword: hashedPassword,
		resetLink: "",
	};

	user = _.extend(user, obj);
	user.save((err, result) => {
		if (!err) {
			return res.status(200).json({
				message: "Password successfully changed!",
				statusCode: 200,
			});
		}
		return res.status(401).json({
			message: "Password reset Error; Please try again!",
			statusCode: 401,
		});
	});
};
