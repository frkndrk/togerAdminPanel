"use client"

import Card from "../ui/dashboard/card/card"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"
import Rightbar from "../ui/dashboard/rightbar/rightbar"
import Transactions from "../ui/dashboard/transactions/transactions"


import { useContext } from 'react';
import { AuthContext } from '.././authContext';
import { useRouter } from "next/navigation";

const Dashboard = () => {
  

  const { pointId } = useContext(AuthContext);

  console.log(pointId)

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  )
}

export default Dashboard