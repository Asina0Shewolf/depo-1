# Çiçek Rehberi: eksikler ve çelişkiler

İlk sürümün (commit `4b9bc4f`) incelemesinde bulunanlar. Düzeltilenler ve açık kalanlar ayrı listelenmiştir.

## Düzeltilenler

### Çelişkiler (içerik ve metin)

| # | Bulgu | Düzeltme |
|---|-------|----------|
| 1 | Lavantada sümbül emojisi (🪻), sümbülde buket (💐) kullanılmıştı: emojiler çiçekle uyuşmuyordu. | Sümbül 🪻, lavanta 🌿 yapıldı. |
| 2 | Üç emoji iki çiçekte tekrar ediyordu (🌼 papatya/nergis, 🌺 karanfil/gelincik, 🤍 zambak/yasemin). Mimoza için filiz (🌱), ortanca için elmas (💠) seçilmişti. | Tüm emojiler benzersiz yapıldı, mimoza 🟡, ortanca 💮, yasemin ⭐, nergis 🏵️, karanfil 🌸. |
| 3 | Ayçiçeği: "başını güneşe çevirir" ifadesi eksikti. Yalnızca genç ayçiçekleri güneşi izler, olgunlaşınca doğuya bakarak sabitlenir. | Anlam metni düzeltildi. |
| 4 | Gül bakımı: "çiçeklendikten sonra budanmalı" yanıltıcıydı. Asıl budama kış sonunda yapılır, solan çiçekler ise ayrıca kesilir. | Bakım metni düzeltildi. |
| 5 | Ortanca: yalnızca "minnettarlık" yazıyordu, ama Victoria dönemi İngiltere'sinde gösteriş ve kayıtsızlık anlamı taşırdı. | Kültürel farklılık eklendi. |
| 6 | Papatya: Latince adı yalnızca `Bellis perennis` idi. Türkiye'de papatya denince çoğunlukla `Matricaria chamomilla` (tıbbi papatya) da kastedilir. | İki tür de yazıldı. |
| 7 | "Günün çiçeği" gün sayısını UTC'ye göre hesaplıyordu, yani Türkiye'de gece yarısı yerine 03:00'te değişiyordu. | Yerel takvim gününe göre hesaplanıyor. |

### Eksikler (kod ve uygulama)

| # | Bulgu | Düzeltme |
|---|-------|----------|
| 8 | Detay penceresi açıkken telefonun geri tuşu sayfadan çıkarıyordu. | Geri tuşu pencereyi kapatıyor (`popstate`). |
| 9 | Pencere açıkken arkadaki liste kayıyordu. | Arka plan kaydırması kilitleniyor. |
| 10 | Pencere kapanınca odak başa dönüyordu (klavye ve ekran okuyucu kullanıcıları için). | Odak, pencereyi açan öğeye dönüyor. |
| 11 | Yalnızca SVG ikon vardı. Android kurulum ekranı ve iOS ana ekran ikonu PNG ister. | 180, 192 ve 512 px PNG ikonlar eklendi. 180 px ikon iOS için opak üretildi. |
| 12 | Service worker "önce önbellek" çalışıyordu: dosyalar güncellense bile telefonda eski sürüm görünebilirdi. | "Önce ağ, olmazsa önbellek" yapıldı, sürüm `v3`. |
| 13 | Uygulamanın tarayıcı testi yalnızca bu oturumda vardı, depoda yoktu. | `test_ui.js` eklendi (README'de nasıl çalıştığı yazıyor). |
| 14 | README "internetsiz çalışır" diyordu ama bunun yalnızca HTTPS (ya da `localhost`) üzerinde geçerli olduğunu belirtmiyordu. | README'ye not eklendi. |

## Açık kalanlar (yapılmadı)

- **Gerçek fotoğraf yok.** Emojiler çiçeği tam yansıtmıyor (ör. orkide için nilüfer 🪷 en yakın emoji). Gerçek görseller için telif hakkı sorunu olmayan fotoğraflar gerekir.
- **Anlamlar tek kaynağa dayanmıyor.** Çiçek anlamları kültüre ve döneme göre değişir. Metinler genel kabul gören yorumları özetler, tek bir kaynaktan alınmamıştır.
- **Gerçek telefonda denenmedi.** Testler Chromium'un telefon ekranı taklidiyle yapıldı. iOS Safari ve gerçek Android cihazlarda ayrıca denenmeli.
- **Fotoğraftan otomatik tanıma yok.** Fotoğraf ekranı yalnızca fotoğrafı gösterir, çiçeği kullanıcı özelliklere bakarak seçer. Otomatik tanıma için ya telefonda çalışan bir model (yaklaşık 90 MB indirme, yalnızca bu 15 çiçek arasından seçer) ya da PlantNet gibi bir servis (API anahtarı ve küçük bir sunucu gerekir) eklenebilir. Çalışma ortamımdan model sunucularına erişemediğim için doğruluğu burada denenemezdi.
- **Yalnızca 15 çiçek var** ve liste uygulamanın içinde sabit (`app.js`). Çiçek eklemek için kodu düzenlemek gerekiyor.
- **Dil yalnızca Türkçe.**
- **Maskable ikon yok.** Android bazı cihazlarda ikonu yuvarlak keserken kenar boşluğu bırakmaz.
