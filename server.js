const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');



const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());


// Serve static files from the current directory
app.use(express.static(path.join(__dirname, '')));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to handle form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    alert("test");

    // Create a transporter object using your SMTP server details
    const transporter = nodemailer.createTransport({
        service: 'Outlook', // Use your email service provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMIAL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form Submission from ${name}`,
        text: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send email.' });
        }
        res.status(200).json({ success: 'Message sent successfully!' });
    });
});

app.get('/api/test', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
