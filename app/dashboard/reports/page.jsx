import Reports from '../../ui/dashboard/reports/reports'
import styles from "../../ui/dashboard/reports/reports.module.css"

const page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Reports />
      </div>
    </div>
  )
}

export default page