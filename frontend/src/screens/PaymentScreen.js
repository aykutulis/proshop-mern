import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!userInfo) history.push('/login?redirect=/shipping');
    if (!shippingAddress) history.push('/shipping');
  }, [userInfo, history, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Button type='submit'>Continue</Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
