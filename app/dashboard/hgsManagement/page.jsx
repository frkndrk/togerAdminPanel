import HgsManagement from '../../ui/dashboard/hgsManagement/hgsManagement'
import styles from "../../ui/dashboard/hgsManagement/hgsManagement.module.css"

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