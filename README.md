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

### Ayarlar

`saklambac.py` dosyasının başındaki `ARKADAS_SAYISI`, `HAK`, `IPUCU_HAKKI` ve `SAYMA_SURESI` değerlerini değiştirerek oyunu kolaylaştırıp zorlaştırabilirsin. `YERLER` sözlüğüne yeni oda ve saklanma yeri de ekleyebilirsin.
