
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import useAuth from '../Components/useAuth';

// Animations
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1f1c2c, #928dab);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 8s ease infinite;
`;

const FormWrapper = styled.div`
  background: rgba(31, 31, 31, 0.85);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  transform: translateY(-10px);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(0);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
  }
`;

const FormTitle = styled.h1`
  margin-bottom: 20px;
  color: #f5f5f5;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  text-align: left;
  font-weight: bold;
  color: #f5f5f5;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(45, 45, 45, 0.8);
  color: #f5f5f5;

  &:focus {
    background: rgba(60, 60, 60, 0.9);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #f5f5f5;
`;

const SubmitButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #1f1c2c, #928dab);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
  font-weight: bold;

  &:hover {
    background: linear-gradient(135deg, #383e6b, #555a8f);
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 10px 0;
`;

const TextLink = styled.p`
  margin-top: 20px;
  color: #d1d1d1;
  font-size: 14px;
  letter-spacing: 0.5px;
`;

const LinkButton = styled.a`
  color: #ffd700;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #ffec8b;
  }
`;

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Resets error message
    try {
      await signUp(email, password);
      navigate('/Home');
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Sign up failed. Please try again.');
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
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '👁️' : '👁️‍🗨️'} {/* Eye icon */}
              </EyeIcon>
            </PasswordWrapper>
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
