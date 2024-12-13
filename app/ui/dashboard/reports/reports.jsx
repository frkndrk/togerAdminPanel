"use client";
"use strict";


import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';


import styles from "./reports.module.css"
import "./style.css"


import { useEffect, useState } from "react";
import axios from 'axios';


const Reports = () => {

    const [accessToken, setAccessToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const authenticateUser = async () => {
        try {
            const response = await axios.post("https://app.toger.co/api/v2/auth", {
                email: "partnertest@gmail.com",
                password: "Partner@123",
            });

            const token = response.data.data.token;
            if (token) {
                setAccessToken(token);
            }
        } catch (err) {
            console.error("Doğrulama hatası:", err.response?.data || err.message);
        }
    };

    console.log(accessToken)

    const fetchParkData = async () => {
        if (!accessToken) return;

        try {
            setIsLoading(true);

                const response2 = await axios.get(
                    `https://app.toger.co/api/v2/park/`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                console.log(response2) 

        } catch (err) {
            console.error("Park verilerine erişim hatası:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            if (!accessToken) {
                await authenticateUser(); // Access token yoksa yenile
            }

            if (accessToken) {
                await fetchParkData(); // Burada üstte tanımlı fetchParkData çağrılıyor
            }
        };
        fetchData(); // İçerideki asenkron işlemi çağırıyoruz
    }, [accessToken]);




    return (
        <div className={styles.container}>
            <div className={styles.dateCont}>
                <div className={styles.date}>Günlük</div>
                <div className={styles.date}>Haftalık</div>
                <div className={styles.date}>Aylık</div>
                <div className={styles.date}>Özel Tarih</div>
            </div>
            <div className={styles.valuesCont}>
                <div className={styles.value}>
                    <h3>Tamamlanan Parklar</h3>
                    <span className={styles.count}>3</span>
                </div>
                <div className={styles.value}>
                    <h3>Ciro</h3>
                    <span className={styles.count}>230 TL</span>
                </div>
                <div className={styles.value}>
                    <h3>Kazanç (Başarılı Çekimler)</h3>
                    <span className={styles.count}>230 TL</span>
                </div>
            </div>
            <div className={styles.graphicsCont}>
                <div className={styles.completedChart}>
                    <h3 className={styles.header}>Tamamlanan Parklar</h3>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['2024-11-30', '2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04'] }]}
                        series={[
                            { data: [2.0, 1.0, 3.1, 2, 1.2 ], color: '#35f1b5', label: "Ended Sessions" }
                        ]}
                    />
                </div>
                <div className={styles.paymentsChart}>
                    <h3 className={styles.header}>Ödemeler</h3>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['2024-11-30', '2024-12-01', '2024-12-02'] }]}
/*                         series={[
                            { data: [2.0, 1.0, 3.1, 2, 1.2 ], color: '#fdb462', label: "Ended Sessions" }
                        ]} */
                        series={[{ data: [4, 3, 5], color: '#235fe0', label: "Ciro" }, { data: [2, 6, 3], color: '#35bff1', label: "Başarılı Çekim" }, { data: [0, 0, 1], color: '#e96048', label: "Başarısız Çekim" }]}
                    />
                </div>
            </div>
        </div>
    )
}

export default Reports