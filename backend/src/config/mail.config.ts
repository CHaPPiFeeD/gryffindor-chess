export default () => {
  const mailConfig = {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  };

  return { mailConfig };
};
