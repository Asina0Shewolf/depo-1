# depo-1

## Saklambaç (Python)

Terminalde oynanan basit bir saklambaç oyunu. Sen ebesin: bilgisayar arkadaşlarını evdeki yerlere rastgele saklar, sen de hakların bitmeden hepsini bulmaya çalışırsın.

### Çalıştırma

Python 3 yeterli, ek paket gerekmez.

```
python3 saklambac.py
```

### Nasıl oynanır

- Oyun başında 3 arkadaşın saklanır, 8 hakkın ve 2 ipucu hakkın vardır.
- Önce bir oda, sonra o odadaki bir saklanma yeri yaz (ör. `mutfak`, sonra `masa altı`).
- `ipucu` yazarsan saklanan birinin hangi odada olduğunu söyler.
- Aynı yere tekrar bakmak hak harcamaz.
- `çık` yazarak oyundan çıkabilirsin.

### Testler

`test_saklambac.py` dosyasında oyunun fonksiyonlarını ve tüm oyun akışını (kazanma, kaybetme, ipucu, tekrar oynama) deneyen testler var. Ek paket gerekmez, Python'un kendi `unittest` modülü kullanılır.

```
python3 -m unittest -v
```

### Ayarlar

`saklambac.py` dosyasının başındaki `ARKADAS_SAYISI`, `HAK`, `IPUCU_HAKKI` ve `SAYMA_SURESI` değerlerini değiştirerek oyunu kolaylaştırıp zorlaştırabilirsin. `YERLER` sözlüğüne yeni oda ve saklanma yeri de ekleyebilirsin.

## Çiçek Rehberi (mobil uygulama)

`cicek-rehberi/` klasöründe, telefonda uygulama gibi çalışan bir web uygulaması (PWA) var. 15 çiçeğin anlamını, belirgin özelliklerini (görünüş, koku, boy), mevsimini ve bakım ipucunu gösterir.

- Çiçek adına, anlama ya da özelliğe göre arama (Türkçe karakter yazmasan da bulur: `ask` yazınca `aşk` sonuçları gelir)
- Favorilere ekleme (telefonda saklanır)
- Günün çiçeği
- Açık/koyu tema (telefonun ayarına uyar)
- İnternetsiz çalışma (yalnızca HTTPS ya da `localhost` üzerinde; düz `http://192.168...` adresinde çalışmaz)

### Çalıştırma

```
cd cicek-rehberi
python3 -m http.server 8000
```

Sonra tarayıcıda `http://localhost:8000` adresini aç. Telefonda denemek için bilgisayarın IP adresini kullanabilirsin. Uygulamayı GitHub Pages ile yayınlarsan telefonda tarayıcı menüsünden "Ana ekrana ekle" diyerek yükleyebilirsin.

Tarayıcı testi için (Node.js ve Playwright gerekir):

```
cd cicek-rehberi
python3 -m http.server 8000   # bir terminalde
node test_ui.js http://localhost:8000/index.html   # başka terminalde
```

Uygulamanın bilinen eksikleri ve düzeltilenler `cicek-rehberi/EKSIKLER-VE-CELISKILER.md` dosyasında.

Not: Anlamlar genel kabul gören kültürel yorumlardır, kaynağa ve kültüre göre değişebilir. Yeni çiçek eklemek için `cicek-rehberi/app.js` içindeki `CICEKLER` listesine bir satır eklemen yeterli.
