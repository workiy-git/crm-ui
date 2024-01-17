import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const onListIconClick = useCallback(() => {
    navigate("/property-1default");
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="landing-page-child" />
      <div className="landing-page-item" />
      <div className="dash-board" />
      <div className="landing-page-inner" />
      <div className="rectangle-div" />
      <div className="landing-page-child1" />
      <div className="all-call-parent">
        <div className="all-call">
          <div className="all-call-child" />
          <b className="b">23344</b>
          <b className="all-calls">{`All Calls `}</b>
          <img className="phone-icon" alt="" src="/phone@2x.png" />
        </div>
        <div className="total-answer-calls">
          <div className="total-answer-calls-child" />
          <b className="b1">18400</b>
          <div className="total-answered-calls">Total Answered Calls</div>
          <img className="call-female-icon" alt="" src="/call-female@2x.png" />
        </div>
        <div className="total-incoming-calls">
          <div className="total-incoming-calls-child" />
          <b className="b2">2334</b>
          <div className="total-incomingcalls">Total Incomingcalls</div>
          <img
            className="ringer-volume-icon"
            alt=""
            src="/ringer-volume@2x.png"
          />
        </div>
        <div className="total-missed-calls">
          <div className="total-missed-calls-child" />
          <b className="b3">5600</b>
          <div className="total-missed-calls1">Total Missed Calls</div>
          <img className="missed-call-icon" alt="" src="/missed-call@2x.png" />
        </div>
        <div className="today-calls">
          <div className="today-calls-child" />
          <b className="b4">234</b>
          <b className="today-calls1">{`Today Calls `}</b>
          <img className="phone-icon" alt="" src="/phone@2x.png" />
        </div>
        <div className="today-answer-calls">
          <div className="today-answer-calls-child" />
          <b className="b5">54</b>
          <div className="today-answered-calls">Today Answered Calls</div>
          <img className="call-female-icon1" alt="" src="/call-female@2x.png" />
        </div>
        <div className="today-incoming-calls">
          <div className="today-incoming-calls-child" />
          <b className="b6">80</b>
          <div className="today-incoming-calls-container">
            <p className="today-incoming">Today Incoming</p>
            <p className="today-incoming">Calls</p>
          </div>
          <img
            className="ringer-volume-icon1"
            alt=""
            src="/ringer-volume@2x.png"
          />
        </div>
        <div className="today-missed-calls">
          <div className="today-missed-calls-child" />
          <b className="b7">100</b>
          <img className="missed-call-icon1" alt="" src="/missed-call@2x.png" />
          <div className="todayl-missed-calls">Todayl Missed Calls</div>
        </div>
      </div>
      <div className="call-dashboard">
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <div className="ellipse-parent">
            <div className="group-child" />
            <img className="call-icon" alt="" src="/call@2x.png" />
          </div>
          <div className="today-calls3">Today calls</div>
          <div className="div">34678</div>
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <img
            className="growth-and-flag"
            alt=""
            src="/growth-and-flag@2x.png"
          />
          <div className="today-answered-calls2">Today Answered Calls</div>
          <div className="div">34678</div>
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <div className="today-answered-calls2">Today Incoming Calls</div>
          <div className="div">34678</div>
          <img
            className="incoming-call-icon"
            alt=""
            src="/incoming-call@2x.png"
          />
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <div className="today-answered-calls2">Today Missed Calls</div>
          <div className="div">34678</div>
          <img className="missed-call-icon2" alt="" src="/missed-call@2x.png" />
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <div className="ellipse-parent">
            <div className="group-child" />
            <img className="call-icon" alt="" src="/call@2x.png" />
          </div>
          <div className="total-calls1">Total calls</div>
          <div className="div">34678</div>
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <img
            className="growth-and-flag"
            alt=""
            src="/growth-and-flag@2x.png"
          />
          <div className="today-answered-calls2">Total Answered Calls</div>
          <div className="div">34678</div>
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <div className="today-answered-calls2">Total Incoming Calls</div>
          <div className="div">34678</div>
          <img
            className="incoming-call-icon"
            alt=""
            src="/incoming-call@2x.png"
          />
        </button>
        <button className="todaymissed-call">
          <div className="today-calls-item" />
          <img className="ellipse-parent" alt="" src="/group-4.svg" />
          <div className="today-answered-calls2">Total Missed Calls</div>
          <div className="div">34678</div>
          <img className="missed-call-icon2" alt="" src="/missed-call@2x.png" />
        </button>
      </div>
      <div className="menus">
        <div className="day-in-button">
          <div className="day-in">Day In</div>
        </div>
        <img className="search-icon" alt="" src="/search@2x.png" />
        <img
          className="notification-button-icon"
          alt=""
          src="/notification-button@2x.png"
        />
        <img
          className="full-screen-button"
          alt=""
          src="/full-screen-button@2x.png"
        />
        <button className="reload-button">
          <button className="rotate-right" />
        </button>
      </div>
      <img
        className="list-icon"
        alt=""
        src="/list.svg"
        onClick={onListIconClick}
      />
      <img className="filter-icon" alt="" src="/filter@2x.png" />
      <div className="new-dashboard">
        <div className="new-dashboard-child" />
        <div className="dashboard">
          <button className="home" />
          <button className="call" />
          <button className="shopping-cart" />
          <button className="contact" />
          <button className="signal" />
          <button className="settings">
            <img className="settings-icon" alt="" src="/settings.svg" />
          </button>
        </div>
        <div className="home1">HOME</div>
        <div className="calls1">CALLS</div>
        <div className="enquiry">ENQUIRY</div>
        <div className="leads">LEADS</div>
        <div className="report">REPORT</div>
        <div className="settings1">
          <span className="settings2">SETTINGS</span>
          <span>{` `}</span>
        </div>
      </div>
      <div className="nav-bar">
        <button className="calls-button">
          <button className="calls-button-child" />
          <img
            className="ringer-volume-icon2"
            alt=""
            src="/ringer-volume@2x.png"
          />
          <div className="calls2">Calls</div>
        </button>
        <button className="leads-button">
          <button className="leads-button-child" />
          <div className="leads1">Leads</div>
          <img className="contact-icon" alt="" src="/contact@2x.png" />
        </button>
        <button className="genaral-button">
          <button className="leads-button-child" />
          <div className="genaral">Genaral</div>
          <img className="full-screen-icon" alt="" src="/full-screen@2x.png" />
        </button>
      </div>
      <div className="header">
        <img className="brand-logo-icon" alt="" src="/brand-logo@2x.png" />
        <div className="list-menu">
          <img className="list-icon1" alt="" src="/list@2x.png" />
          <div className="marketing">
            <div className="marketing1">
              <div className="marketing-child" />
              <img
                className="local-convenience-store-icon"
                alt=""
                src="/local-convenience-store.svg"
              />
              <div className="marketing2">Marketing</div>
            </div>
            <div className="email">
              <div className="email1">Email</div>
              <img className="drafts-icon" alt="" src="/drafts.svg" />
            </div>
            <div className="chat">
              <div className="chats">Chats</div>
              <img
                className="mark-chat-read-icon"
                alt=""
                src="/mark-chat-read.svg"
              />
            </div>
          </div>
          <div className="sales">
            <div className="sales1">
              <div className="marketing-child" />
              <img
                className="shopping-cart-checkout-icon"
                alt=""
                src="/shopping-cart-checkout.svg"
              />
              <div className="sales2">Sales</div>
            </div>
            <div className="calls3">
              <div className="calls4">Calls</div>
              <img className="call-icon2" alt="" src="/call.svg" />
            </div>
            <div className="lead">
              <div className="leads2">Leads</div>
              <img
                className="contact-mail-icon"
                alt=""
                src="/contact-mail.svg"
              />
            </div>
            <div className="site-visits">
              <div className="site-visits1">Site Visits</div>
              <img className="handshake-icon" alt="" src="/handshake.svg" />
            </div>
          </div>
          <div className="analytics">
            <div className="analytics1">
              <div className="marketing-child" />
              <img className="equalizer-icon" alt="" src="/equalizer.svg" />
              <div className="analytics2">Analytics</div>
            </div>
            <div className="update">
              <div className="update1">Update</div>
              <img className="pace-icon" alt="" src="/pace.svg" />
            </div>
            <div className="report1">
              <div className="resports">Resports</div>
              <img className="finance-icon" alt="" src="/finance.svg" />
            </div>
          </div>
          <div className="others">
            <div className="others1">
              <div className="marketing-child" />
              <img
                className="dynamic-feed-icon"
                alt=""
                src="/dynamic-feed.svg"
              />
              <div className="others2">Others</div>
            </div>
            <div className="call-log">
              <div className="call-log1">Call Log</div>
              <img className="call-icon3" alt="" src="/call.svg" />
            </div>
            <div className="enquiry1">
              <div className="enquiry2">Enquiry</div>
              <img
                className="shopping-cart-icon"
                alt=""
                src="/shopping-cart.svg"
              />
            </div>
            <div className="whatsapp-template">
              <div className="whatsapp-template1">{`Whatsapp Template `}</div>
              <img className="p-icon" alt="" src="/3p.svg" />
            </div>
            <div className="attendance">
              <div className="attendances">Attendances</div>
              <img className="alarm-icon" alt="" src="/alarm.svg" />
            </div>
            <div className="track-location">
              <div className="track-location1">{`Track Location `}</div>
              <img
                className="add-location-alt-icon"
                alt=""
                src="/add-location-alt.svg"
              />
            </div>
            <div className="notification">
              <div className="notifications">Notifications</div>
              <img
                className="notifications-icon"
                alt=""
                src="/notifications.svg"
              />
            </div>
          </div>
          <div className="tools">
            <div className="tools1">
              <div className="marketing-child" />
              <img
                className="construction-icon"
                alt=""
                src="/construction.svg"
              />
              <div className="tools2">Tools</div>
            </div>
            <div className="email-template">
              <div className="email-templates">Email Templates</div>
              <img
                className="notification-multiple-icon"
                alt=""
                src="/notification-multiple.svg"
              />
            </div>
            <div className="recycle">
              <div className="recycle-bin">Recycle Bin</div>
              <img className="recycling-icon" alt="" src="/recycling.svg" />
            </div>
          </div>
        </div>
        <img className="header-child" alt="" src="/ellipse-3@2x.png" />
        <div className="profile-button">
          <img
            className="profile-button-child"
            alt=""
            src="/ellipse-2@2x.png"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
