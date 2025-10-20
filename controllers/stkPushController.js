// controllers/stkPushController.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const initiateStkPush = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    // Get access token
    const tokenRes = await axios.get(
      'https://safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: { username: consumerKey, password: consumerSecret },
      }
    );

    const token = tokenRes.data.access_token;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, '')
      .slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const stkPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: orderId,
      TransactionDesc: 'Ecommerce Purchase',
    };

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).json(stkRes.data);
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ errorMessage: 'Failed to initiate STK Push.' });
  }
};
