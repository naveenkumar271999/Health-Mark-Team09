// Import necessary elements
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { checkoutCart, clearCartLocally } from '../../../../context/slices/cartSlice';
import toast from 'react-hot-toast';

const Checkout = ({ cart }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe.js has not yet loaded.');
            return;
        }

        setLoading(true);

        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                console.error(error);
                toast.error('Error processing payment.');
                setLoading(false);
                return;
            }

            const response = await dispatch(checkoutCart(cart, paymentMethod.id));

            if (response.payload.status === 200) {
                // Clear cart locally or perform other actions
                dispatch(clearCartLocally());
                toast.success('Payment successful!');
            } else {
                toast.error('Payment failed.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error processing payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                Pay Now
            </button>
        </form>
    );
};

export default Checkout;
