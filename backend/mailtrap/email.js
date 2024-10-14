import { mailtrapClient, sender } from './mailtrap.config.js';

import { VERIFICATION_EMAIL_TEMPLATE } from './emailTempletes.js';

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipent,
      subject: 'Verify your email',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken
      ),
      category: 'Email Verification',
    });

    console.log('Email sent succesfully', response);
  } catch (error) {
    console.log('Error sending verification', error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};
