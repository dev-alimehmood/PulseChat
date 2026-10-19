import { sender_email } from "../config/aws.js";
import { generatePulseEmailHtml } from "./PulseEmailTemplate.js";

const EmailTemplate = (receiver_email, subject, body) => {
  const html = generatePulseEmailHtml({
    title: `PulseChat — ${subject}`,
    headline: subject,
    bodyHtml: `<p>${body}</p>`,
  });

  return {
    Source: sender_email || `"PulseChat" <no-reply@pulsechat.app>`,
    Destination: { ToAddresses: [receiver_email] },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: `PulseChat — ${subject}`,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
    },
  };
};

export default EmailTemplate;
