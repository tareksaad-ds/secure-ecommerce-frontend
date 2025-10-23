'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './PaymentForm.css';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef'
);

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntent: unknown) => void;
  onError: (error: unknown) => void;
}

interface FormData {
  cardholderName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const PaymentFormComponent: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    cardholderName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get the card element
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        setError('Card element not found');
        setIsProcessing(false);
        return;
      }

      // Create payment method using Stripe Elements
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: formData.cardholderName,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        });

      if (pmError) {
        setError(pmError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // For demo purposes, we'll simulate a successful payment
      // In a real application, you would send the payment method to your backend
      // and create a payment intent there

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment
      const mockPaymentIntent = {
        id: 'pi_' + Math.random().toString(36).substr(2, 9),
        status: 'succeeded',
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        payment_method: paymentMethod.id,
      };

      onSuccess(mockPaymentIntent);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="payment-form-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-section">
          <h3 className="section-title">Payment Information</h3>

          <div className="form-group">
            <label htmlFor="cardholderName" className="form-label">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) =>
                handleInputChange('cardholderName', e.target.value)
              }
              className="form-input"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Card Details</label>
            <div className="stripe-elements-container">
              <div className="stripe-element-wrapper">
                <CardNumberElement options={cardElementOptions} />
              </div>
              <div className="stripe-elements-row">
                <div className="stripe-element-wrapper">
                  <CardExpiryElement options={cardElementOptions} />
                </div>
                <div className="stripe-element-wrapper">
                  <CardCvcElement options={cardElementOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="form-select"
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="NL">Netherlands</option>
            <option value="SE">Sweden</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="payment-button"
        >
          {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent {...props} />
    </Elements>
  );
};

export default PaymentForm;
