import styles from "../../assets/styles/header/header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <header className={styles.headerChild} />
      <div className={styles.profile}>
        <button className={styles.profile1}>
          <img className={styles.profileChild} alt="" src="/ellipse-2@2x.png" />
        </button>
        <div className={styles.profileItem} />
        <img className={styles.profileInner} alt="" src="/ellipse-3@2x.png" />
        <div className={styles.userName}>User name</div>
        <div className={styles.myProfile}>My Profile</div>
        <div className={styles.dashboardFilter}>Dashboard Filter</div>
        <div className={styles.logout}>Logout</div>
        <div className={styles.dayoutlogout}>Dayout/Logout</div>
        <img className={styles.polygonIcon} alt="" src="/polygon-1.svg" />
        <img
          className={styles.accountCircleIcon}
          alt=""
          src="/account-circle.svg"
        />
        <img className={styles.addRoadIcon} alt="" src="/add-road.svg" />
        <img className={styles.logoutIcon} alt="" src="/logout.svg" />
        <img className={styles.logoutIcon1} alt="" src="/logout.svg" />
      </div>
      <button className={styles.brandLogo}>
        <img
          className={styles.logoRemovebgPreview150x832Icon}
          alt=""
          src="/070619060644logoremovebgpreview150x83-2@2x.png"
        />
      </button>
      <button className={styles.fullScreen}>
        <img className={styles.vectorIcon} alt="" src="/vector.svg" />
      </button>
      <div className={styles.listMenu}>
        <div className={styles.listOne}>
          <div className={styles.listOneChild} />
          <div className={styles.listOneItem} />
          <div className={styles.listOneInner} />
          <div className={styles.rectangleDiv} />
          <div className={styles.listOneChild1} />
          <div className={styles.listOneChild2} />
          <div className={styles.marketing}>Marketing</div>
          <div className={styles.sales}>Sales</div>
          <div className={styles.analytics}>Analytics</div>
          <div className={styles.others}>Others</div>
          <div className={styles.tools}>Tools</div>
          <img className={styles.vectorIcon1} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon2} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon3} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon4} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon5} alt="" src="/vector.svg" />
        </div>
        <div className={styles.listTwo}>
          <div className={styles.listTwoChild} />
          <div className={styles.callLog}>Call Log</div>
          <div className={styles.enquriy}>Enquriy</div>
          <div className={styles.whatsappTemplate}>Whatsapp Template</div>
          <div className={styles.attendances}>Attendances</div>
          <div className={styles.trackLocation}>Track Location</div>
          <div className={styles.notification}>Notification</div>
          <img
            className={styles.mdilocationIcon}
            alt=""
            src="/mdilocation.svg"
          />
          <div className={styles.bxlwhatsapp} />
          <img className={styles.vectorIcon6} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon7} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon8} alt="" src="/vector.svg" />
          <img className={styles.vectorIcon9} alt="" src="/vector.svg" />
          <img className={styles.mdicartIcon} alt="" src="/mdicart.svg" />
          <img
            className={styles.materialSymbolscallIcon}
            alt=""
            src="/materialsymbolscall.svg"
          />
          <img
            className={styles.iconamoonattentionCircle}
            alt=""
            src="/iconamoonattentioncircle.svg"
          />
        </div>
        <button className={styles.listIcone}>
          <img className={styles.vectorIcon} alt="" src="/vector.svg" />
        </button>
      </div>
      <button className={styles.workiyHap}>
        <img className={styles.workiyHapChild} alt="" src="/ellipse-4@2x.png" />
      </button>
      <div className={styles.line} />
      <div className={styles.headerItem} />
    </div>
  );
};

export default Header;
