//Currency.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import "../styles/Currency.css";
import { toast } from 'react-toastify';

/**
 * The CurrencyConverter component allows users to convert amounts from one currency to another.
 * It dynamically adjusts the target currency based on the user's nationality and provides real-time conversion rates.
 */
function CurrencyConverter() {
  const { userProfile } = useUser();
  const [fromCurrency, setFromCurrency] = useState('SGD');
  const [toCurrency, setToCurrency] = useState('UYU');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect hook to adjust the target currency based on the user's nationality.
  useEffect(() => {

    if (userProfile && userProfile.nationality) {
      switch (userProfile.nationality) {
        case 'Indian':
          setToCurrency('INR');
          break;
        case 'Chinese':
          setToCurrency('CNY');
          break;
        case 'Malaysian':
          setToCurrency('MYR');
          break;
        default:
          setToCurrency('UYU');
          break;
      }
    }
  }, [userProfile]);

    /**
   * Fetches the conversion rate from a currency conversion API.
   * Sets the conversion rate and the converted amount on successful fetch,
   * or an error message if the fetch fails.
   */
  const fetchConversionRate = async () => {
    setLoading(true);
    setError('');
    try {
      const options = {
        method: 'GET',
        url: 'https://currency-converter241.p.rapidapi.com/convert',
        params: { from: fromCurrency, to: toCurrency, amount: amount },
        headers: {
          'X-RapidAPI-Key': '8a772231aamshb51aad46f08dee9p1b3105jsn222a34c99ca5',
          'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com'
        }
      };
      const response = await axios.request(options);
      setRate(parseFloat(parseFloat(response.data.rate).toFixed(6)));
      setConvertedAmount(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch conversion rate');
      setLoading(false);
    }
  };


  /**
   * Handles changes to the amount input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the amount input field.
   */
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

    /**
   * Handles the submission of the currency conversion form.
   * Validates the input amount and fetches the conversion rate.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    setRate("");
    setConvertedAmount(0);
    event.preventDefault();
    if(amount==""){
      toast.info("Please enter an amount first!");
      return;
    }
    if(isNaN(amount)){
      toast.info("Please enter a valid numerical amount!");
      return;
    }
    if(amount<=0){
      toast.info("Please enter a positive amount!");
      return;
    }
    
    fetchConversionRate();
  };

    /**
   * Switches the values of the fromCurrency and toCurrency states.
   */
  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setRate("");
    setAmount("");
    setConvertedAmount(0);
  };

  return (
    <div>
      <h2>Currency Converter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>From Currency:</label>
          <input type="text" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} />
        </div>
        <button type="button" onClick={switchCurrencies}>Switch</button>
        <div>
          <label>To Currency:</label>
          <input type="text" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={handleAmountChange} />
        </div>
        <button type="submit" disabled={loading}>Convert</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div id="convert">
          <p>Rate: {rate}</p>
          <p>Converted Amount: {convertedAmount.toFixed(2)} {toCurrency}</p>
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;
