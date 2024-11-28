import express from 'express';
import cors from 'cors';
import pool from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

const app = express();
const secret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

app.post('/accounts', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the username is provided
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Username, email and password are required' });
    }

    try {
        // Check if the username already exists
        console.log("checking if the username already exist...")
        const checkUser = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);
        console.log("Query complete, checking row...")

        console.log("checking if the email already exist...")
        const checkEmail = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
        console.log("Query complete, checking row...")

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        if (checkEmail.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const bcryptPassword = await bcrypt.hash(password, 10);

        // Create a new account in the database
        const newUser = await pool.query(
            'INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, bcryptPassword]
        );

        return res.status(201).json({ success: true, message: 'Account created successfully', data: newUser.rows[0] });
    } catch (error) {
        console.error('Error during account creation:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
});

// GET: Check if account exists
app.get('/accounts', async (req, res) => {
    try {
        const allAccounts = await pool.query('SELECT * FROM accounts');
        res.json(allAccounts.rows);
    } catch (err) {
        console.error('Error fetching accounts:', err);
        res.status(500).json({ success: false, message: 'Error fetching accounts' });
    }
});

// POST: Send email
app.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    const TOKEN = process.env.MAILTRAP_TOKEN;

    try {
        const user = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).send({ message: "User not found." });
        }

        const token = jwt.sign({ email }, secret, { expiresIn: '5m' });
        const url = `http://192.168.1.53:5173/reset-password/${token}`;

        const transport = Nodemailer.createTransport(
            MailtrapTransport({
                token: TOKEN,
            })
        );
        const sender = {
            address: "hello@arpthef.my.id",
            name: "ArpTheF",
        };
        const recipients = [
            email,
        ];
        transport
            .sendMail({
                from: sender,
                to: recipients,
                subject: "Reset Password",
                text: `Click this link to reset your password: ${url}`,
                category: "Reset Password",
            })
            .then(console.log, console.error);
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    };
});

app.post('/reset-password-form', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, secret);
        const { email } = decoded;

        const user = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).send({ message: "User not found." });
        }

        const bcryptPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await pool.query('UPDATE accounts SET password = $1', [bcryptPassword]);

        return res.status(200).send({ message: "Password reset successfully." });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ success: false, message: 'Looks like the link is expired.' });
    }
});

app.post('/login', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(404).send({ message: "User not found." });
        }

        const tokenauth = jwt.sign({ username }, secret, { expiresIn: '1m' });

        return res.status(200).send({ message: "Login successful.", tokenauth });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
});

app.post('/id', async (req, res) => {
    const { tokenauth } = req.body;
    try {
        const decoded = jwt.verify(tokenauth, secret);
        const { username } = decoded;

        const user = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);

        return res.status(200).send({ message: "User found.", data: user.rows[0] });
    } catch (error) {
        console.error('Error during getting user:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
});

app.post('/logout', async (req, res) => {
    const { tokenauth } = req.body;

    try {
        const decoded = jwt.verify(tokenauth, secret);
        const { username } = decoded;

        return res.status(200).send({ message: "Logout successful." });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
