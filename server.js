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
    try {
        console.log('Request received:', req.body);

        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com', // Outlook SMTP server
            port: 587, // Port for TLS/STARTTLS
            secure: false, // Use TLS (false) instead of SSL (true)
            auth: {
                user: process.env.EMAIL_USER, // Your Outlook email address
                pass: process.env.EMAIL_PASS  // Your Outlook email password
            },
            tls: {
                ciphers: 'SSLv3' // Optional: Outlook sometimes requires this setting
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
                console.error('Error sending email:', error);
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ success: 'Message sent successfully!' });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

app.get('/api/test', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
