import "../assets/styles/landing.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  const [landingpage, setLoginData] = useState([]);
  useEffect(() => {
    document.title = 'Dashboard';

    return () => {
      document.title = 'Default Title';
    };
  }, []);

  
  useEffect(() => {
    axios.get('http://localhost:9000/api/landingpage')
      .then((response) => {
        console.log('Data received:', response.data);
        setLoginData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    <div className="landing-page">
    <div className="landing-page-child" /><div>
    {landingpage.map((item) => (
      <div key={item._id}>
        <div className="landing-page-item" />
      <div className="landing-page-inner" />
      <div className="dash-board" />
       { <img className="workiy-logo-blue-2-1" src={`data:image/jpg;base64, ${item.workiy_logo_img}`} alt="banner_img" /> }
      <div className="day-in-button">
        <div className="day-in">
          <b>DAY In</b>
          <span className="span">{` `}</span>
        </div>
      </div>
      <button className="notification-button">
         { <img className="notification-icone" src={`data:image/jpg;base64, ${item.notification_img}`} alt="banner_img" /> }
      </button>
      <div className="rectangle-div" />
      <button className="full-screen-button">
        { <img className="full-screen-icon" src={`data:image/jpg;base64, ${item.full_size_img}`} alt="banner_img" /> }
      </button>
      <button className="reload-button">
        { <img className="full-screen-icon" src={`data:image/jpg;base64, ${item.ringer_img}`} alt="banner_img" /> }
      </button>
      <button className="calls-button">
        <div className="calls-button-child" />
         { <img className="ringer-volume-icon" src={`data:image/jpg;base64, ${item.ringer_img}`} alt="banner_img" /> }
        <div className="calls">Calls</div>
      </button>
      <button className="leads-button">
        <div className="leads-button-child" />
        <div className="leads">Leads</div>
        { <img className="contact-icon" src={`data:image/jpg;base64, ${item.contact_img}`} alt="banner_img" /> }
      </button>
      <button className="genaral-button">
        <div className="leads-button-child" />
        <div className="genaral">Genaral</div>
        { <img className="full-screen-icon1" src={`data:image/jpg;base64, ${item.full_size_img}`} alt="banner_img" /> }
      </button>
      <div className="image">
        { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.edit_img}`} alt="banner_img" /> }
      </div>
      <div className="landing-page-child1" />
      <div className="calls1">{`Calls `}</div>
      <div className="component-2">
        <div className="calls2">
          { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.ringer_img}`} alt="banner_img" /> }
        </div>
        <div className="enquiry">
          { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.checkout_img}`} alt="banner_img" /> }
        </div>
        <div className="lead">
          { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.contact_img}`} alt="banner_img" /> }
        </div>
        <div className="report">
          { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.signal_img}`} alt="banner_img" /> }
        </div>
        <div className="setting">
          { <img className="edit-image-icon" src={`data:image/jpg;base64, ${item.settings_img}`} alt="banner_img" /> }
        </div>
      </div>
      <div className="dash-board-button">
        { <img className="home-icone" src={`data:image/jpg;base64, ${item.home_img}`} alt="banner_img" /> }
      </div>
      <div className="all-call-parent">
        <button className="all-call">
          <div className="all-call-child" />
          <b className="b">23344</b>
          <b className="all-calls">{`All Calls `}</b>
          { <img className="phone-icon" src={`data:image/jpg;base64, ${item.dphone_img}`} alt="banner_img" /> }
        </button>
        <button className="total-answer-calls">
          <div className="total-answer-calls-child" />
          <b className="b1">18400</b>
          <div className="total-answered-calls">Total Answered Calls</div>
          { <img className="call-female-icon" src={`data:image/jpg;base64, ${item.call_person_img}`} alt="banner_img" /> }
        </button>
        <button className="total-incoming-calls">
          <div className="total-incoming-calls-child" />
          <b className="b2">2334</b>
          <div className="total-incomingcalls">Total Incomingcalls</div>
           { <img className="ringer-volume-icon2" src={`data:image/jpg;base64, ${item.ringer_img}`} alt="banner_img" /> }
        </button>
        <button className="total-missed-calls">
          <div className="total-missed-calls-child" />
          <b className="b3">5600</b>
          <div className="total-missed-calls1">Total Missed Calls</div>
          { <img className="missed-call-icon" src={`data:image/jpg;base64, ${item.missed_call_img}`} alt="banner_img" /> }
        </button>
        <button className="today-calls">
          <div className="today-calls-child" />
          <b className="b4">234</b>
          <b className="today-calls1">{`Today Calls `}</b>
          { <img className="phone-icon"  src={`data:image/jpg;base64, ${item.dphone_img}`} alt="banner_img" /> }
        </button>
        <button className="today-answer-calls">
          <div className="today-answer-calls-child" />
          <b className="b5">54</b>
          <div className="today-answered-calls">Today Answered Calls</div>
          { <img className="call-female-icon1" src={`data:image/jpg;base64, ${item.call_person_img}`} alt="banner_img" /> }
        </button>
        <button className="today-incoming-calls">
          <div className="today-incoming-calls-child" />
          <b className="b6">80</b>
          <div className="today-incoming-calls-container">
            <p className="today-incoming">Today Incoming</p>
            <p className="today-incoming">Calls</p>
          </div>
           { <img className="ringer-volume-icon3" src={`data:image/jpg;base64, ${item.ringer_img}`} alt="banner_img" /> }
        </button>
        <button className="today-missed-calls">
          <div className="today-missed-calls-child" />
          <b className="b7">100</b>
          { <img className="missed-call-icon1" src={`data:image/jpg;base64, ${item.missed_call_img}`} alt="banner_img" /> }
          <div className="todayl-missed-calls">Todayl Missed Calls</div>
        </button>
      </div>
      <div className="group-parent">
        <button className="group">
           { <img  className="circled-menu-icon" src={`data:image/jpg;base64, ${item.circklet_img}`} alt="banner_img" /> }
        </button>
        <button className="full-screen-wrapper">
          { <img className="full-screen-icon2" src={`data:image/jpg;base64, ${item.full_size_img}`} alt="banner_img" /> }
        </button>
         { <img className="google-web-search" src={`data:image/jpg;base64, ${item.search_img}`} alt="banner_img" /> }
      </div>
      <div className="profile-button">
        { <img className="profile-button-child" src={`data:image/jpg;base64, ${item.ellips_img}`} alt="banner_img" /> }
      </div>
    </div>
    ))}
  </div>
  </div>

  );
};

export default LandingPage;