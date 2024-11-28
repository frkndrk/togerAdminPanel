"use client"
import { usePathname } from "next/navigation"
import styles from "./navbar.module.css"
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";

const Navbar = () => {

  const [newPathname, setNewPathname] = useState(null);

  const pathname = usePathname();

  useEffect(() => {
    const currentPath = pathname.split("/").pop();
    if (currentPath === "users") {
      setNewPathname("Kullanıcılar")
    } else if (currentPath === "pricing") {
      setNewPathname("Fiyat Tarife")
    } else {
      setNewPathname(null)
    }
  }, [pathname])

  return (
    <div className={styles.container}>
      <div className={styles.title}>{newPathname}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Arama..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  )
}

export default Navbar