import HgsPaymentHistory from "../../ui/dashboard/hgsPaymentHistory/hgsPaymentHistory";
import styles from "../../ui/dashboard/hgsPaymentHistory/hgsPaymentHistory.module.css"

const HgsPaymentHistoryPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <HgsPaymentHistory />
      </div>
    </div>
  )
}

export default HgsPaymentHistoryPage