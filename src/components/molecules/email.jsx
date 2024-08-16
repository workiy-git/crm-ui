// import React from "react";
// import { Button } from "@material-ui/core";
// import MailOutlineIcon from '@mui/icons-material/MailOutline';

// const Email = ({ formData }) => {
//     const handleEmailClick = () => {
//         const subject = "Meeting Request";
//         const body = "Hi,\n\nI would like to schedule a meeting with you. Please let me know your availability.\n\nBest regards,\n[Your Name]";

//         if (formData.email) {
//             window.open(`mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
//         }
//         else if (formData.caller_email) {
//             window.open(`mailto:${formData.caller_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
//         }
//         else {
//             alert("No email address provided");
//         }
//     };

//     return (
//         <Button onClick={handleEmailClick} style={{ display: 'flex', alignItems: 'center' }}>
//             <MailOutlineIcon style={{ color: 'white' }} />
//         </Button>
//     );
// };

// export default Email;


import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Typography from '@mui/material/Typography';
import '../../assets/styles/style.css';


const Email = ({ formData }) => {
    const [open, setOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTemplateChange = (event) => {
        setSelectedTemplate(event.target.value);
    };

    const handleSendEmail = () => {
        let subject = "";
        let body = "";

        switch (selectedTemplate) {
            case "meeting":
                subject = "Meeting Request";
                body = "Hi,\n\nI would like to schedule a meeting with you. Please let me know your availability.\n\nBest regards,\n[Your Name]";
                break;
            case "feedback":
                subject = "Feedback Request";
                body = "Hi,\n\nI would appreciate your feedback on our recent interaction. Please let me know your thoughts.\n\nBest regards,\n[Your Name]";
                break;
            // Add more cases for other templates
            default:
                alert("Please select a template.");
                return;
        }

        if (formData.email) {
            window.open(`mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
        } else if (formData.caller_email) {
            window.open(`mailto:${formData.caller_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
        } else {
            alert("No email address provided");
        }

        handleClose();
    };

    return (
        <>
            <Button className="Details_hover_btn" onClick={handleClickOpen} style={{ display: 'flex', alignItems: 'center', color:'white' }}>
                <MailOutlineIcon style={{ color: 'white', marginRight:'10px' }} /><Typography className="Details_btn_txt">Email</Typography>   
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select Email Template</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="template-select-label">Template</InputLabel>
                        <Select
                            labelId="template-select-label"
                            value={selectedTemplate}
                            onChange={handleTemplateChange}
                            autoWidth
                        >
                            <MenuItem value="meeting">Meeting Request</MenuItem>
                            <MenuItem value="feedback">Feedback Request</MenuItem>
                            {/* Add more MenuItems for additional templates */}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSendEmail} color="primary">
                        Send Email
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Email;
