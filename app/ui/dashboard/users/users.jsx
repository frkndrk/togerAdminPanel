"use client";
import { useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import 'ag-grid-enterprise';
import styles from "./users.module.css"
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";

const Users = () => {

    const gridApi = useRef(null);  // Grid API için referans ekliyoruz
    const gridColumnApi = useRef(null);  // Column API için referans

    const [rowData, setRowData] = useState([
        { id: 1, olusturulmaTarihi: "15.11.2024 22:10:54", ad: "İbrahim", soyad: "Durak", telefon: "5454555567", email: "ibo@gmail.com" },
        { id: 2, olusturulmaTarihi: "05.08.2023 08:20:36", ad: "Furkan", soyad: "Durak", telefon: "5414534518", email: "fuko@gmail.com" },
        { id: 3, olusturulmaTarihi: "22.05.2024 13:21:29", ad: "Samed", soyad: "Durak", telefon: "5326830529", email: "samo@gmail.com" },
    ]);


    const [columnDefs] = useState([
        { field: "olusturulmaTarihi", headerName: "Oluşturulma Tarihi" },
        { field: "ad", headerName: "Ad", filter: true, floatingFilter: true },
        { field: "soyad", headerName: "Soyad", filter: true, floatingFilter: true },
        { field: "telefon", headerName: "Telefon", filter: true, floatingFilter: true },
        { field: "email", headerName: "E-Mail", filter: true, floatingFilter: true },
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
                    <button className={styles.deleteBtn} onClick={() => handleDelete(params.data.id)}><AiOutlineDelete /></button>
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

    const saveEdit = () => {
        setRowData((prevData) =>
            prevData.map((row) =>
                row.id === editPopupData.id ? { ...editPopupData } : row // `id`'yi kullanarak düzenleme yapıyoruz
            )
        );
        closeEditPopup(); // Pop-up'ı kapat
    };



    const handleDelete = (id) => {
        setRowData((prevData) => prevData.filter((row) => row.id !== id)); // Sadece seçilen satırı siliyoruz
    };


    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ ad: "", soyad: "", telefon: "", email: "" });

    const handleAddUser = () => {
        // Aynı e-posta adresine sahip bir kullanıcı var mı kontrol ediyoruz
        const isEmailExists = rowData.some(row => row.email === newUser.email);

        if (isEmailExists) {
            alert("Bu e-mail adresi zaten mevcut!"); // Uyarı mesajı göster
            return; // İşlemi durdur
        }

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

        // Yeni kullanıcıyı tabloya ekliyoruz, olusturulmaTarihi'ni ekliyoruz
        const userWithDate = {
            ...newUser,
            olusturulmaTarihi: formattedDate, // Formatlanmış tarih
        };

        setRowData([...rowData, userWithDate]); // Yeni kullanıcıyı tabloya ekle
        setNewUser({ ad: "", soyad: "", telefon: "", email: "" }); // Formu sıfırla
        setShowModal(false); // Modalı kapat
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
        pagination: true,
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100],  // 10 sayfasını da ekliyoruz
        localeText: {
            pageSize: "Sayfa Boyutu", // "Page Size" metni yerine kullanılacak metin
        },
        rowSelection: { type: 'single' },
        defaultColDef: {
            suppressMenu: true, // Tüm kolonlar için menüyü devre dışı bırakır
        }
    };

    // Excel Buton Fonksiyonu
    const handleExport = () => {
        if (gridApi.current) {
            gridApi.current.exportDataAsExcel();  // API üzerinden Excel dışa aktar
            console.log()
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.btnCont}>
                <button className={styles.newUser} onClick={() => setShowModal(true)} style={{ marginBottom: "10px" }}>
                    Yeni Kullanıcı Ekle
                </button>

                <button className={styles.excelBtn} onClick={handleExport} style={{ marginBottom: "10px" }}>
                    Excel'e Aktar
                </button>
            </div>

            {/* Açılır Pencere (Modal) */}
            {showModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={userHeaderStyle}>Yeni Kullanıcı Ekle</h2>
                        <input
                            type="text"
                            placeholder="Ad"
                            value={newUser.ad}
                            onChange={(e) => setNewUser({ ...newUser, ad: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Soyad"
                            value={newUser.soyad}
                            onChange={(e) => setNewUser({ ...newUser, soyad: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            placeholder="Telefon"
                            value={newUser.telefon}
                            onChange={(e) => setNewUser({ ...newUser, telefon: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            style={inputStyle}
                        />
                        <button onClick={handleAddUser} style={buttonStyle}>
                            Kaydet
                        </button>
                        <button onClick={() => setShowModal(false)} style={buttonStyle}>
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Tablo */}
            <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
                {/* <AgGridReact rowData={rowData} columnDefs={columnDefs} /> */}
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    localeText={localeText}
                    rowSelection="multiple"
                    gridOptions={gridOptions}
                    onGridReady={(params) => {
                        gridApi.current = params.api;  // Grid API'sine referans al
                        gridColumnApi.current = params.columnApi;  // Column API'sine referans al
                    }}
                />

            </div>

            {/* Düzenleme Pop-up'ı */}
            {editPopupData && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={userHeaderStyle}>Kullanıcıyı Düzenle</h2>
                        <input
                            type="text"
                            value={editPopupData.ad}
                            onChange={(e) => setEditPopupData({ ...editPopupData, ad: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={editPopupData.soyad}
                            onChange={(e) => setEditPopupData({ ...editPopupData, soyad: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={editPopupData.telefon}
                            onChange={(e) => setEditPopupData({ ...editPopupData, telefon: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="email"
                            value={editPopupData.email}
                            onChange={(e) => setEditPopupData({ ...editPopupData, email: e.target.value })}
                            style={inputStyle}
                        />
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
    );
};

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
    flexDirection: "column",
    alignItems: "center",
};

const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
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

export default Users;




/* "use client";
import { MdSearch } from "react-icons/md"
import styles from "./search.module.css"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useMemo, useState } from "react";

const Search = () => {

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
        { oluşturulmatarihi: "01-09-2024 09:24:32", ad: "İbrahim", soyad: "Durak", telefon: 5454555567, email: "ibo@gmail.com" },
        { oluşturulmatarihi: "02-10-2024 10:45:19", ad: "Furkan", soyad: "Durak", telefon: 5414534518, email: "fuko@gmail.com" },
        { oluşturulmatarihi: "03-11-2024 12:22:45", ad: "Samed", soyad: "Durak", telefon: 5326830529, email: "samo@gmail.com" },
    ]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);

    const [columnDefs, setColumnDefs] = useState([
        { field: "oluşturulmatarihi", filter: true, floatingFilter: true, editable: true },
        { field: "ad", filter: true, floatingFilter: true, editable: true },
        { field: "soyad", filter: true, floatingFilter: true, editable: true },
        { field: "telefon", filter: true, floatingFilter: true, editable: true },
        { field: "email", filter: true, floatingFilter: true, editable: true }
    ]);

    const rowSelection = useMemo(() => {
        return {
            mode: 'multiRow',
        };
    }, []);

    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 50, 100];

    return (
        <div
            className="ag-theme-quartz" // applying the Data Grid theme
            style={{ height: 500}} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                rowSelection={rowSelection}

                pagination={pagination}
                paginationPageSize={paginationPageSize}
                paginationPageSizeSelector={paginationPageSizeSelector}
            />
        </div>
    )
}

export default Search */

/*
        <div className={styles.container}>
<MdSearch />
<input type="text" placeholder={placeholder} className={styles.input} /> 
        </div>*/