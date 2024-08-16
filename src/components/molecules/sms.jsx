import React from "react";
import { Button } from "@material-ui/core";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';

const Sms = ({ formData }) => {
    const handleSmsClick = () => {
        const body = "Hi, I would like to schedule a meeting with you. Please let me know your availability.";

        if (formData.mobile_phone) {
            window.open(`sms:${formData.mobile_phone}?body=${encodeURIComponent(body)}`, "_blank");
        } 
        else if (formData.caller_number) {
            window.open(`sms:${formData.caller_number}?body=${encodeURIComponent(body)}`, "_blank");
        }
        else {
            alert("No phone number provided");
        }
    };

    return (
        <Button onClick={handleSmsClick} style={{ display: 'flex', alignItems: 'center' }}>
            <SmsOutlinedIcon style={{ color: 'white' }} />
        </Button>
    );
};

export default Sms;
