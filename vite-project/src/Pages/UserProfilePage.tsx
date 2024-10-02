
import React, { useState } from 'react';
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

const UserImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
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

const SetupButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 1rem;
  &:hover {
    background-color: #388e3c;
  }
`;

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setProfilePicture(fileURL);
    }
  };

  const handleSetupProfile = () => {
    if (username.trim() === '') {
      alert('Please enter a unique username.');
    } else {
      alert(`Profile set up with username: ${username}`);
      
    }
  };

  return (
    <Container>
      <Title>Profile Setup</Title>
      {user ? (
        <UserInfo>
          {profilePicture && <UserImage src={profilePicture} alt="Profile" />}
          <p>Email: {user.email}</p>
          <input 
            type="text" 
            placeholder="Enter a unique username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <SetupButton onClick={handleSetupProfile}>Set Up Profile</SetupButton>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </UserInfo>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          Please log in to set up your profile.
        </p>
      )}
    </Container>
  );
};

export default ProfilePage;
