import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

export async function sendWhatsApp(phone, code) {
  return client.messages.create({
    from: "whatsapp:+16467838907",
    to: `whatsapp:${phone}`,
    body: `Your OTP is: ${code}`,
  });
}
