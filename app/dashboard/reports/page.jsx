import Reports from '@/app/ui/dashboard/reports/reports'
import styles from "@/app/ui/dashboard/reports/reports.module.css"

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