import React, { useState } from "react";

const Login: React.FC = () => {
    // 1. Durumları Tanımlama (State Management)
    const [kullaniciAdi, setKullaniciAdi] = useState("");
    const [sifre, setSifre] = useState("");
    const [hataMesaji, setHataMesaji] = useState("");

    // 2. Form Gönderme Fonksiyonu (Backend İletişimi)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setHataMesaji("");

        try {
            // ARKA YÜZE POST İSTEĞİ (POST /giris)
            const response = await fetch("/giris", {
                method: "POST",
                headers: {
                    // Express'in JSON beklediğini söylüyoruz
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kullanici_adi: kullaniciAdi,
                    sifre: sifre,
                }),
            });

            // Yanıtı JSON olarak al
            const data = await response.json();

            if (response.ok) {
                // Başarılı giriş: Kullanıcıyı /profil sayfasına yönlendir
                console.log("Giriş başarılı, yönlendiriliyor...");
                window.location.href = "/profil";
            } else {
                // Giriş hatası: Hata mesajını göster
                setHataMesaji(
                    data.mesaj ||
                        "Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.",
                );
            }
        } catch (error) {
            console.error("Giriş sırasında bir hata oluştu:", error);
            setHataMesaji(
                "Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı kontrol edin.",
            );
        }
    };

    return (
        <div className="login-container">
            <h1>Giriş Yap</h1>
            {/* Hata Mesajı Görüntüleme */}
            {hataMesaji && (
                <p
                    style={{
                        color: "red",
                        border: "1px solid red",
                        padding: "10px",
                    }}
                >
                    {hataMesaji}
                </p>
            )}

            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="username">Kullanıcı Adı:</label>
                <input
                    type="text"
                    id="username"
                    value={kullaniciAdi}
                    onChange={(e) => setKullaniciAdi(e.target.value)}
                    required
                />

                <label htmlFor="password">Şifre:</label>
                <input
                    type="password"
                    id="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    required
                />

                <button type="submit">Giriş Yap</button>
            </form>
            <p>
                Hesabınız yok mu? <a href="/kayit">Hemen Kaydolun!</a>
            </p>
        </div>
    );
};

export default Login;
