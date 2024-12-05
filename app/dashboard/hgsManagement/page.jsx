import HgsManagement from '@/app/ui/dashboard/hgsManagement/hgsManagement'
import styles from "@/app/ui/dashboard/hgsManagement/hgsManagement.module.css"

const HgsManagementPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <HgsManagement />
            </div>
        </div>
    )
}

export default HgsManagementPage