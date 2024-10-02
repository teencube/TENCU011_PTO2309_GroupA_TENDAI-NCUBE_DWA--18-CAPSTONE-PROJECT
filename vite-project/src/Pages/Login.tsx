import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '../Components/useAuth';

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

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth(); // Access login function and error state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/HomePage'); 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Error handling is now managed in the useAuth context
    }
  };

  return (
    <Container>
      <FormWrapper>
        <FormTitle>Login</FormTitle>
        <Form onSubmit={handleLogin}>
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
            Password:
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Label>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
          <SubmitButton type="submit">Login</SubmitButton>
          <TextLink>
            Don't have an account?{' '}
            <LinkButton onClick={() => navigate('/signup')}>Create Account</LinkButton>
          </TextLink>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default LoginPage;
