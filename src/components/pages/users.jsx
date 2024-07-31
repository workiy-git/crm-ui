import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Paper, TextField } from '@mui/material'; // Import TextField for editing
import config from '../../config/config';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false); // State to toggle editing mode

    useEffect(() => {
        axios.get(`${config.apiUrl}/users`)
          .then((response) => {
            setUsers(response.data.data);
            console.log('Users:', response.data.data);
          })
          .catch((error) => {
            setError('Error fetching user data');
          });
    }, []);

    const navigate = useNavigate();

    const handleAddUser = () => {
        navigate('/adduser');
    }

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setEditing(false); // Disable editing mode when a user is clicked
    }

    const handleEditClick = () => {
        setEditing(true); // Enable editing mode
    }

    const handleSaveClick = () => {
        console.log('Selected User before update:', selectedUser);
        axios.put(`${config.apiUrl}/users/id/${selectedUser._id}`, selectedUser)
            .then((response) => {
                console.log('Selected User before update:', selectedUser._id);
                console.log('API Response:', response.data);
                const updatedUser = response.data;
                const updatedUsers = users.map(user => (user._id === updatedUser._id ? updatedUser : user));
                setUsers(updatedUsers);
                setSelectedUser(updatedUser);
                setEditing(false); // Disable editing mode after saving
            })
            .catch((error) => {
                console.error('Error updating user:', error);
                setError('Error updating user');
            });
    }
    
    

    const handleCancelClick = () => {
        setEditing(false); // Disable editing mode without saving
    }

    const handleChange = (e) => {
        setSelectedUser({
            ...selectedUser,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "gray", paddingLeft: 0 }}>
            <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                {/* <div style={{ backgroundColor: "#121A2C" }}>
                    <SideMenu />
                </div> */}
                <div style={{ width: '100%', background:'#D9D9D9' }}>
                    {/* <div>
                        <Header />
                    </div> */}
                    <div>
                        <Typography style={{ height: '4rem', color: 'white', padding: '10px', fontSize: '30px', background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)' }}>
                            Users
                        </Typography>
                    </div>
                    <div style={{ }}>
                        {error && <Typography color="error">{error}</Typography>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                            <Typography variant="h6">Active Users</Typography>
                            <Button variant="contained" color="primary" onClick={handleAddUser}>
                                Add User
                            </Button>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '50%', padding: '10px',  height:'64vh', overflow:'auto' }}>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <Paper 
                                            key={user._id} 
                                            style={{ marginBottom: '10px', padding: '10px', cursor: 'pointer', backgroundColor: selectedUser && selectedUser._id === user._id ? '#f0f0f0' : 'white' }}
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <Typography variant="h6">{user.first_name} {user.last_name}</Typography>
                                            <Typography>{user.job_role}</Typography>
                                        </Paper>
                                    ))
                                ) : (
                                    <Typography>No users found.</Typography>
                                )}
                            </div>
                            <div style={{ width: '50%', padding: '10px',  height:'64vh', overflow:'auto', boxShadow:'none', background:'none' }}>
                                {selectedUser && (
                                    <Paper style={{ padding: '10px', marginBottom: '10px' }}>
                                        {editing ? (
                                            <>
                                                <Typography variant="h5">Edit User</Typography>
                                                <TextField
                                                    name="first_name"
                                                    label="First Name"
                                                    value={selectedUser.first_name}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="last_name"
                                                    label="Last Name"
                                                    value={selectedUser.last_name}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="job_role"
                                                    label="Job Role"
                                                    value={selectedUser.job_role}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="email"
                                                    label="Email"
                                                    value={selectedUser.email}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="phone"
                                                    label="Phone"
                                                    value={selectedUser.phone}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <TextField
                                                    name="address"
                                                    label="Address"
                                                    value={`${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.state} ${selectedUser.address.zip}, ${selectedUser.address.country}`}
                                                    onChange={handleChange}
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Button variant="contained" color="primary" onClick={handleSaveClick} style={{ marginRight: '10px' }}>
                                                    Save
                                                </Button>
                                                <Button variant="contained" onClick={handleCancelClick}>
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="h5">User Details</Typography>
                                                <Typography><strong>First Name:</strong> {selectedUser.first_name}</Typography>
                                                <Typography><strong>Last Name:</strong> {selectedUser.last_name}</Typography>
                                                <Typography><strong>Job Role:</strong> {selectedUser.job_role}</Typography>
                                                <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                                                <Typography><strong>Phone:</strong> {selectedUser.phone}</Typography>
                                                <Typography><strong>Address:</strong> {`${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.state} ${selectedUser.address.zip}, ${selectedUser.address.country}`}</Typography>
                                                <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginTop: '10px' }}>
                                                    Edit
                                                </Button>
                                            </>
                                        )}
                                    </Paper>
                                )}
                                {!selectedUser && <Typography>Select a user to see details</Typography>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
