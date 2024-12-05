"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
/* import 'ag-grid-enterprise'; */
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "./pricing.module.css"
import axios from 'axios';

import * as XLSX from "xlsx";

const Pricing = () => {

    const gridApi = useRef(null);  // Grid API için referans ekliyoruz
    const gridColumnApi = useRef(null);  // Column API için referans

    const handleDelete = (id) => {
        setRowData((prevData) => prevData.filter((row) => row.id !== id)); // Sadece seçilen satırı siliyoruz
    };

    const [showModal, setShowModal] = useState(false);
    const [newPricing, setNewPricing] = useState({
        ad: "",
        baslangic: "",
        bitis: "",
        varsayilanFiyat: "",
        sedanFiyat: "",
        hatchbackFiyat: "",
        pickupFiyat: "",
        suvFiyat: "",
        vanFiyat: "",
        motosikletFiyat: "",
        karavanFiyat: "",
        cabrioFiyat: "",
        coupeFiyat: "",
        otobusFiyat: "",
        tirKamyonFiyat: "",
        mpvFiyat: "",
    });

    const handleAddPricing = () => {
        // Zorunlu alanlar kontrolü
        const { ad, baslangic, bitis, varsayilanFiyat, ...otherPrices } = newPricing;

        if (!ad || !bitis || !varsayilanFiyat) {
            alert("Lütfen zorunlu alanları doldurun!"); // Uyarı mesajı
            return;
        }

        // Aynı tarif adının tekrar eklenmesini önle
        const isNameExists = rowData.some(row => row.time === ad);

        if (isNameExists) {
            alert("Bu tarife adı zaten mevcut!");
            return;
        }

        // Son eklenen id'yi al
        const lastId = rowData.length > 0 ? rowData[rowData.length - 1].id : 0;
        let newId = lastId + 1;  // Yeni id'yi bir artırarak oluştur

        console.log(lastId);
        console.log(newId);

        // Yeni satır ekleme
        const newRows = [];

        console.log(newRows)

        // İlk satır (zorunlu alanlarla)
        newRows.push({
            id: newId,
            time: ad,
            startMin: Number(lastFinishMin),
            finishMin: Number(bitis),
            price: Number(varsayilanFiyat),
            vehicleBodyType: "Varsayılan",
        });

        newId++; // İlk satır eklendikten sonra id'yi bir arttırıyoruz

        // Diğer input alanları için
        for (const [key, value] of Object.entries(otherPrices)) {
            if (value) {
                const vehicleType = key.replace("Fiyat", ""); // "sedanFiyat" -> "sedan"
                newRows.push({
                    id: newId,
                    time: ad, // Aynı tarif adını kullan
                    startMin: Number(lastFinishMin), // Başlangıç zamanı aynı
                    finishMin: Number(bitis), // Bitiş zamanı aynı
                    price: Number(value), // Fiyat bu inputtan alınır
                    vehicleBodyType: vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1), // Araç türü
                });
                newId++; // İlk satır eklendikten sonra id'yi bir arttırıyoruz

            }
        }

        // Tabloya ekle
        setRowData([...rowData, ...newRows]);

        // Input alanlarını sıfırla
        setNewPricing({
            ad: "",
            baslangic: "",
            bitis: "",
            varsayilanFiyat: "",
            sedanFiyat: "",
            hatchbackFiyat: "",
            pickupFiyat: "",
            suvFiyat: "",
            vanFiyat: "",
            motosikletFiyat: "",
            karavanFiyat: "",
            cabrioFiyat: "",
            coupeFiyat: "",
            otobusFiyat: "",
            tirKamyonFiyat: "",
            mpvFiyat: "",
        });

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
        /* rowSelection: { type: 'single' }, */
        defaultColDef: {
            suppressHeaderMenuButton: true, // Tüm kolonlar için menüyü devre dışı bırakır
        },
        columnTypes: {
            number: { filter: 'agNumberColumnFilter' },
        },
    };

    const rowSelection = useMemo(() => {
        return {
            mode: 'singleRow',
            checkboxes: false,
            enableClickSelection: true,
        };
    }, []);


    // Excel Buton Fonksiyonu
/*     const handleExport = () => {
        if (gridApi.current) {
            gridApi.current.exportDataAsExcel();  // API üzerinden Excel dışa aktar
            console.log()
        }
    }; */

    const handleExport = () => {
        if (!rowData || rowData.length === 0) {
            alert("Dışa aktarılacak veri bulunamadı!");
            return;
        }
    
        // Verileri Excel için formatlama
        const formattedData = rowData.map((row) => ({
            "Süre": row.time,
            "Araç Gövde Tipi": row.vehicleBodyType,
            "Başlangıç (dk)": row.startMin,
            "Bitiş (dk)": row.finishMin,
            "Fiyat": row.price,
        }));
    
        // Yeni çalışma sayfası ve kitap oluşturma
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Fiyatlandırma");
    
        // Excel dosyasını yazma ve indirme
        XLSX.writeFile(workbook, "Fiyatlandırma.xlsx");
    };


    ///
    const [rowData, setRowData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);



    const [columnDefs] = useState([
        { field: "time", headerName: "Süre", sortable: false },
        { field: "vehicleBodyType", headerName: "Araç Gövde Tipi", sortable: false },
        { field: "startMin", headerName: "Başlangıç (dk)", sortable: false, type: "number" },
        { field: "finishMin", headerName: "Bitiş (dk)", sortable: false, type: "number" },
        { field: "price", headerName: "Fiyat", sortable: false, type: "number" },
        {
            headerName: "",
            cellRenderer: (params) => (
                <div className={styles.edBtn}>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(params.data.id)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            ),
            width: 100,
        },
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

    const [lastFinishMin, setLastFinishMin] = useState(null); // Son finishMin değerini tutmak için
    console.log(lastFinishMin)

    const fetchParkData = async (token) => {
        try {
            const response = await axios.get(`https://app.toger.co/api/v2/park/12/pricing`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const mappedData = response.data.data.map((item, index, array) => {
                const startMin = Number(item.fromMinute);
                const finishMin = Number(item.toMinute);
                const price = Number(item.price);

                const startHour = Math.floor(startMin / 60);
                const finishHour = Math.floor(finishMin / 60);
                const time = `${startHour}-${finishHour} Saat`;

                if (index === array.length - 1) {
                    // Son satırdaki finishMin değerini kaydet
                    setLastFinishMin(finishMin);
                    
                    return {
                        ...item,
                        id: item.id,
                        time: "Tam Gün",
                        vehicleBodyType: "Varsayılan",
                        startMin,
                        finishMin,
                        price,
                    };
                }

                return {
                    ...item,
                    id: item.id,
                    time,
                    vehicleBodyType: "Varsayılan",
                    startMin,
                    finishMin,
                    price,
                };
            });

            setRowData(mappedData);
        } catch (err) {
            console.error("Park verilerine erişim hatası:", err.response ? err.response.data : err.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) {  // Eğer accessToken yoksa, doğrulama işlemi yap
                await authenticateUser();
            }

            if (accessToken) {  // Eğer accessToken varsa, park verilerini çek
                console.log("Access Token alındı:", accessToken);
                fetchParkData(accessToken);
            } else {
                console.log("Access Token alınamadı");
            }
        };

        fetchData();
    }, [accessToken]); // Sadece accessToken değiştiğinde çalışacak

    return (
        <div className={styles.container}>
            <div className={styles.btnCont}>
                <button className={styles.newUser} onClick={() => setShowModal(true)} style={{ marginBottom: "10px" }}>
                    Yeni Tarife Ekle
                </button>

                <button className={styles.excelBtn} onClick={handleExport} style={{ marginBottom: "10px" }}>
                    Excel'e Aktar
                </button>
            </div>

            {/* Açılır Pencere (Modal) */}
            {showModal && (
                <div style={modalStyle}>
                    <div style={modalContentStyle}>
                        <h2 style={userHeaderStyle}>Yeni Fiyatlandırma Ekle</h2>
                        <input
                            type="text"
                            placeholder="Süre"
                            value={newPricing.ad}
                            onChange={(e) => setNewPricing({ ...newPricing, ad: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Başlangıç (dk)" // Başlangıçta placeholder görünür
                            value={lastFinishMin} // fetchParkData'dan gelen finishMin değeri atanır
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Bitiş (dk)"
                            value={newPricing.bitis}
                            onChange={(e) => setNewPricing({ ...newPricing, bitis: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Varsayılan Fiyat"
                            value={newPricing.varsayilanFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, varsayilanFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Sedan Fiyat"
                            value={newPricing.sedanFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, sedanFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Hatchback Fiyat"
                            value={newPricing.hatchbackFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, hatchbackFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Pick-up Fiyat"
                            value={newPricing.pickupFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, pickupFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="SUV Fiyat"
                            value={newPricing.suvFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, suvFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Van Fiyat"
                            value={newPricing.vanFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, vanFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Motosiklet Fiyat"
                            value={newPricing.motosikletFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, motosikletFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Karavan Fiyat"
                            value={newPricing.karavanFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, karavanFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Cabrio Fiyat"
                            value={newPricing.cabrioFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, cabrioFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Coupe Fiyat"
                            value={newPricing.coupeFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, coupeFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Otobüs Fiyat"
                            value={newPricing.otobusFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, otobusFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Tır/Kamyon Fiyat"
                            value={newPricing.tirKamyonFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, tirKamyonFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="MPV Fiyat"
                            value={newPricing.mpvFiyat}
                            onChange={(e) => setNewPricing({ ...newPricing, mpvFiyat: e.target.value })}
                            style={inputStyle}
                        />
                        <button onClick={handleAddPricing} style={buttonStyle}>
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
                <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        rowSelection={rowSelection}
                        gridOptions={gridOptions}
                        localeText={localeText}
                    />
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
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "400px",
    gap: "10px",
};

const inputStyle = {
    marginBottom: "10px",
    padding: "8px",
    width: "40%",
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


export default Pricing;