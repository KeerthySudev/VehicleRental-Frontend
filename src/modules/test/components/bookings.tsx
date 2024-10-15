import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const SEND_VERIFICATION = gql`
  mutation sendVerification($phoneNumber: String!) {
    sendVerification(phoneNumber: $phoneNumber)
  }
`;

const VERIFY_CODE = gql`
  mutation verifyCode($phoneNumber: String!, $code: String!) {
    verifyCode(phoneNumber: $phoneNumber, code: $code)
  }
`;

const PhoneVerification = () => {
  const [sendVerification] = useMutation(SEND_VERIFICATION);
  const [verifyCode] = useMutation(VERIFY_CODE);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  const handleSendCode = async () => {
    try {
      const { data } = await sendVerification({ variables: { phoneNumber } });
      alert(`Code sent. Status: ${data.sendVerification}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const { data } = await verifyCode({ variables: { phoneNumber, code } });
      alert(data.verifyCode);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <button onClick={handleSendCode}>Send Code</button>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Verification Code"
      />
      <button onClick={handleVerifyCode}>Verify Code</button>
    </div>
  );
};

export default PhoneVerification;