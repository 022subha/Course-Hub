import { createTransport } from "nodemailer";

export const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res
        .status(201)
        .json({ success: false, message: "All fields are required." });

    const to = process.env.MY_MAIL;
    const subject = `Contact from Course Hub`;
    const text = `Name : ${name}\nEmail : ${email}\nMessage:\n${message}`;

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to,
      subject,
      text,
      from: "coursehub@admin.com",
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestCourse = async (req, res) => {
  try {
    const { name, email, course } = req.body;

    if (!name || !email || !course)
      return res
        .status(201)
        .json({ success: false, message: "All fields are required." });

    const to = process.env.MY_MAIL;
    const subject = `Course Request on Course Hub`;
    const text = `Name : ${name}\nEmail : ${email}\nCousre:\n${course}`;

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to,
      subject,
      text,
      from: "coursehub@admin.com",
    });

    res.status(200).json({
      success: true,
      message: "Your request has been sent successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
