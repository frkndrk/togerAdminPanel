import WhiteList from "@/app/ui/dashboard/whiteList/whiteList"
import styles from "@/app/ui/dashboard/whiteList/whiteList.module.css"

const UsersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <WhiteList />
      </div>
    </div>
  )
}

export default UsersPage