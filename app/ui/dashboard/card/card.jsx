import { MdSupervisedUserCircle } from "react-icons/md"
import styles from "./card.module.css"

const Card = () => {

  const cardsData = [
    {
      title: "Park Oturumları"
    },
    {
      title: "HGS Onay"
    },
    {
      title: "Beyaz Liste"
    },
    {
      title: "Fiyat Tarifesi"
    },
    {
      title: "Kullanıcılar"
    },
    {
      title: "Raporlar"
    }
  ]

  return (
    <div className={styles.cont}>
      {
        cardsData.map(item => (
          <div className={styles.container}>
            <MdSupervisedUserCircle size={24} />
            <div className={styles.texts}>
              <span className={styles.title}>{item.title}</span>{/* 
            <span className={styles.number}>10.273</span>
            <span className={styles.detail}>
              <span className={styles.positive}>12%</span> more than previous week
            </span> */}
            </div>
          </div>
        ))
      }
    </div>

  )
}

export default Card