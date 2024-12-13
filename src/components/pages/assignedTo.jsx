import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { headers } from '../atoms/Authorization'; // Ensure headers are correctly imported from your auth module
import config from "../../config/config"; // Assuming config contains the base API URL

import '../../assets/styles/assignedToPage.css';

const AssignedTo = () => {
    const [users, setUsers] = useState([]); // State to hold users data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [selectedFrom, setSelectedFrom] = useState(""); // State to hold selected 'From' user

    // Fetch users data for dropdowns
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const endpoint = "appdata/retrieve"; // Define the endpoint
    
                // Prepare the data for the POST request body (MongoDB Aggregation Query)
                const requestBody = [
                    { "$match": { "pageName": "users" } }
                ];
    
                const response = await axios.post(
                    `${config.apiUrl.replace(/\/$/, "")}/${endpoint}?page=1&pageSize=25`, // URL with query params for pagination
                    requestBody, // Aggregation query body
                    {
                        headers: headers
                    }
                );
    
                console.log("Response Data", response.data.data);
    
                // Check if the response contains `data` and if it's an array
                if (response.data.data && Array.isArray(response.data.data)) {
                    // Filter users by "Presales Team" role and extract only the `username`
                    const presalesUsers = response.data.data
                        .filter(user => user.role === "Presales Team") // Filter by role
                        .map(user => user); // Extract full user objects
    
                    setUsers(presalesUsers); // Store the filtered users in the state
                    console.log("Filtered Presales Team Users", presalesUsers);
                } else {
                    setError("Unexpected response structure.");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers(); // Call the fetch function on component mount
    }, []);
    
    // Handle selection in the 'From' dropdown
    const handleFromChange = (event) => {
        setSelectedFrom(event.target.value); // Update selected 'From' value
    };

    return (
        <div className="split-page">
            {/* Left Side */}
            <div className="left-side">
                <div className="form-group">
                    <label htmlFor="from">From:</label>
                    <select id="from" name="from" onChange={handleFromChange} value={selectedFrom}>
                        <option value="">Select</option>
                        {loading && <option>Loading...</option>}
                        {error && <option>{error}</option>}
                        {!loading && !error && users.length > 0 && users.map((user, index) => (
                            <option key={index} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                        {!loading && !error && users.length === 0 && <option>No users available</option>}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="assignTo">Assign To:</label>
                    <select id="assignTo" name="assignTo">
                        <option value="">Select</option>
                        {loading && <option>Loading...</option>}
                        {error && <option>{error}</option>}
                        {!loading && !error && users.length > 0 && users
                            .filter(user => user.username !== selectedFrom) // Exclude selected user from 'From' dropdown
                            .map((user, index) => (
                                <option key={index} value={user.username}>
                                    {/* {user.first_name} {user.last_name} */}
                                    {user.username}
                                </option>
                            ))}
                        {!loading && !error && users.length === 0 && <option>No users available</option>}
                    </select>
                </div>
            </div>

            {/* Right Side */}
            <div className="right-side">
                <p>Right side content goes here.</p>
            </div>
        </div>
    );
};

export default AssignedTo;
