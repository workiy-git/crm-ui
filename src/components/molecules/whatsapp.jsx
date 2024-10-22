import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Typography from '@mui/material/Typography';
import '../../assets/styles/style.css';
import { headers } from '../atoms/Authorization'
import axios from 'axios';
import config from '../../config/config';

const Whatsapp = ({ formData }) => {
    const [menuData, setMenuData] = useState([]); 


    useEffect(() => {
        axios.get(`${config.apiUrl}/menus`, {headers}) // Use apiUrl from the configuration file
          .then((response) => {
            // console.log('dayData received:', response.data.data.menu_text);
            const containerData = response.data.data.find(menu => menu.menu === 'container');
    
            setMenuData(containerData);
            console.log("menusss", response.data.data)
            
          })
          .catch((error) => {
            // console.error('Error fetching data:', error);
          });
      }, []);

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
        <Button className="Details_hover_btn" onClick={handleWhatsappClick} style={{ display: 'flex', alignItems: 'center', color:'white' }}>
            {menuData.whatsapp && menuData.whatsapp.title ? (
            <>
                <WhatsAppIcon style={{ color: 'black', marginRight:'10px' }} /> <Typography className="Details_btn_txt">Whatsapp</Typography>
            </>
            ) : ""}
            
        </Button>
    );
};

export default Whatsapp;
