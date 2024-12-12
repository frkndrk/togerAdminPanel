"use client";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from 'axios';
import styles from "./parkSessions.module.css";/* 
import "../../../../.next/static/css/app/dashboard/parkSessions/page.css" */

import * as XLSX from "xlsx";


import { useContext } from 'react';
import { AuthContext } from '../../../authContext';

const ParkSession = () => {

    const { accessToken, pointId } = useContext(AuthContext);
    console.log("kullanıcı sayfası point id:", pointId)

    const gridColumnApi = useRef(null);
    const [gridApi, setGridApi] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(0);/* 
    const [accessToken, setAccessToken] = useState(null); */
    const [perPage, setPerPage] = useState(10)

    


    const onGridReady = (params) => {
        setGridApi(params.api);
        gridColumnApi.current = params.columnApi;

        // Kolon genişliklerini tabloya uyarlama
        params.api.sizeColumnsToFit();

        // Pencere yeniden boyutlanırsa kolonları yeniden boyutlandır
        window.addEventListener("resize", () => params.api.sizeColumnsToFit());


    };

    // Excel Buton Fonksiyonu
/*     const handleExport = () => {
        if (!gridApi) {
            console.error("Grid API'ye erişilemiyor!");
            return;
        }

        // Excel dışa aktarım için gerekli parametreler
        const exportParams = {
            fileName: "ParkSessions.xlsx", // Dosya adı
            sheetName: "Park Sessions",  // Sayfa adı
            allColumns: true,           // Tüm sütunları dahil et
            onlySelected: false,        // Sadece seçili veriler değil, tüm verileri aktar
            columnGroups: true,         // Sütun gruplarını dahil et
        };

        gridApi.exportDataAsExcel(exportParams); // Veriyi Excel'e dışa aktar
    }; */

    const handleExport = () => {
        if (!rowData || rowData.length === 0) {
            console.error("Veri mevcut değil!");
            return;
        }
    
        // Sütun başlıkları ve verileri ayarla
        const headers = columnDefs.map(col => col.headerName).filter(Boolean); // headerName değerlerini al
        const data = rowData.map(row => 
            columnDefs.map(col => row[col.field]) // field değerine göre veri çek
        );
    
        // Veriyi birleştir
        const worksheetData = [headers, ...data];
    
        // Excel sayfasını oluştur
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // Yeni bir çalışma kitabı oluştur
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Park Sessions");
    
        // Dosyayı dışa aktar
        XLSX.writeFile(workbook, "ParkSessions.xlsx");
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
                    <img src={params.data.entryPlatePhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            ),
            width: 220
        },
    ]);

/*     const authenticateUser = async () => {
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
 */

    const fetchParkData = async (page = null, perPage = 10) => {
        if (!accessToken) return;

        try {
            setIsLoading(true);

            // İlk yüklemede toplam sayfa sayısını al ve son sayfanın verisini getir
            if (!page) {
                const response = await axios.get(
                    `https://app.toger.co/api/v2/park/${pointId}/sessions`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );

                const totalPageCount = response.data.data.last_page;
                setTotalPages(totalPageCount);

                // İlk yüklemede son sayfayı getir
                page = totalPageCount;
            }

            console.log(perPage)
            // Sayfa numarasına göre veri getir
            const pageResponse = await axios.get(
                `https://app.toger.co/api/v2/park/${pointId}/sessions?page=${page}&per_page=${perPage}`,
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

    const goToFirstPage = () => {
        // Ters sayfalama: Toplam sayfaya doğru ilerle
        fetchParkData(totalPages);
        setPageNumber(1);
    };

    const goToNextPage = () => {
        // Ters sayfalama: Toplam sayfadan 1 çıkar ve geriye doğru ilerle
        if (currentPage > 1) {
            const nextPage = currentPage - 1;
            fetchParkData(nextPage);
            setPageNumber(pageNumber + 1);
        }
    };

    const goToPreviousPage = () => {
        // Ters sayfalama: Toplam sayfaya doğru ilerle
        if (currentPage < totalPages) {
            const previousPage = currentPage + 1;
            fetchParkData(previousPage);
            setPageNumber(pageNumber - 1);
        }
    };

    const goToLastPage = () => {
        // Ters sayfalama: Toplam sayfaya doğru ilerle
        fetchParkData(1);
        setPageNumber(totalPages);
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

/* 
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

    useEffect(() => {
        if (accessToken) fetchParkData();
      }, [accessToken]);


    const gridOptions = {
        pagination: false, // Sayfalama etkinleştir
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
        notBlank: "Boş Değil",
        // Diğer çeviriler buraya eklenebilir
    };


    return (
        <div className={styles.container}>
            {isLoading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div>
                    <div className={styles.btnCont}>
                        <button className={styles.excelBtn} onClick={handleExport} style={{ marginBottom: "10px" }}>
                            Excel'e Aktar
                        </button>
                    </div>
                    <div className="ag-theme-quartz" style={{ position: "relative", height: 530, width: "100%" }}>
                        <AgGridReact
                            rowData={rowData}
                            gridOptions={gridOptions}
                            onGridReady={onGridReady}
                            columnDefs={columnDefs}
                            localeText={localeText}
                        />
                        <div style={{ position: "absolute", bottom: "10px", right: "0" }} className="ag-paging-panel ag-unselectable ag-focus-managed" id="ag-10"><div className="ag-tab-guard ag-tab-guard-top" role="presentation" tabIndex="0"></div>
                            <span className="ag-paging-page-size" data-ref="pageSizeComp"><div className="ag-picker-field ag-labeled ag-label-align-left ag-select" role="presentation">
                                <div data-ref="eLabel" className="ag-label" aria-hidden="false" id="ag-12-label" style={{ marginRight: "10px" }}>Sayfa boyutu:</div>
                                <div data-ref="eWrapper" className="ag-wrapper ag-picker-field-wrapper ag-picker-collapsed" tabIndex="0" aria-expanded="false" role="combobox" aria-controls="ag-select-list-13" aria-label="Page Size">
                                    <div data-ref="eDisplayField" className="ag-picker-field-display" id="ag-12-display">
                                        <select onChange={(e) => {
                                            const newPerPage = parseInt(e.target.value, 10); // Seçilen değeri al ve sayıya çevir
                                            setPerPage(newPerPage); // perPage'i güncelle
                                            fetchParkData(currentPage, newPerPage); // Güncellenmiş perPage ile veriyi tekrar getir
                                        }} name="" data-ref="eDisplayField" className="ag-picker-field-display" id="ag-12-display" style={{ color: "#fff", listStyle: "none", border: "none", width: "90%", height: "100%" }}>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                    {/* <div data-ref="eIcon" className="ag-picker-field-icon" aria-hidden="true"><span className="ag-icon ag-icon-small-down" unselectable="on" role="presentation"></span></div> */}
                                </div>
                            </div></span>
                            <span className="ag-paging-page-summary-panel" role="presentation">
                                <div onClick={goToFirstPage} data-ref="btFirst" className="ag-button ag-paging-button" role="button" aria-label="First Page" tabIndex="0" aria-disabled="true"><span className="ag-icon ag-icon-first" unselectable="on" role="presentation"></span></div>
                                <div onClick={goToPreviousPage} data-ref="btPrevious" className="ag-button ag-paging-button" role="button" aria-label="Önceki" tabIndex="0" aria-disabled="true"><span className="ag-icon ag-icon-previous" unselectable="on" role="presentation"></span></div>
                                <span className="ag-paging-description">
                                    <span id="ag-10-start-page">Sayfa</span>
                                    <span id="ag-10-start-page-number" data-ref="lbCurrent" className="ag-paging-number"> {pageNumber}</span>
                                    <span id="ag-10-of-page"> Toplam </span>
                                    <span id="ag-10-of-page-number" data-ref="lbTotal" className="ag-paging-number">{totalPages}</span>
                                </span>
                                <div onClick={goToNextPage} data-ref="btNext" className="ag-button ag-paging-button" role="button" aria-label="Sonraki" tabIndex="0" aria-disabled="true"><span className="ag-icon ag-icon-next" unselectable="off" role="presentation"></span></div>
                                <div onClick={goToLastPage} data-ref="btLast" className="ag-button ag-paging-button" role="button" aria-label="Last Page" tabIndex="0" aria-disabled="true"><span className="ag-icon ag-icon-last" unselectable="off" role="presentation"></span></div>
                            </span>
                            <div className="ag-tab-guard ag-tab-guard-bottom" role="presentation" tabIndex="0"></div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ParkSession;
