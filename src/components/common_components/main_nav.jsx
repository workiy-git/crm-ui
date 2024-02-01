import styles from "../../assets/styles/header/main_nav.module.css";

const DashBorad = () => {
  return (
    <div className={styles.dashBorad}>
      <div className={styles.dashBoradChild} />
      <img className={styles.settingIcon} alt="" src="/setting@2x.png" />
      <div className={styles.dashBoard}>
        <button className={styles.report}>
          <img className={styles.reportIcon} alt="" src="/report.svg" />
        </button>
        <button className={styles.enquriy}>
          <img className={styles.reportIcon} alt="" src="/enquriy.svg" />
        </button>
        <button className={styles.leads}>
          <img className={styles.reportIcon} alt="" src="/leads.svg" />
        </button>
        <button className={styles.calls}>
          <img className={styles.reportIcon} alt="" src="/call.svg" />
        </button>
        <button className={styles.home}>
          <img className={styles.reportIcon} alt="" src="/home.svg" />
        </button>
      </div>
    </div>
  );
};

export default DashBorad;
