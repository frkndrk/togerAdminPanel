"use client";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from 'axios';
import styles from "./parkSessions.module.css";

const ParkSession = () => {
    const gridColumnApi = useRef(null);
    const [gridApi, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [accessToken, setAccessToken] = useState(null);

    /*     const onGridReady = (params) => {
            setGridApi(params.api);
            gridColumnApi.current = params.columnApi;
        }; */

    /*     const onGridReady = (params) => {
            setGridApi(params.api);
            gridColumnApi.current = params.columnApi;
    
            // Kolon genişliklerini tabloya uyarlama
            params.api.sizeColumnsToFit();
    
            // Pencere yeniden boyutlanırsa kolonları yeniden boyutlandır
            window.addEventListener("resize", () => params.api.sizeColumnsToFit());
        }; */


    const onGridReady = (params) => {
        setGridApi(params.api);
        gridColumnApi.current = params.columnApi;

        // Kolon genişliklerini tabloya uyarlama
        params.api.sizeColumnsToFit();

        // Pencere yeniden boyutlanırsa kolonları yeniden boyutlandır
        window.addEventListener("resize", () => params.api.sizeColumnsToFit());

        // Pagination değişimlerini dinleme
        params.api.addEventListener("paginationChanged", () => {
            // AG Grid'deki yeni sayfayı hesapla
            const newPage = params.api.paginationGetCurrentPage() + 1;

            // Yeni sayfaya göre yönlendirme yap
            if (newPage > currentPage) {
                goToNextPage(); // Sonraki sayfa
            } else if (newPage < currentPage) {
                goToPreviousPage(); // Önceki sayfa
            }
        });
    };


    const [columnDefs] = useState([
        { field: "id", headerName: "Id", sortable: true, type: "number", filter: 'agSetColumnFilter' },
        { field: "plateNumber", headerName: "Plaka", sortable: true, type: "number", filter: 'agSetColumnFilter' },
        { field: "vehicleBodyStyle", headerName: "Araç Gövde Tipi", sortable: false, filter: 'agSetColumnFilter' },
        { field: "startedAt", headerName: "Başlangıç Tarihi", sortable: true, type: "number", filter: 'agSetColumnFilter' },
        { field: "endedAt", headerName: "Bitiş Tarihi", sortable: true, type: "number", filter: 'agSetColumnFilter' },
        { field: "parkingTime", headerName: "Park Süresi", sortable: false, filter: 'agSetColumnFilter' },
        { field: "paymentAmount", headerName: "Ödeme Tutarı", sortable: false, filter: 'agSetColumnFilter' },
        { field: "paymentStatus", headerName: "Ödeme Durumu", sortable: false, filter: 'agSetColumnFilter' },
        {
            headerName: "",
            cellRenderer: (params) => (
                <div style={{ width: "100%", height: "100%" }}>
                    <img src={params.data.entryPlatePhoto} style={{ width: "100%", height: "100%", objectFit: "fit" }} />
                </div>
            ),
            width: 220
        },
    ]);

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

    /* const fetchParkData = async (page = 1) => {
        if (!accessToken) return;

        try {
            setIsLoading(true);

            const response = await axios.get(
                `https://app.toger.co/api/v2/park/3/sessions`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            
            const totalPages = response.data.data.last_page;
            const lastPageResponse = await axios.get(
                `https://app.toger.co/api/v2/park/3/sessions?page=${page}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            console.log(lastPageResponse.data.data.data)


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
            setTotalPages(totalPages);
            setCurrentPage(page);

            console.log(rowData)

            console.log(totalPages)

            console.log(currentPage)
        } catch (err) {
            console.error("Park verilerine erişim hatası:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    }; */

    const fetchParkData = async (page = null) => {
        if (!accessToken) return;

        try {
            setIsLoading(true);

            // İlk yüklemede toplam sayfa sayısını al ve son sayfanın verisini getir
            if (!page) {
                const response = await axios.get(
                    `https://app.toger.co/api/v2/park/3/sessions`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                const totalPageCount = response.data.data.last_page;
                setTotalPages(totalPageCount);

                // İlk yüklemede son sayfayı getir
                page = totalPageCount;
            }

            // Sayfa numarasına göre veri getir
            const pageResponse = await axios.get(
                `https://app.toger.co/api/v2/park/3/sessions?page=${page}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            // Gelen veriyi tabloya uygun şekilde düzenle
            const mappedData = pageResponse.data.data.data.map((session) => ({
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
                entryPlatePhoto: session.entryPlatePhoto
            }));

            setRowData(mappedData); // Tabloya veriyi aktar
            setCurrentPage(page);   // Geçerli sayfayı ayarla

            console.log("Güncel Veriler:", mappedData);
            console.log("Toplam Sayfalar:", totalPages);
            console.log("Mevcut Sayfa:", currentPage);
        } catch (err) {
            console.error("Park verilerine erişim hatası:", err.response?.data || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const goToNextPage = () => {
        // Ters sayfalama: Toplam sayfadan 1 çıkar ve geriye doğru ilerle
        if (currentPage > 1) {
            const nextPage = currentPage - 1;
            fetchParkData(nextPage);
        }
    };

    const goToPreviousPage = () => {
        // Ters sayfalama: Toplam sayfaya doğru ilerle
        if (currentPage < totalPages) {
            const previousPage = currentPage + 1;
            fetchParkData(previousPage);
        }
    };

    const calculateParkingTime = (start, end) => {
        const diffMs = new Date(end) - new Date(start);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${hours > 0 ? `${hours}:` : "00:"}${minutes > 0 && minutes < 10 ? `0${minutes}:` : `${minutes}:`}${seconds > 0 && seconds < 10 ? `0${seconds}` : seconds}`;
    };

    console.log(currentPage);
    console.log(totalPages);


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
            number: { filter: 'agNumberColumnFilter' },
        },
        defaultColDef: {
            suppressHeaderMenuButton: true, // Tüm kolonlar için menüyü devre dışı bırakır
        },
    };

    return (
        <div className={styles.container}>
            {isLoading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div>

                    <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
                        <AgGridReact
                            rowData={rowData}
                            gridOptions={gridOptions}
                            onGridReady={onGridReady}
                            columnDefs={columnDefs}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParkSession;

