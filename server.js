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
            service: 'Outlook',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
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
                return res.status(500).json({ error: 'Failed to send email.' });
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
