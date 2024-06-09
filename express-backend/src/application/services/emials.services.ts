import { Member } from '@application/oraganizatins/organization.models';
import { notifyMemberTemplate } from '@shared/templates';
import nodemailer from 'nodemailer';


export interface MailInterface {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html: string;
}

async function createConnection() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

    

export async function verifyTransporter(): Promise<boolean>{
    const transporter = await createConnection();
    let VerificaionResponse = false;
    await transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            VerificaionResponse = true;
            console.log('Server is ready to take our messages');
        }
    });
    return VerificaionResponse;
}





export default async function sendMail(mail: MailInterface): Promise<void> {
    const transporter = await createConnection();
    await transporter.sendMail(mail)
        .then((info) => {
            console.log('Message sent: %s', info.messageId);
        })
        .catch((err) => {
            console.log('Error: ', err);
        });
}

const emailQueue: Member[] = [];
let isProcessing = false;
let organizationName = "";

// Function to process the email queue
const processQueue = async (): Promise<void> => {
  if (isProcessing || emailQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const job = emailQueue.shift() as Member;
  if (!job) {
    isProcessing = false;
    return;
  }

  try {
    const { name, email } = job;
    const emailTemplate = notifyMemberTemplate(name, organizationName);
    const mail: MailInterface = {
      to: email,
      subject: "Welcome to the organization",
      html: emailTemplate.html,
    };

    await sendMail(mail);
  } catch (error) {
    console.error("Error sending email:", error);
  } finally {
    isProcessing = false;
    // Process the next job in the queue
    processQueue();
  }
};

// Function to queue emails for processing
export const queueEmails = (
  members: Member[],
  name: string
): void => {
  members.forEach((member) => {
    emailQueue.push(member);
  });

  // Start processing the queue
  organizationName = name;
  processQueue();
};