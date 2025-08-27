import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to, message) => {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to
    });

    console.log("SMS göndərildi:", sms.sid);
    return true;
  } catch (err) {
    console.error("SMS xətası:", err);
    return false;
  }
};
