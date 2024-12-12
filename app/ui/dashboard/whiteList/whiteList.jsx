"use client";
import { useEffect, useRef, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from 'axios';/* 
import 'ag-grid-enterprise'; */
import styles from "./whiteList.module.css"
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";

import * as XLSX from 'xlsx';

import { useContext } from 'react';
import { AuthContext } from '../../../authContext';

const WhiteList = () => {

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

    const [showModal, setShowModal] = useState(false);
    const [newWhiteList, setNewWhiteList] = useState({
        plate: "",
        description: "",
        expiryAt: "",
        paymentStatus: "",
    });

    const handleAddWhiteList = () => {
        // Zorunlu alanlar kontrolü
        const { plate, description, expiryAt, paymentStatus } = newWhiteList;

        if (!plate || !description || !expiryAt || !paymentStatus) {
            alert("Lütfen zorunlu alanları doldurun!"); // Uyarı mesajı
            return;
        }

        // Aynı tarif adının tekrar eklenmesini önle
        const isPlateExists = rowData.some(row => row.plate === plate);

        if (isPlateExists) {
            alert("Bu plaka zaten mevcut!");
            return;
        }

        // Son eklenen id'yi al
        const lastId = rowData.length > 0 ? rowData[rowData.length - 1].id : 0;
        let newId = lastId + 1;  // Yeni id'yi bir artırarak oluştur

        console.log(lastId);
        console.log(newId);

        // Bugünün tarihini alıyoruz ve istediğiniz formata çeviriyoruz
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).replace(",", ""); // virgül işaretini kaldırıyoruz

        // Eğer expiryAt null değilse, createdAt tarihinin üzerine 30 gün ekle
        let finalExpiryAt = expiryAt;

        if (expiryAt === "Limitsiz") {
            finalExpiryAt = "Limitsiz"
        }

        else if (expiryAt !== null && expiryAt !== "Limitsiz") {
            const expiryDate = new Date(currentDate);
            expiryDate.setMonth(expiryDate.getMonth() + 1); // Bir sonraki aya geç
            expiryDate.setDate(currentDate.getDate()); // Aynı günü koru

            // 30 gün eklerken tarih geçerliliğini kontrol etmek için (eğer geçerli değilse, bir sonraki ayın son günü yapılacak)
            if (expiryDate.getMonth() !== (currentDate.getMonth() + 1) % 12) {
                expiryDate.setMonth(expiryDate.getMonth() + 1); // Eğer geçerli değilse bir sonraki ayın son günü
                expiryDate.setDate(0); // Son gün
            }

            finalExpiryAt = expiryDate.toLocaleString("tr-TR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }).replace(",", ""); // virgül işaretini kaldırıyoruz
        }

        newId++; // İlk satır eklendikten sonra id'yi bir arttırıyoruz


        // Yeni kullanıcıyı tabloya ekliyoruz, olusturulmaTarihi'ni ekliyoruz
        const userWithDate = {
            ...newWhiteList,
            id: newId,
            createdAt: formattedDate, // Formatlanmış tarih
            expiryAt: finalExpiryAt,  // Hesaplanan veya mevcut expiryAt
            remainingDays: 30
        };

        // Tabloya ekle
        setRowData([...rowData, userWithDate]);

        console.log(rowData);

        // Input alanlarını sıfırla
        setNewWhiteList({
            plate: "",
            description: "",
            expiryAt: "",
            paymentStatus: "",
        });

        setShowModal(false); // Modalı kapat
    };


    console.log(rowData);


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
            fileName: "WhiteList.xlsx", // Dosya adı
            sheetName: "White List",  // Sayfa adı
            allColumns: true,           // Tüm sütunları dahil et
            onlySelected: false,        // Sadece seçili veriler değil, tüm verileri aktar
            columnGroups: true,         // Sütun gruplarını dahil et
        };

        gridApi.exportDataAsExcel(exportParams); // Veriyi Excel'e dışa aktar
    }; */

    const handleExport = () => {
        // Excel'e dışa aktarılacak verilerin formatını oluştur
        const data = rowData.map(row => ({
            'Oluşturulma Tarihi' :row.createdAt,
            Plaka: row.plate,
            Açıklama: row.description,
            'Bitiş Tarihi': row.expiryAt,
            'Ödeme Durumu': row.paymentStatus,
        }));
    
        // Veriyi bir Excel dosyasına dönüştür
        const ws = XLSX.utils.json_to_sheet(data); // JSON verisini bir sheet'e çevir
        const wb = XLSX.utils.book_new(); // Yeni bir çalışma kitabı oluştur
        XLSX.utils.book_append_sheet(wb, ws, 'Data'); // Veriyi çalışma kitabına ekle
    
        // Excel dosyasını indirmek için oluştur
        const currentDate = new Date().toISOString().slice(0, 10); // Bugünün tarihini al
        const fileName = `export_${currentDate}.xlsx`;
    
        // Dosyayı indirmek için kullan
        XLSX.writeFile(wb, fileName);
    };
    


    const [columnDefs] = useState([
        { field: "createdAt", headerName: "Oluşturulma Tarihi", sortable: true, type: "number", minWidth: 170},
        { field: "plate", headerName: "Plaka", sortable: true, type: "number", filter: 'agSetColumnFilter', minWidth: 110},
        { field: "description", headerName: "Açıklama", sortable: true, type: "number", filter: 'agSetColumnFilter', minWidth: 200 },
        { field: "paymentStatus", headerName: "Ödeme Durumu", sortable: false, minWidth: 110 },
        {
            field: "expiryAt",
            headerName: "Bitiş Tarihi (Kalan Gün)",
            sortable: true,
            type: "number",
            valueGetter: (params) => {
                const expiryAt = params.data.expiryAt || "Limitsiz"; // Bitiş tarihi
                const remainingDays = params.data.remainingDays;    // API'den gelen remainingDays verisi

                // Eğer remainingDays mevcut değilse sadece expiryAt döndür
                if (remainingDays === undefined || expiryAt === "Limitsiz") {
                    return expiryAt;
                }

                // Kalan gün bilgisiyle formatlanmış döndür
                return `${expiryAt} (${remainingDays > 0 ? `${remainingDays} gün kaldı` : "Süre doldu"})`;
            },
            minWidth: 270
        },
        {
            headerName: "",
            cellRenderer: (params) => (
                <div className={styles.edBtn}>
                    <button
                        className={styles.editBtn}
                        onClick={() => openEditPopup(params.data)}
                        style={{ marginRight: 5 }}
                    >
                        <CiEdit />
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(params.data.id)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            ),
            // Excel dışa aktarıma dahil etmiyoruz
            excelExport: false,
            width: 100
        },
    ]);


    const [editPopupData, setEditPopupData] = useState(null);

    const openEditPopup = (data) => {
        setEditPopupData({ ...data }); // Düzenlenecek veriyi state'e atıyoruz
    };

    const closeEditPopup = () => {
        setEditPopupData(null); // Pop-up'ı kapatıyoruz
    };

    const handleDelete = (id) => {
        setRowData((prevData) => prevData.filter((row) => row.id !== id)); // Sadece seçilen satırı siliyoruz
    };

    console.log(editPopupData)

    const saveEdit = () => {
        const updatedRowData = rowData.map((item) => {
            if (item.id === editPopupData.id) {
                const updatedItem = { ...item, ...editPopupData }; // Düzenleme popup'ındaki veriyi al
    
                if (editPopupData.expiryAt === "30 Gün") {
                    try {
                        // createdAt değerini parse et
                        const [day, month, year, hour, minute, second] = item.createdAt.split(/[.\s:]/);
                        const createdDate = new Date(year, month - 1, day, hour, minute, second); // Tarihi oluştur
    
                        // Bir sonraki ayın aynı günü için tarihi ayarla
                        const expiryDate = new Date(createdDate);
                        expiryDate.setMonth(expiryDate.getMonth() + 1); // Bir ay ekle
    
                        // Yeni tarihi formatla ve expiryAt olarak ata
                        updatedItem.expiryAt = expiryDate.toLocaleString("tr-TR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        });
                    } catch (error) {
                        console.error("Tarih hesaplama hatası:", error);
                    }
                }
    
                return updatedItem; // Güncellenmiş öğeyi döndür
            }
            return item; // Diğer veriler değişmeden kalsın
        });
    
        setRowData(updatedRowData); // State'i güncelle
        setEditPopupData(null); // Düzenleme popup'ını sıfırla
        closeEditPopup(); // Düzenleme popup'ını kapat
    };
    

    //

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
    }; */


    const fetchParkData = async (page = null, perPage = 10) => {
        if (!accessToken) return;

        try {
            setIsLoading(true);

            // İlk yüklemede toplam sayfa sayısını al ve son sayfanın verisini getir
            if (!page) {
                const response = await axios.get(
                    `https://app.toger.co/api/v2/park/${pointId}/whitelist`,
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
                `https://app.toger.co/api/v2/park/${pointId}/whitelist?page=${page}&per_page=${perPage}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            console.log(pageResponse)

            // Gelen veriyi tabloya uygun şekilde düzenle
            const mappedData = pageResponse.data.data.data.map((session) => ({
                id: session.id,
                createdAt: session.createdAt
                    ? new Date(session.createdAt).toLocaleString()
                    : "Belirtilmedi",
                plate: session.plate || "Belirtilmedi",
                description: session.description
                    ? `${session.description}`
                    : "Belirtilmedi",
                paymentStatus: session.paymentStatus || "Belirtilmedi",
                expiryAt: session.expiryAt
                    ? (new Date(session.expiryAt).toLocaleString())
                    : "Limitsiz",
                remainingDays: session.remainingDays
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

    console.log(currentPage);
    console.log(totalPages);


/*     useEffect(() => {
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
 */

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
        paginateChildRows: true,/* 
        columnTypes: {
            number: { filter: 'agNumberColumnFilter' },
        }, */
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
            {/* Açılır Pencere (Modal) */}
            {showModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={userHeaderStyle}>Yeni Ekle</h2>

                        <label style={labelStyle} htmlFor="plaka">
                            Plaka
                        </label>
                        <input
                            id="plaka"
                            type="text"
                            placeholder="Plaka"
                            value={newWhiteList.plate}
                            onChange={(e) => setNewWhiteList({ ...newWhiteList, plate: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={labelStyle} htmlFor="aciklama">
                            Açıklama
                        </label>
                        <input
                            id="aciklama"
                            type="text"
                            placeholder="Açıklama"
                            value={newWhiteList.description}
                            onChange={(e) => setNewWhiteList({ ...newWhiteList, description: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={labelStyle} htmlFor="bitis-tarihi">
                            Bitiş Tarihi
                        </label>
                        <select
                            id="bitis-tarihi"
                            value={newWhiteList.expiryAt}
                            onChange={(e) => setNewWhiteList({ ...newWhiteList, expiryAt: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Seçiniz</option>
                            <option value="Limitsiz">Limitsiz</option>
                            <option value="30 Gün">30 Gün</option>
                        </select>

                        <label style={labelStyle} htmlFor="odeme-durumu">
                            Ödeme Durumu
                        </label>
                        <select
                            id="odeme-durumu"
                            value={newWhiteList.paymentStatus || ""}
                            onChange={(e) => setNewWhiteList({ ...newWhiteList, paymentStatus: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Seçiniz</option>
                            <option value="Ücretsiz">Ücretsiz</option>
                            <option value="Ödenmiş">Ödenmiş</option>
                            <option value="Ödenmemiş">Ödenmemiş</option>
                        </select>

                        <button onClick={handleAddWhiteList} style={buttonStyle}>
                            Kaydet
                        </button>
                        <button onClick={() => setShowModal(false)} style={buttonStyle}>
                            İptal
                        </button>
                    </div>
                </div>
            )}


            {isLoading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div>
                    <div className={styles.btnCont}>
                        <button className={styles.newUser} onClick={() => setShowModal(true)} style={{ marginBottom: "10px" }}>
                            Yeni Ekle
                        </button>

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

            {/* Düzenleme Pop-up'ı */}
            {editPopupData && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={userHeaderStyle}>Kullanıcıyı Düzenle</h2>

                        <label style={labelStyle} htmlFor="plaka">
                            Plaka
                        </label>
                        <input
                            id="plaka"
                            type="text"
                            placeholder="Plaka"
                            value={editPopupData.plate}
                            onChange={(e) => setEditPopupData({ ...editPopupData, plate: e.target.value })}
                            style={inputStyle}
                        />

                        <label style={labelStyle} htmlFor="aciklama">
                            Açıklama
                        </label>
                        <input
                            id="aciklama"
                            type="text"
                            placeholder="Açıklama"
                            value={editPopupData.description}
                            onChange={(e) => setEditPopupData({ ...editPopupData, description: e.target.value })}
                            style={inputStyle}
                        />

                        //
                        <label style={labelStyle} htmlFor="bitis-tarihi">
                            Bitiş Tarihi
                        </label>
                        <select
                            id="bitis-tarihi"
                            value={editPopupData.expiryAt}
                            onChange={(e) => setEditPopupData({ ...editPopupData, expiryAt: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Seçiniz</option>
                            <option value="Limitsiz">Limitsiz</option>
                            <option value="30 Gün">30 Gün</option>
                        </select>

                        <label style={labelStyle} htmlFor="odeme-durumu">
                            Ödeme Durumu
                        </label>
                        <select
                            id="odeme-durumu"
                            value={editPopupData.paymentStatus || ""}
                            onChange={(e) => setEditPopupData({ ...editPopupData, paymentStatus: e.target.value })}
                            style={inputStyle}
                        >
                            <option value="">Seçiniz</option>
                            <option value="Ücretsiz">Ücretsiz</option>
                            <option value="Ödenmiş">Ödenmiş</option>
                            <option value="Ödenmemiş">Ödenmemiş</option>
                        </select>
                        <div /* style={btnCont} */>
                            <button onClick={saveEdit} style={buttonStyle}>
                                Kaydet
                            </button>
                            <button onClick={closeEditPopup} style={buttonStyle}>
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Stil Tanımlamaları
const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Z-index değeri artırıldı
};


const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "300px",
    gap: "10px",
};

const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "80%",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

const buttonStyle = {
    margin: "5px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

const userHeaderStyle = {
    margin: "5px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#000"
};

const labelStyle = {
    marginBottom: "-5px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "left"
};

export default WhiteList