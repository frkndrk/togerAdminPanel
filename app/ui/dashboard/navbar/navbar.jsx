"use client"
import { usePathname } from "next/navigation"
import styles from "./navbar.module.css"
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Navbar = () => {

  const [newPathname, setNewPathname] = useState(null);
  const [newWhiteList, setNewWhiteList] = useState(null);
  const [userOption, setUserOption] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const currentPath = pathname.split("/").pop();
    if (currentPath === "users") {
      setNewPathname("Kullanıcılar")
    } else if (currentPath === "pricing") {
      setNewPathname("Fiyat Tarife")
    } else if (currentPath === "parkSessions") {
      setNewPathname("Park Oturumları")
    } else if (currentPath === "whiteList") {
      setNewPathname("Beyaz Liste")
    } else if (currentPath === "hgsManagement") {
      setNewPathname("HGS Onay")
    } else if (currentPath === "hgsPaymentHistory") {
      setNewPathname("HGS Ödemeleri")
    } else if (currentPath === "reports") {
      setNewPathname("Raporlar")
    } else if (currentPath === "all_points") {
      setNewPathname("Toger")
    } else {
      setNewPathname("Dashboard")
    }
  }, [pathname])

  const handleUsername = () => {
    setUserOption(!userOption)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{newPathname == "Toger"
        ?
        <svg xmlns="http://www.w3.org/2000/svg" id="toger_logo" width="164.266" height="34.532" viewBox="0 0 164.266 34.532">
          <path id="Path_192289" data-name="Path 192289" d="M1277.783,2750.39h32.355l-6.038,7.459h-6.41v26.887h-7.458v-26.887h-6.411l-6.038-7.459Zm50.782,0a17.258,17.258,0,1,1-17.258,17.258,17.257,17.257,0,0,1,17.258-17.258Zm0,7.346a9.911,9.911,0,1,0,9.911,9.912,9.911,9.911,0,0,0-9.911-9.912Zm50.245-7.346h-15.142l0,.022a17.252,17.252,0,1,0,13.285,28.629,18.63,18.63,0,0,0,4.444-8.8,7.032,7.032,0,0,0,.106-1.14l.02-2.889h-19.992l6.038,7.458h4.291c-.256.807-3.082,3.951-7.331,3.951-4.416,0-9.972-4.464-9.972-9.97a9.974,9.974,0,0,1,8.1-9.795v0h10.118l6.038-7.459Zm31.295,0h-27.127v7.459h21.089l6.038-7.459Zm24.084,24.683a13.118,13.118,0,0,0-6.16-24.7q-.337,0-.671.017h-16.08l6.038,7.459H1428.5v.019a5.652,5.652,0,0,1,0,11.267v.02h-17.225v15.583h7.459v-8.368h6.879l6.838,8.368,9.595-.045-7.86-9.618Zm-43.752,2.344v-6.087h13.63l6.038-7.458h-27.127v21h21.089l6.038-7.458Z" transform="translate(-1277.783 -2750.373)" fill="white" fill-rule="evenodd"></path>
        </svg>
        :
        newPathname
      }</div>
      <div className={styles.menu}>
        <div className={styles.icons}>
          <MdPublic size={20} />
        </div>
        <div className={styles.userName}>
          <div className={styles.user} onClick={handleUsername}>Partner Test <span><KeyboardArrowDownIcon /></span></div>
          {userOption &&
            <div className={styles.options}>
              <a href="" className={styles.option1}>Şifre değiştir</a>
              <a href="" className={styles.option1}>Çıkış</a>
            </div>

          }
        </div>
      </div>
    </div >
  )
}

const inputStyle = {
  padding: "8px",
  width: "0%",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#2e374a",
};

export default Navbar