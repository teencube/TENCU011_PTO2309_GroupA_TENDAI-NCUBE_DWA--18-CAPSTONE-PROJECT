
import styled from 'styled-components';
import useAuth from '../Components/useAuth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const UserInfo = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const LogoutButton = styled.button`
  background-color: #e91e63;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1rem;
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
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>Please log in to view your profile.</p>
      )}
    </Container>
  );
};

export default ProfilePage;
