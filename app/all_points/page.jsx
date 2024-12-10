"use client"

import { useEffect, useState } from "react";
import styles from "../ui/all_points/allPoints.module.css"
import Navbar from "../ui/dashboard/navbar/navbar"
import iconD from "../../public/icons8-location-color-32.png"
import axios from "axios";
import { usePathname } from "next/navigation";

const AllPointsPage = () => {

  const pathname = usePathname()

  console.log(pathname)

  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState([]);

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

  const fetchParkData = async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);

      const response = await axios.get(
        `https://app.toger.co/api/v2/park/get-associated-parks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log(response.data)


      // Gelen veriyi tabloya uygun şekilde düzenle
      const mappedData = response.data.data.map((point) => ({
        id: point.id,
        name: point.name,
        coordinate: {
          lat: parseFloat(point.coordinate.lat),
          lng: parseFloat(point.coordinate.lon),
        },
      }));

      setRowData(mappedData); // Tabloya veriyi aktar
      console.log(rowData)

    } catch (err) {
      console.error("Park verilerine erişim hatası:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCenter = () => {
    if (rowData.length === 0) return { lat: 0, lng: 0 };

    const total = rowData.reduce(
      (acc, point) => ({
        lat: acc.lat + point.coordinate.lat,
        lng: acc.lng + point.coordinate.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: total.lat / rowData.length,
      lng: total.lng / rowData.length,
    };
  };


  console.log(rowData)

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

  useEffect(() => {
    const loadGoogleMaps = () => {
      const mapCenter = calculateCenter(); // Koordinatların ortalamasını hesapla

      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: mapCenter, // Konum ayarları
        zoom: 10,
        disableDefaultUI: true, // Tüm varsayılan UI kontrollerini kapatır
        zoomControl: false, // Zoom kontrolü kapatılır
        fullscreenControl: false, // Tam ekran kontrolü kapatılır
        mapTypeControl: false, // Harita/Sat görüntü seçeneğini kapatır
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1b1b1b"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
        ],
      });

      // Marker ekleme
      rowData.forEach((point) => {
        new window.google.maps.Marker({
          position: point.coordinate,
          map: map,
          title: point.name,
          icon: {
            url: "/icons8-location-color-32.png",
            scaledSize: new window.google.maps.Size(32, 32), // İkon boyutlandırma
          },
        });
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDaM_bFWWp9ADnJl3OSu5Up-Tjpvgk_XoE`;
      script.async = true;
      script.onload = loadGoogleMaps;
      document.body.appendChild(script);
    } else {
      loadGoogleMaps();
    }
  }, [rowData]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.mainCont}>
        <div className={styles.mapCont}>
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </div>
        <div className={styles.allPointsCont}>
          <h1 className={styles.header}>Tüm Noktalar</h1>
          {rowData.map(item => (
            <div key={item.id}>
              <div className={styles.points}>
                <img className={styles.icon} src={iconD.src} alt="" />
                <span className={styles.pointHeader}>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllPointsPage