import React, { useState } from 'react';
import RavePaymentModal from 'react-ravepayment';
import './Payment.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
const Payment = ({ setAlert, isAuthenticated, user }) => {
  var email;
  if (user != null) {
    var { email } = user;
    email = email;
  }
  const [deets, setDeets] = useState({
    key: 'FLWPUBK-6b5f592d963f5b9054e633eb59576887-X',
    email: email,
    amount: 1
  });
  const callback = response => {};
  const close = () => {};
  const getReference = () => {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=';
    for (let i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  return (
    <div className='payment-page'>
      {!isAuthenticated ? (
        (setAlert('You need to be logged in to do that', 'danger'),
        <Redirect to='/login' />)
      ) : (
        <div className='payment-container' id='payment'>
          <h2 id='upgrade'>Upgrade Plan</h2>
          <div className='payment'>
            <h2 className='partner'>PRO</h2>
            <h1 className='price'>N3,999 monthly</h1>
            {}
            <br />
            <p>Unlimited storage</p>
            <p>Unlimited Email transfers</p>
            <p>Unlimited Link transfers</p>
            <p>Delete uploads</p>
            {}
            {}
            <RavePaymentModal
              text='Make Payment'
              className='upgrade_btn'
              metadata={[{ metaname: 'Device', metavalue: 'IPhone X' }]}
              reference={getReference()}
              email={deets.email}
              amount={deets.amount}
              ravePubKey={deets.key}
              callback={callback}
              close={close}
              isProduction={!0}
              tag='button'
            />
            {}
          </div>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});
export default connect(
  mapStateToProps,
  { setAlert }
)(Payment);
