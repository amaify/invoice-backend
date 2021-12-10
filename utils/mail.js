const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		"https://developers.google.com/oauthplayground"
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN,
	});

	const accessToken = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				console.log(err);
				reject();
			}
			resolve(token);
		});
	});

	const transporter = nodemailer.createTransport({
		service: "gmail",
		port: 465,
		secure: true,
		auth: {
			type: "OAuth2",
			user: process.env.GOOGLE_USERNAME,
			accessToken: accessToken,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	return transporter;
};

function resetPasswordEmail(token, email, user) {
	let content = `
    <html>
      <div>
        <h1 style = "text-align: left; font-size: 3rem; color: #333; font-weight: 300; margin-bottom: 20px">Reset your Password</h1>
        <p style="color: #777; font-size: 18px">Hi ${user.userName},</p>
        <p style="font-size: 18px; color: #777; margin-bottom: 32px;">Seems like you forgot your password. Reset your password by clicking the link below.</p>
        <a 
          href="https://amaify-invoice.netlify.app/reset-password/${token}" 
          target="_blank"
          style="font-size: 16px; text-decoration: none; background-color: #1752ab; color: #fff; padding-top: 6px; padding-bottom: 6px; padding-right: 10px; padding-left: 10px; margin-bottom: 32px;">
          Reset My Password
        </a>
		Or copy and paste the link in your web browser
		https://amaify-invoice.netlify.app/reset-password/${token}
        <p style="font-size: 18px; color: #777;">
          Ignore this email if you did not initiate this request.
        </p>
      </div>
    </html>
  `;

	const sendMail = async (emailOptions) => {
		const emailTransporter = await createTransporter();
		await emailTransporter.sendMail(emailOptions);
	};

	sendMail({
		subject: "Password Reset",
		html: content,
		to: email,
		from: process.env.GOOGLE_USERNAME,
	});
}

module.exports = {
	resetPasswordEmail,
};
