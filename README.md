# 🚗 Markamodel - Türkiye Araç Marka & Model Portalı ve Kod Jeneratörü

Türkiye'deki tüm güncel araç marka ve modellerini listeleyen, geliştiricilerin bu verileri kendi web sitelerine veya uygulamalarına saniyeler içinde entegre edebilmeleri için çeşitli formatlarda kod üreten modern, hafif ve şık bir geliştirici aracıdır.

---

## 🌟 Özellikler

- 📦 **Güncel Veritabanı:** 35 popüler otomobil/araç markası ve bunlara bağlı 283 alt model verisi.
- 🛠️ **Çoklu Kod Jeneratörü:** Geliştiriciler için farklı formatlarda anında dışa aktarma (Export) desteği:
  - **HTML Select:** Marka seçildiğinde modelleri dinamik olarak dolduran, kullanıma hazır Vanilla JS ve CSS destekli açılır kutu kodu.
  - **JSON:** API'ler veya veri saklama için saf JSON yapısı.
  - **JS Object:** JavaScript projelerinizde doğrudan kullanabileceğiniz veri nesnesi.
  - **PHP Array:** PHP tabanlı projeler için hazır ilişkisel dizi şablonu.
  - **SQL (MySQL):** `car_brands` ve `car_models` tablolarını otomatik oluşturup verileri ilişkisel olarak aktaran sorgu seti.
- 🔍 **Gelişmiş Arama:** Marka veya model ismine göre anlık, harf duyarlı canlı filtreleme.
- 🌗 **Karanlık/Aydınlık Mod:** Modern ve göz yormayan, kullanıcının tercihini tarayıcı belleğinde saklayan tema desteği.
- 💻 **Canlı Önizleme:** Üretilen kodların çıktısını site terk etmeden canlı olarak test etme imkanı.
- 🎨 **Premium Tasarım:** Glassmorphism detayları, modern tipografi (Outfit Font), yumuşak degrade (gradient) geçişleri ve pürüzsüz mikro-animasyonlar.

---

## 🚀 Hızlı Başlangıç (Kurulum)

Projeyi yerel bilgisayarınızda çalıştırmak oldukça basittir. Herhangi bir veritabanı veya sunucu bağımlılığı (PHP/Node.js) olmadan doğrudan tarayıcı üzerinden çalışabilir.

### 1. Depoyu Klonlayın veya İndirin

```bash
git clone https://github.com/memett4545/markamodel.git
```

### 2. Projeyi Çalıştırın

* İndirdiğiniz klasörün içerisindeki `index.html` dosyasına çift tıklayarak tarayıcınızda doğrudan açabilirsiniz.
* Veya XAMPP kullanıyorsanız klasörü `htdocs` dizinine taşıyıp tarayıcınızdan `http://localhost/markamodel` adresine gidebilirsiniz.

---

## 📂 Dosya Yapısı

```text
markamodel/
│
├── index.html     # Ana arayüz ve sayfa yapısı (HTML5)
├── style.css      # Premium tasarım, karanlık mod ve responsive CSS kuralları
├── app.js         # Filtreleme, jeneratör şablonları ve tema kontrolleri
├── data.js        # Marka ve model verilerinin bulunduğu veri katmanı
└── README.md      # Proje açıklama ve dokümantasyon dosyası
```

---

## 🛠️ Kod Jeneratörü Kullanım Detayları

### 1. HTML Select (Çift Açılır Kutu)
Bu modda üretilen kod, web sitenize doğrudan ekleyebileceğiniz bir marka-model seçici üretir. İçerisindeki JavaScript kodu sayesinde marka seçildiğinde modeller dinamik olarak yüklenir ve model seçimi aktifleştirilir.

### 2. SQL Çıktısı
Veritabanı entegrasyonu yapmak isteyenler için mükemmeldir. `SQL` sekmesinde üretilen kodlar:
1. `car_brands` tablosunu oluşturur.
2. `car_models` tablosunu marka tablosuna yabancı anahtar (FOREIGN KEY) ile bağlayarak oluşturur.
3. Tüm marka ve model verilerini tek seferde veritabanına ekler.

### 3. PHP Dizi Çıktısı
Laravel, CodeIgniter veya saf PHP projelerinde dizilerle çalışmak isteyenler için verileri şu formatta hazırlar:
```php
$car_brands = [
    "alfa-romeo" => [
        "brandName" => "Alfa Romeo",
        "models" => [
            ["name" => "Giulietta", "slug" => "alfa-romeo-giulietta", "bodyType" => "Hatchback"],
            ...
        ]
    ]
];
```

---

## 🤝 Katkıda Bulunma

Projeyi daha da geliştirmek adına katkılarınızı bekliyoruz!
1. Bu depoyu çatallayın (Fork).
2. Yeni bir özellik dalı (Branch) oluşturun (`git checkout -b ozellik/yeniOzellik`).
3. Değişikliklerinizi kaydedin (`git commit -m 'Yeni bir özellik eklendi'`).
4. Dalınızı gönderin (`git push origin ozellik/yeniOzellik`).
5. Bir Çekme İsteği (Pull Request) oluşturun.

---

## 📝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için lisans dosyasına göz atabilirsiniz.

---

> 💡 **Not:** Bu projede kullanılan araç marka ve model verileri [OtoSOR](https://www.otosor.com.tr/markalar) üzerinden derlenmiştir.
