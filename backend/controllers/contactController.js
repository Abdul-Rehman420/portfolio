const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendContactEmail = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const htmlContent = message.replace(/\n/g, '<br>');

    // Notify you (the site owner)
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact: ${subject || 'No Subject'}`,
      html: `<h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <hr>
        <p>${htmlContent}</p>
        <hr>
        <p><small>Sent from your portfolio contact form.</small></p>`,
    });

    // Auto-reply to visitor (requires verified domain in Resend)
    try {
      await resend.emails.send({
        from: 'Abdul Rehman <onboarding@resend.dev>',
        to: email,
        subject: `Thank you for contacting me, ${name}!`,
        html: `<h2>Thank You for Reaching Out!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting me. I have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your Message:</strong></p>
          <p>${htmlContent}</p>
          <hr>
          <p>Best regards,<br>Abdul Rehman</p>`,
      });
    } catch (_) {
      // Auto-reply fails silently if visitor email isn't verified in Resend
    }

    res.json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};