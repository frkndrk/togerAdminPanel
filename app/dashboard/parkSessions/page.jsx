import ParkSessions from "@/app/ui/dashboard/parkSessions/parkSessions"
import styles from "@/app/ui/dashboard/parkSessions/parkSessions.module.css"

const ParkSessionPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <ParkSessions />
            </div>
        </div>
    )
}

export default ParkSessionPage