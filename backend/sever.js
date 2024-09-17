const express = require('express');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); 
app.use(express.json()); 

// In-memory storage for accounts and transactions
let accounts = {};
let transactions = {};


function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});


app.post('/transactions', (req, res) => {
  const { account_id, amount } = req.body;

  
  if (!account_id || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

 
  if (!accounts[account_id]) {
    accounts[account_id] = { balance: 0 };
  }

 
  accounts[account_id].balance += amount;


  const transaction_id = uuid();
  const transaction = { transaction_id, account_id, amount };
  transactions[transaction_id] = transaction;


  res.status(201).json({
    transaction_id,
    account_id,
    amount,
    balance: accounts[account_id].balance 
  });
});


app.get('/transactions/:transactionId', (req, res) => {
  const transaction = transactions[req.params.transactionId];
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(200).json(transaction);
});


app.get('/accounts/:accountId', (req, res) => {
  const account = accounts[req.params.accountId];
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }


  const accountTransactions = Object.values(transactions).filter(
    (transaction) => transaction.account_id === req.params.accountId
  );

  res.status(200).json({
    account_id: req.params.accountId,
    balance: account.balance,
    transactions: accountTransactions
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
