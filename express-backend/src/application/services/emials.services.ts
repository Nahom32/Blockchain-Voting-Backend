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