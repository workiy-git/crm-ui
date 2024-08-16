import React from "react";
import { Button } from "@material-ui/core";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Whatsapp = ({ formData }) => {
    const handleWhatsappClick = () => {
        // Customize your message here
        const message = "Hello, I would like to know more about your services.";
        const encodedMessage = encodeURIComponent(message);

        if (formData.mobile_phone) {
            window.open(
                `https://wa.me/${formData.mobile_phone}?text=${encodedMessage}`,
                "_blank"
            );
        } else if (formData.caller_number) {
            window.open(
                `https://wa.me/${formData.caller_number}?text=${encodedMessage}`,
                "_blank"
            );
        } else {
            alert("No phone number provided");
        }
    };

    return (
        <Button onClick={handleWhatsappClick} style={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon style={{ color: 'white' }} />
        </Button>
    );
};

export default Whatsapp;
