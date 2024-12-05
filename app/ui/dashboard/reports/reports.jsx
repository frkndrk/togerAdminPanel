"use client";
import { useEffect, useState } from "react";
import styles from "./reports.module.css"
import axios from 'axios';

const Reports = () => {


    /* const [accessToken, setAccessToken] = useState(null);
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
    }, [accessToken]); */
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

            </div>
        </div>
    )
}

export default Reports