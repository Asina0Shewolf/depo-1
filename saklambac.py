#!/usr/bin/env python3
"""Saklambaç: terminalde oynanan basit bir oyun.

Sen ebesin. Bilgisayar arkadaşlarını evdeki yerlere rastgele saklar.
Hakların bitmeden hepsini bulmaya çalış.

Çalıştırmak için:  python3 saklambac.py
"""

import random
import time

YERLER = {
    "salon": ["kanepe arkası", "perde arkası", "kitaplık arkası"],
    "mutfak": ["dolap içi", "masa altı", "buzdolabı arkası"],
    "yatak odası": ["yatak altı", "gardırop", "perde arkası"],
    "bahçe": ["ağaç arkası", "çalılık", "kulübe"],
    "banyo": ["duş kabini", "çamaşır sepeti"],
}

ARKADAS_ISIMLERI = ["Ayşe", "Mehmet", "Zeynep", "Can", "Elif", "Deniz", "Ali", "Selin"]

ARKADAS_SAYISI = 3
HAK = 8
IPUCU_HAKKI = 2
SAYMA_SURESI = 0.4  # saniye (0 yaparsan beklemeden sayar)


def tum_yerler():
    """(oda, saklanma yeri) çiftlerinin listesini döndürür."""
    return [(oda, yer) for oda, yerler in YERLER.items() for yer in yerler]


def saklan(sayi):
    """Arkadaşları birbirinden farklı yerlere rastgele saklar."""
    yerler = random.sample(tum_yerler(), sayi)
    isimler = random.sample(ARKADAS_ISIMLERI, sayi)
    return dict(zip(yerler, isimler))


def say():
    print("\nEbe gözlerini kapattı ve sayıyor...")
    for i in range(1, 11):
        print(f"  {i}...", flush=True)
        time.sleep(SAYMA_SURESI)
    print("Önüm arkam sağım solum sobe! Saklanmayan ebe!\n")


def odalari_goster():
    print("Evdeki odalar ve saklanma yerleri:")
    for oda, yerler in YERLER.items():
        print(f"  - {oda}: {', '.join(yerler)}")
    print()


def girdi_al(mesaj):
    """Kullanıcıdan girdi alır. Girdi akışı biterse oyundan çıkar."""
    try:
        return input(mesaj).strip().lower()
    except (EOFError, KeyboardInterrupt):
        print("\nOyun yarıda kaldı. Görüşürüz!")
        raise SystemExit(0)


def yer_sec():
    """Kullanıcıdan geçerli bir (oda, yer) seçimi alır. 'ipucu' için None döner."""
    while True:
        oda = girdi_al("Hangi odaya bakacaksın? (ipucu için 'ipucu', çıkmak için 'çık'): ")
        if oda in ("çık", "cik", "q"):
            print("Oyundan çıkıldı.")
            raise SystemExit(0)
        if oda == "ipucu":
            return None
        if oda not in YERLER:
            print("  Böyle bir oda yok. Odalar:", ", ".join(YERLER))
            continue
        yer = girdi_al(f"{oda} içinde nereye bakacaksın? ({', '.join(YERLER[oda])}): ")
        if yer not in YERLER[oda]:
            print("  Orada böyle bir yer yok, tekrar dene.")
            continue
        return oda, yer


def ipucu_ver(saklananlar, bulunanlar):
    """Henüz bulunmamış bir arkadaşın hangi odada olduğunu söyler."""
    kalan = [yer for yer in saklananlar if yer not in bulunanlar]
    oda, _ = random.choice(kalan)
    print(f"  İpucu: Biri {oda} odasında bir yerde saklanıyor!")


def oyna():
    print("=== SAKLAMBAÇ ===")
    print(f"{ARKADAS_SAYISI} arkadaşın saklanacak. {HAK} hakkın var, {IPUCU_HAKKI} ipucu hakkın var.")
    saklananlar = saklan(ARKADAS_SAYISI)
    say()
    odalari_goster()

    bulunanlar = set()
    hak = HAK
    ipucu = IPUCU_HAKKI
    denenenler = set()

    while hak > 0 and len(bulunanlar) < ARKADAS_SAYISI:
        print(f"[Kalan hak: {hak} | Bulunan: {len(bulunanlar)}/{ARKADAS_SAYISI} | İpucu: {ipucu}]")
        secim = yer_sec()

        if secim is None:
            if ipucu == 0:
                print("  İpucu hakkın kalmadı.")
            else:
                ipucu -= 1
                ipucu_ver(saklananlar, bulunanlar)
            continue

        if secim in denenenler:
            print("  Orayı zaten kontrol ettin! (hak harcanmadı)")
            continue

        denenenler.add(secim)
        hak -= 1
        oda, yer = secim

        if secim in saklananlar:
            bulunanlar.add(secim)
            print(f"  Buldum! {saklananlar[secim]} {oda} odasında {yer} saklanıyormuş!")
        else:
            print(f"  {oda} / {yer}: kimse yok.")

    print()
    if len(bulunanlar) == ARKADAS_SAYISI:
        print("Tebrikler, herkesi buldun! 🎉")
    else:
        print(f"Hakların bitti. {ARKADAS_SAYISI - len(bulunanlar)} arkadaşını bulamadın.")
        print("Saklandıkları yerler:")
        for (oda, yer), isim in saklananlar.items():
            durum = "bulundu" if (oda, yer) in bulunanlar else "bulunamadı"
            print(f"  - {isim}: {oda} / {yer} ({durum})")


def main():
    while True:
        oyna()
        cevap = girdi_al("\nTekrar oynamak ister misin? (e/h): ")
        if cevap not in ("e", "evet"):
            print("Oynadığın için teşekkürler!")
            break


if __name__ == "__main__":
    main()
