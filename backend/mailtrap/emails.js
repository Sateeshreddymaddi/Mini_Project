import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
// import { MailtrapClient } from "mailtrap";
import { mailtrapClient } from "./mailtrap.config.js";

import { sender } from "./mailtrap.config.js"; // Ensure mailtrapClient is imported correctly

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
		});

		console.log("Verification email sent successfully:", response);
	} catch (error) {
		console.error("Error sending verification email:", error);
		throw new Error(`Error sending verification email: ${error.message}`);
	}
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df", // Replace with your Mailtrap template UUID
			template_variables: {
				company_info_name: "Online Exam Portal",
				name: name,
			},
		});

		console.log("Welcome email sent successfully:", response);
	} catch (error) {
		console.error("Error sending welcome email:", error);
		throw new Error(`Error sending welcome email: ${error.message}`);
	}
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully:", response);
	} catch (error) {
		console.error("Error sending password reset email:", error);
		throw new Error(`Error sending password reset email: ${error.message}`);
	}
};

// Send Password Reset Success Email
export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset success email sent successfully:", response);
	} catch (error) {
		console.error("Error sending password reset success email:", error);
		throw new Error(`Error sending password reset success email: ${error.message}`);
	}
};
