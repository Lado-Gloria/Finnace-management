import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API URL for the backend
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
 
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const response = await axios.post(`${apiUrl}/transactions`, {
        account_id: accountId,
        amount: parseFloat(amount), 
      });

     
      const { data } = await axios.get(`${apiUrl}/accounts/${accountId}`);
      
  
      setTransactions((prev) => [
        { 
          account_id: accountId, 
          amount: parseFloat(amount), 
          balance: data.balance 
        },
        ...prev,
      ]);
      
    } catch (error) {
      console.error('Error submitting transaction:', error);
      
    }

   
    setAccountId('');
    setAmount('');
  };

 
  useEffect(() => {
    console.log('Updated Transactions:', transactions);
  }, [transactions]);

  return (
    <div className="App">
      <h1>Transaction Management</h1>
      <form onSubmit={handleSubmit}>
        {/* Input field for Account ID */}
        <input
          data-type="account-id" 
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Account ID"
          required
        />
        {/* Input field for Amount */}
        <input
          data-type="amount" 
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        {/* Submit button */}
        <button data-type="transaction-submit" type="submit">
          Submit Transaction
        </button>
      </form>
      {/* Display the list of transactions */}
      <div>
        {transactions.map((transaction, index) => (
          <div
            key={index}
            data-type="transaction" 
            data-account-id={transaction.account_id} 
            data-amount={transaction.amount} 
            data-balance={transaction.balance} 
          >
            Account ID: {transaction.account_id}, Amount: {transaction.amount}, Balance: {transaction.balance}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
