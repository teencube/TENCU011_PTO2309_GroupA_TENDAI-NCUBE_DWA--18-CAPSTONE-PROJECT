
import React, { useState } from 'react';
import useAuth from '../Components/useAuth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for the form and its elements
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
`;

const FormWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const FormTitle = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #4e54c8;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #383e6b;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 10px 0;
`;

const TextLink = styled.p`
  margin-top: 20px;
  color: #555;
`;

const LinkButton = styled.a`
  color: #4e54c8;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #383e6b;
  }
`;

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // State for error messages
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    try {
      await signUp(email, password);
      navigate('/Home');
    } catch (error) {
      // Specify the error type explicitly as an instance of Error
      const err = error as Error;
      setError(err.message || 'Sign up failed. Please try again.'); // Set error message
    }
  };

  return (
    <Container>
      <FormWrapper>
        <FormTitle>Create Account</FormTitle>
        <Form onSubmit={handleSignUp}>
          <Label>
            Username:
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Label>
          <Label>
            Phone Number:
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Label>
          <Label>
            Email:
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          <Label>
            Password:
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Label>
          {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error message */}
          <SubmitButton type="submit">Sign Up</SubmitButton>
          <TextLink>
            Already have an account?{' '}
            <LinkButton onClick={() => navigate('/Login')}>Login</LinkButton>
          </TextLink>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default SignUpPage;
