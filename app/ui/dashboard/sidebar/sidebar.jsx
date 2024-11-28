import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css"

import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Kullanıcılar",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Fiyat Tarife",
        path: "/dashboard/pricing",
        icon: <MdShoppingBag />,
      },
      {
        title: "Park Oturumları",
        path: "/dashboard/parkSessions",
        icon: <MdAttachMoney />,
      },
      {
        title: "Beyaz Liste",
        path: "/dashboard/whiteList",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "HGS Onay",
        path: "/dashboard/products",
        icon: <MdShoppingBag />,
      },
      {
        title: "HGS Ödemeleri",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      },
      {
        title: "Raporlar",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      }
    ],
  }/* ,
  {
    title: "Analytics",
    list: [
      {
        title: "Revenue",
        path: "/dashboard/revenue",
        icon: <MdWork />,
      },
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Teams",
        path: "/dashboard/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter />,
      },
    ],
  }, */
];

const Sidebar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/noavatar.png" alt="User" width="50" height="50"/>
        <div className={styles.userDetail}>
          <span className={styles.userName}>John Doe</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map(cat =>
          <li key={cat.title}>
            <span className={styles.cat}>{/* {cat.title} */}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>

        )}
      </ul>
      <button className={styles.logout}>
        <MdLogout />
        Çıkış
      </button>
    </div>
  )
}

export default Sidebar