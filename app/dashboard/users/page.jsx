import styles from "../../ui/dashboard/users/users.module.css"
import Users from "../../ui/dashboard/users/users"

const UsersPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Users />
      </div>
    </div>
  )
}

export default UsersPage