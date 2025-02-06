import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { headers } from '../atoms/Authorization';
import config from "../../config/config";
import '../../assets/styles/assignedToPage.css';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const AssignedTo = () => {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [assignedData, setAssignedData] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [selectedOtherUser, setSelectedOtherUser] = useState("");
    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const handleChange = (event, value) => {
      setPage(value);
      const currentPage = value;
      fetchAssignedData(currentPage, rowsPerPage);

    };


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const endpoint = "appdata/retrieve";

                const requestBody = [
                    { "$match": { "pageName": "users" } },
                    { "$group": { "_id": "$role" } }
                ];

                const response = await axios.post(
                    `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
                    requestBody,
                    { headers: headers }
                );

                const roleData = response.data.data.map(item => item._id);
                setRoles(roleData);
            } catch (err) {
                console.error("Error fetching roles:", err);
                setError("Failed to load roles.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (!selectedRole) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const endpoint = "appdata/retrieve";

                const requestBody = [
                    { "$match": { "pageName": "users", "role": selectedRole } },
                    { "$project": { "username": 1, "first_name": 1, "last_name": 1, "_id": 0 } }
                ];

                const response = await axios.post(
                    `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
                    requestBody,
                    { headers: headers }
                );

                setUsers(response.data.data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [selectedRole]);

    

        const fetchAssignedData = async (currentPage, rowsPerPage) => {
            try {
                setLoading(true);
                const endpoint = "appdata/retrieve";

                const requestBody = [
                    {
                        "$match": {
                            "pageName": "leads",
                            "assigned_to": { "$regex":  `^\\s*${selectedUser}\\s*$`, "$options": "i" }
                        }
                    },
                    {
                        "$project": {
                            "mobile_phone": 1,
                            "name": 1,
                            "lead_source": 1,
                            "lead_medium": 1,
                            "assigned_to": { "$trim": { "input": "$assigned_to" } },
                            "_id": 0
                        }
                    }
                ];

                const response = await axios.post(
                    `${config.apiUrl.replace(/\/$/, "")}/${endpoint}?page=${currentPage}&pageSize=${rowsPerPage}`,
                    requestBody,
                    { headers: headers }
                );
                
                setRowsPerPage(response.data.pagination.pageSize);
                setTotalPages(response.data.pagination.totalPages);
                setTotalRecords(response.data.pagination.totalCount);
                setCurrentPage(response.data.pagination.currentPage);

                const cleanData = (data) =>
                    data.map(item => ({
                        ...item,
                        assigned_to: item.assigned_to.trim()
                    }));
                    console.log("Assigned Data:", response.data.pagination); // Debugging log
                setAssignedData(cleanData(response.data.data || []));

                // Fetch other users for reassignment
                setOtherUsers(users.filter(user => user.username !== selectedUser));
            } catch (err) {
                console.error("Error fetching assigned data:", err);
                setError("Failed to load assigned data.");
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {
        if (!selectedUser) return;

        fetchAssignedData(currentPage, rowsPerPage);
    }, [selectedUser]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setUsers([]);
        setSelectedUser("");
        setAssignedData([]);
        setOtherUsers([]);
        setSelectedOtherUser("");
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value.trim());
    };

    const handleOtherUserChange = async (event) => {
        const confirmReassign = window.confirm("Are you sure you want to reassign the data to this user?");
        if (confirmReassign) {
            const newAssignedUser = event.target.value.trim().toLowerCase();
            setSelectedOtherUser(newAssignedUser);
    
            try {
                setLoading(true);
    
                const endpoint = "appdata/update";
    
                const requestBody = {
                    filter: {
                        "pageName": "leads",
                        "assigned_to": { "$regex": `^\\s*${selectedUser}\\s*$`, "$options": "i" }
                    },
                    update: {
                        "$set": { "assigned_to": newAssignedUser }
                    }
                };
                console.log("selectedUser:", selectedUser); // Debugging log
                console.log("Request Body:", requestBody); // Debugging log
    
                const response = await axios.put(
                    `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
                    requestBody,
                    { headers: headers }
                );
    
                console.log("API Response:", response.data); // Debugging log
    
                if (response.status === 200) {
                    alert("Data reassigned successfully.");
    
                    // Update the UI
                    setAssignedData((prev) =>
                        prev.map((item) =>
                            item.assigned_to === selectedUser
                                ? { ...item, assigned_to: newAssignedUser }
                                : item
                        )
                    );
    
                    setSelectedUser("");
                    setAssignedData([]);
                } else {
                    throw new Error("Failed to update data on server.");
                }
            } catch (err) {
                console.error("Error reassigning data:", err);
                setError("Failed to reassign data.");
            } finally {
                setLoading(false);
            }
        }
    };
        console.log("Assigned Data:", assignedData); // Debugging log

    const columns = [
        { field: 'mobile_phone', headerName: 'Mobile Phone', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'lead_source', headerName: 'Lead Source', width: 150 },
        { field: 'lead_medium', headerName: 'Lead Medium', width: 150 },
        { field: 'assigned_to', headerName: 'Assigned To', width: 150 },
    ];

    return (
        <div>
            <div style={{ width: "100%", }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#F5BD71",
              color: "black",
              height: "65px",
            }}
          >
            <div style={{alignContent:'center'}}>
              <div>
            <h2 className='details_page_heading' style={{ margin: "auto 40px", textTransform:'capitalize'}}>AssignedTo Page</h2>
            <div style={{margin:'10px 20px 10px 40px', borderBottom:'2px solid black' }}></div>
            </div>
            </div>
            </div>
            </div>
            <div  className="split-page" >
           
            <div className="left-side">
                <div className="form-group">
                    <label htmlFor="role">Select Role:</label>
                    <select id="role" name="role" onChange={handleRoleChange} value={selectedRole}>
                        <option value="">Select</option>
                        {roles.map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedRole && (
                    <div className="form-group">
                        <label htmlFor="user">Select User:</label>
                        <select id="user" name="user" onChange={handleUserChange} value={selectedUser}>
                            <option value="">Select</option>
                            {users.map((user, index) => (
                                <option key={index} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedUser && otherUsers.length > 0 && (
                    <div className="form-group">
                        <label htmlFor="other-user">Reassign To:</label>
                        <select id="other-user" name="other-user" onChange={handleOtherUserChange} value={selectedOtherUser}>
                            <option value="">Select</option>
                            {otherUsers.map((user, index) => (
                                <option key={index} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <div className="right-side">
                <h3>Assigned Data</h3>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={assignedData.map((item, index) => ({ id: index, ...item }))}
                        columns={columns}
                        // pageSize={5}
                        // rowsPerPageOptions={[5]}
                        loading={loading}
                    />
                     <Stack style={{display:'flex', flexDirection:'row', alignItems:'center', margin:'10px', justifyContent:'space-between'}} spacing={2}>
                     <Typography>Total Records: {totalRecords}</Typography>
                     <div style={{display:'flex', flexDirection:'row', alignItems:'center', margin:'0px'}} >
                        <Typography>Page: {page}</Typography>
                        <Pagination style={{margin:'0'}} count={totalPages} page={page} onChange={handleChange} />
                    </div>
                    </Stack>
                </div>
            </div>
            </div>
        </div>
    );
};

export default AssignedTo;