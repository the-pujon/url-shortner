/// Live Server
import nodemailer from 'nodemailer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';

// Setup the transporter for sending emails
export const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "tripnestlimited@tripnest.net", 
      pass: '7LX5dD4TSSQ0',  
    },
  });

  const mailOptions = {
    from: "tripnestlimited@tripnest.net",  
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: options.html || options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);  
    throw new AppError(httpStatus.BAD_REQUEST, "Email sending failed, something went wrong!");
  }

  return {
    transporter,
    mailOptions,
  };
};

export const getEmailTemplate = (filePath: string, replacements: { [key: string]: any }) => {
  try {
    const absolutePath = path.resolve(process.cwd(), 'templates', filePath); 
    let template = fs.readFileSync(absolutePath, { encoding: 'utf-8' });
    for (const key in replacements) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }

    return template;
  } catch (error) {
    console.error("Error reading email template:", error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Email template loading failed.");
  }
};

