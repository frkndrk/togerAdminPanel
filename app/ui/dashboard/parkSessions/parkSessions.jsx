"use client";
import { useEffect, useRef, useState } from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { CiEdit } from "react-icons/ci";
import styles from "./parkSessions.module.css"
import axios from 'axios';

const ParkSession = () => {

    /* const gridApi = useRef(null); */  // Grid API için referans ekliyoruz
    const gridColumnApi = useRef(null);  // Column API için referans

    //
    const [gridApi, setGridApi] = useState(null);
    const perPage = 10;

    const onGridReady = (params) => {
        setGridApi(params.api);
        gridColumnApi.current = params.columnApi; // Column API kaydediliyor
    };


    const localeText = {
        page: 'Sayfa',
        more: 'Daha fazla',
        to: 'ile',
        of: 'üzerinden',
        next: 'Sonraki',
        previous: 'Önceki',
        loadingOoo: 'Yükleniyor...',
        filterOoo: "Filtre",
        // Filtre metinleri
        equals: 'Eşittir',
        notEqual: 'Eşit değil',
        lessThan: 'Küçüktür',
        greaterThan: 'Büyüktür',
        inRange: 'Aralıkta',
        contains: 'İçerir',
        notContains: 'İçermez',
        startsWith: 'İle başlar',
        endsWith: 'İle biter',
        blank: "Boş",
        notBlank: "Boş Değil"
        // Diğer çeviriler buraya eklenebilir
    };

    const gridOptions = {
        pagination: true, // Sayfalama etkinleştir
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100], // Her sayfada 10 satır göster
        suppressPaginationPanel: false, // Dahili ileri/geri butonlarını etkinleştir
        localeText: {
            pageSize: "Sayfa Boyutu",
            to: "ile",
            of: "toplam",
            nextPage: "Sonraki",
            previousPage: "Önceki",
        },
        paginationAutoPageSize: false,
        paginateChildRows: true,
        columnTypes: {
            number: { filter: 'agNumberColumnFilter', editable: true },
          },
    };


    // Excel Buton Fonksiyonu
    const handleExport = () => {
        if (gridApi && gridApi.exportDataAsExcel) {
            gridApi.exportDataAsExcel(); // API üzerinden Excel dışa aktar
        }

    };

    ///
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [columnDefs] = useState([
        { field: "id", headerName: "Id", sortable: false, type: "number" },
        { field: "plateNumber", headerName: "Plaka", sortable: false, type: "number" },
        { field: "vehicleBodyStyle", headerName: "Araç Gövde Tipi", sortable: false },
        { field: "startedAt", headerName: "Başlangıç Tarihi", sortable: false, type: "number" },
        { field: "endedAt", headerName: "Bitiş Tarihi", sortable: false, type: "number" },
        { field: "parkingTime", headerName: "Park Süresi", sortable: false },
        { field: "paymentAmount", headerName: "Ödeme Tutarı", sortable: false },
        { field: "paymentStatus", headerName: "Ödeme Durumu", sortable: false },
    ]);

    const [email] = useState("partnertest@gmail.com");
    const [password] = useState("Partner@123");
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);

    // Kullanıcı doğrulaması yap
    const authenticateUser = async () => {
        try {
            const response = await axios.post("https://app.toger.co/api/v2/auth", {
                email,
                password,
            });

            // Yanıtı kontrol et
            console.log("API Yanıtı:", response.data);

            const token = response.data.data.token // Token'ı kontrol et
            if (token) {
                setAccessToken(token);
                console.log("Access Token alındı:", token);
            } else {
                console.error("Token alınamadı.");
            }
        } catch (err) {
            console.error("Doğrulama hatası:", err.response ? err.response.data : err.message);
            setError("Doğrulama başarısız.");
        }
    };


    const calculateParkingTime = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate - startDate;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${hours > 0 ? `${hours}:` : "00:"
            } ${minutes > 0 && minutes < 10 ? `0${minutes}:` : `${minutes}:`
            } ${seconds > 0 && seconds < 10 ? `0${seconds}` : `${seconds}`
            }`.trim();
    };

    const fetchParkData = async () => {
        if (!accessToken) {
            console.error("Access Token eksik! Önce doğrulama yapmanız gerekiyor.");
            return;
        }

        try {
            const response = await axios.get("https://app.toger.co/api/v2/park/3/sessions", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const totalPages = response.data.data.last_page;
            const lastPageResponse = await axios.get(
                `https://app.toger.co/api/v2/park/3/sessions?page=${totalPages}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const mappedData = lastPageResponse.data.data.data.map((session) => ({
                id: session.id,
                plateNumber: session.plateNumber || "Belirtilmedi",
                vehicleBodyStyle: session.vehicleBodyStyle || "Belirtilmedi",
                startedAt: session.startedAt
                    ? new Date(session.startedAt).toLocaleString()
                    : "Belirtilmedi",
                endedAt: session.endedAt
                    ? new Date(session.endedAt).toLocaleString()
                    : "Devam ediyor",
                parkingTime:
                    session.startedAt && session.endedAt
                        ? calculateParkingTime(session.startedAt, session.endedAt)
                        : "Devam ediyor",
                paymentAmount: session.paymentAmount
                    ? `${session.paymentAmount} ₺`
                    : "Belirtilmedi",
                paymentStatus: session.status || "Belirtilmedi",
            }));

            setRowData(mappedData);
        } catch (err) {
            console.error("Park verilerine erişim hatası:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };


    // useEffect içinde yeniden tanımlamadan fetchParkData çağrısı yapılıyor
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

            {isLoading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        gridOptions={gridOptions}
                        localeText={localeText}
                    />
                </div>
            )}
        </div>
    )
}

export default ParkSession;