


import useAuth from '../Components/useAuth';
import styled from 'styled-components';
import { Button } from '@mui/material';

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9; 
  min-height: 100vh; 
`;

const Title = styled.h1`
  text-align: center;
  color: #333; 
`;

const UserInfo = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #555; 
`;

const LogoutButton = styled(Button)`
  margin-top: 20px;
  background-color: #e91e63; 
  color: white;
  &:hover {
    background-color: #c2185b; 
  }
`;

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Title>Profile</Title>
      {user ? (
        <UserInfo>
          <p>Email: {user.email}</p>
          <LogoutButton variant="contained" onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Please log in to view your profile.</p>
      )}
    </Container>
  );
};

export default ProfilePage;
