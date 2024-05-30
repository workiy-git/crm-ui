import React, { useState, useEffect } from "react";
import axios from 'axios';
import config from '../../config/config';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadDoneRoundedIcon from '@mui/icons-material/DownloadDoneRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import "../../assets/styles/callsgrid.css";
import Dropdown from '../atoms/dropdown';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Callfilter from "../atoms/callfilter";


const CallsGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState("");
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20); // Changed records per page to 20
  const [showColumns, setShowColumns] = useState({});
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/UserInfodata`);
        const initialShowColumnsState = {};
        response.data.forEach(row => {
          Object.keys(row).forEach(key => {
            if (!initialShowColumnsState.hasOwnProperty(key) && key !== "_id") {
              initialShowColumnsState[key] = true;
            }
          });
        });
        setShowColumns(initialShowColumnsState);
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const handleCheckboxChange = columnName => {
    setShowColumns({ ...showColumns, [columnName]: !showColumns[columnName] });
  };

  const handleChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (rowToEdit === null) {
        await axios.post(`${config.apiUrl}/UserInfodata`, formState);
        setRows([...rows, formState]);
      } else {
        await axios.put(`${config.apiUrl}/UserInfodata/${formState._id}`, formState);
        setRows(rows.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return formState;
        }));
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'caller_number', 'start_time', 'call_duration', 'recording_url', 'call_direction', 'source_id',
      'assigned_to', 'call_status', 'call_source', 'provider_name', 'extension_user', 'caller_from',
      'caller_to', 'recording_file_name', 'landing_number', 'call_recording_file', 'comments', 'created_by'
    ];
    const errors = requiredFields.filter(field => !formState[field]);
    if (errors.length) {
      setErrors(`The following fields are required: ${errors.join(', ')}`);
      return false;
    }
    setErrors("");
    return true;
  };

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = Math.min(pageNumber * recordsPerPage, rows.length);

  const handleEditRow = idx => {
    setRowToEdit(idx);
    setModalOpen(true);
    setFormState({ ...rows[idx] });
  };

  const handleSelectAll = () => {
    const allFields = Object.keys(showColumns).filter(key => key !== '_id');
    setSelectedFields(allFields);
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleApply = () => {
    const updatedShowColumns = { ...showColumns };
    selectedFields.forEach(field => {
      updatedShowColumns[field] = true;
    });
    setShowColumns(updatedShowColumns);
    setSelectedFields([]);
    toggleCheckboxes();
  };

  return (
    <div className="CallsGrid">
      <div className="Appbar">
        <div>
          <ActionButton/>
        </div>
        <div>
        <Dropdown/>
        </div>
        <Callfilter />

        <div>
        <Pagination/>
        </div>
      
      </div>
      <div className="navbar">
        <button onClick={toggleCheckboxes} className="icon-button">
          <WidgetsOutlinedIcon />
        </button>
        {alphabet.map(letter => (
          <div
            key={letter}
            className={`letter ${selectedLetter === letter ? "selectedLetter" : ""}`}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </div>
        ))}
      </div>
        {showCheckboxes && (
          <div style={{ width:'95%', display:'flex', justifyContent:'center', position:'absolute' }}>
            <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0px 0px 11px black', zIndex:10, width:'40rem' }}>
              <div style={{ borderBottom:'2px solid #808080', fontSize:'20px', fontWeight:'bold', borderTopLeftRadius:'10px', borderTopRightRadius:'10px', padding:'3% 5%', display: 'flex', justifyContent: 'space-between' }}>
                <span>Configure Columns - Calls</span>
                <button onClick={toggleCheckboxes} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CloseIcon />
                </button>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ height: 'auto', width: '55%', position: 'relative', display: 'flex', flexDirection: 'column', padding: '15px 25px' }}>
                  <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color:'#21252980' }}>
                    Select Fields
                  </div>
                  <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                    {Object.entries(showColumns).map(([key, value]) => (
                      key !== '_id' && value && (
                        <label style={{ background:'#00AEF8', padding:'5px 10px', fontWeight:'500', marginBottom:'2px', marginRight:'5%', color: 'white', position: 'relative' }} id="selected_checkbox" key={key}>
                          <input
                            style={{ display:'none' }}
                            type="checkbox"
                            checked={value}
                            onChange={() => handleCheckboxChange(key)}
                          />
                          {key.replace(/_/g, ' ')}
                            <CloseRoundedIcon
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '5px',
                                transform: 'translateY(-50%)',
                              }}
                            />
                        </label>
                      )
                    ))}
                  </div>
                </div>
                <div style={{ height: 'auto', width: '45%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '15px 25px' }}>
                  <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color:'#21252980' }}>
                    Available Fields
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '10px', height:'30px' }}
                  />
                  <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                    {Object.entries(showColumns).filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase())).map(([key, value]) => (
                      key !== '_id' && !value && (
                        <label style={{marginBottom:'1px', marginRight:'5%', color:selectedFields.includes(key) ?'white' :'#21252980', padding: selectedFields.includes(key) ?'7px' : '3px', fontWeight:'500', backgroundColor: selectedFields.includes(key) ? '#12E5E5' : 'white', position: 'relative' }} id="available_checkbox" key={key}>
                          <input
                            style={{ display:'none' }}
                            type="checkbox"
                            checked={selectedFields.includes(key)}
                            onChange={() => {
                              const updatedSelectedFields = [...selectedFields];
                              const fieldIndex = updatedSelectedFields.indexOf(key);
                              if (fieldIndex === -1) {
                                updatedSelectedFields.push(key);
                              } else {
                                updatedSelectedFields.splice(fieldIndex, 1);
                              }
                              setSelectedFields(updatedSelectedFields);
                            }}
                          />
                          {key.replace(/_/g, ' ')}
                          {selectedFields.includes(key) && (
                            <AddTaskRoundedIcon
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '15px',
                                transform: 'translateY(-50%)',
                                color:'white'
                              }}
                            />
                          )}
                        </label>
                      )
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 25px', borderTop: '2px solid #808080', marginTop: '10px' }}>
                <div>
                  <button style={{ margin:'10px', color:'white', background:'#3E3E42', borderRadius:'5px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray'  }} onClick={handleSelectAll}>Select All</button>
                  <button style={{ margin:'10px', color:'black', background:'#FFFFF', borderRadius:'5px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray' }} onClick={handleDeselectAll}>Deselect All</button>
                </div>
                <div>
                  <button style={{ margin:'10px', color:'white', background:'#12E5E5', borderRadius:'100px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray', display:'flex', alignItems:'center' }} onClick={handleApply}>Save  <DownloadDoneRoundedIcon style={{height:'20px', width:'auto', marginLeft:'10px'}} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="sticky-column">Actions</th>
              {Object.entries(showColumns).map(([key, value]) => (
                value && key !== '_id' && <th key={key} className="sticky-column">{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(startIndex, endIndex).map((row, idx) => (
              <tr key={startIndex + idx}>
                <td className="fit">
                  <span className="actions">
                    <MoreVertIcon
                      className="edit-btn"
                      onClick={() => handleEditRow(startIndex + idx)}
                    />
                  </span>
                </td>
                {Object.entries(showColumns).map(([key, value]) => (
                  value && key !== '_id' && (
                    <td key={key}>
                      {typeof row[key] === 'object' ? row[key].$numberLong : row[key]}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{height:'6rem', background:'white'}}>
      </div>
      </div>
      
     
    </div>
  );
};

export default CallsGrid;