"""saklambac.py için testler.

Çalıştırmak için (depo klasöründeyken):  python3 -m unittest -v
"""

import io
import unittest
from contextlib import redirect_stdout
from unittest.mock import patch

import saklambac

# Testlerde kullanılan sabit saklanma yerleri (rastgelelik olmasın diye)
SABIT_SAKLANANLAR = {
    ("salon", "kanepe arkası"): "Ayşe",
    ("mutfak", "masa altı"): "Mehmet",
    ("bahçe", "çalılık"): "Zeynep",
}

# Kimsenin saklanmadığı, birbirinden farklı 8 yer (oda, yer sırasıyla)
BOS_YERLER = [
    ("salon", "perde arkası"),
    ("salon", "kitaplık arkası"),
    ("mutfak", "dolap içi"),
    ("mutfak", "buzdolabı arkası"),
    ("yatak odası", "yatak altı"),
    ("yatak odası", "gardırop"),
    ("yatak odası", "perde arkası"),
    ("bahçe", "ağaç arkası"),
]


def girdiler(*yerler):
    """(oda, yer) çiftlerini input() için düz bir girdi listesine çevirir."""
    sonuc = []
    for oda, yer in yerler:
        sonuc.extend([oda, yer])
    return sonuc


def oyunu_calistir(girdi_listesi):
    """oyna() fonksiyonunu sabit saklanma yerleri ve verilen girdilerle çalıştırır.

    Çıktıyı metin olarak döndürür.
    """
    cikti = io.StringIO()
    with patch("saklambac.saklan", return_value=dict(SABIT_SAKLANANLAR)), \
            patch("saklambac.time.sleep"), \
            patch("builtins.input", side_effect=girdi_listesi), \
            redirect_stdout(cikti):
        saklambac.oyna()
    return cikti.getvalue()


class TumYerlerTesti(unittest.TestCase):
    def test_yer_sayisi_dogru(self):
        beklenen = sum(len(yerler) for yerler in saklambac.YERLER.values())
        self.assertEqual(len(saklambac.tum_yerler()), beklenen)

    def test_ciftler_gecerli(self):
        for oda, yer in saklambac.tum_yerler():
            self.assertIn(oda, saklambac.YERLER)
            self.assertIn(yer, saklambac.YERLER[oda])

    def test_oyun_icin_yeterli_yer_var(self):
        self.assertGreaterEqual(len(saklambac.tum_yerler()), saklambac.ARKADAS_SAYISI)


class SaklanTesti(unittest.TestCase):
    def test_istenen_sayida_arkadas_saklanir(self):
        self.assertEqual(len(saklambac.saklan(3)), 3)

    def test_yerler_birbirinden_farkli_ve_gecerli(self):
        for _ in range(50):
            saklananlar = saklambac.saklan(saklambac.ARKADAS_SAYISI)
            yerler = list(saklananlar)
            self.assertEqual(len(set(yerler)), len(yerler))
            for yer in yerler:
                self.assertIn(yer, saklambac.tum_yerler())

    def test_isimler_birbirinden_farkli(self):
        for _ in range(50):
            isimler = list(saklambac.saklan(saklambac.ARKADAS_SAYISI).values())
            self.assertEqual(len(set(isimler)), len(isimler))
            for isim in isimler:
                self.assertIn(isim, saklambac.ARKADAS_ISIMLERI)

    def test_butun_yerler_doldurulabilir(self):
        toplam = len(saklambac.tum_yerler())
        # Yeterli isim olduğu sürece tüm yerler kullanılabilmeli
        sayi = min(toplam, len(saklambac.ARKADAS_ISIMLERI))
        self.assertEqual(len(saklambac.saklan(sayi)), sayi)


class GirdiAlTesti(unittest.TestCase):
    def test_bosluk_silinir_ve_kucuk_harfe_cevrilir(self):
        with patch("builtins.input", return_value="  SALON  "):
            self.assertEqual(saklambac.girdi_al(""), "salon")

    def test_girdi_bitince_cikilir(self):
        with patch("builtins.input", side_effect=EOFError), \
                redirect_stdout(io.StringIO()):
            with self.assertRaises(SystemExit):
                saklambac.girdi_al("")

    def test_ctrl_c_ile_cikilir(self):
        with patch("builtins.input", side_effect=KeyboardInterrupt), \
                redirect_stdout(io.StringIO()):
            with self.assertRaises(SystemExit):
                saklambac.girdi_al("")


class YerSecTesti(unittest.TestCase):
    def sec(self, girdi_listesi):
        with patch("builtins.input", side_effect=girdi_listesi), \
                redirect_stdout(io.StringIO()):
            return saklambac.yer_sec()

    def test_gecerli_secim(self):
        self.assertEqual(self.sec(["mutfak", "masa altı"]), ("mutfak", "masa altı"))

    def test_buyuk_harf_kabul_edilir(self):
        self.assertEqual(self.sec(["MUTFAK", "Masa Altı"]), ("mutfak", "masa altı"))

    def test_gecersiz_oda_tekrar_sorulur(self):
        self.assertEqual(
            self.sec(["uzay", "salon", "kanepe arkası"]), ("salon", "kanepe arkası")
        )

    def test_gecersiz_yer_tekrar_sorulur(self):
        self.assertEqual(
            self.sec(["salon", "dolap içi", "salon", "perde arkası"]),
            ("salon", "perde arkası"),
        )

    def test_ipucu_istenirse_none_doner(self):
        self.assertIsNone(self.sec(["ipucu"]))

    def test_cik_komutu_oyundan_cikar(self):
        for komut in ("çık", "cik", "q"):
            with self.subTest(komut=komut):
                with self.assertRaises(SystemExit):
                    self.sec([komut])


class IpucuVerTesti(unittest.TestCase):
    def test_bulunmamis_birinin_odasi_soylenir(self):
        bulunanlar = {("salon", "kanepe arkası"), ("mutfak", "masa altı")}
        cikti = io.StringIO()
        with redirect_stdout(cikti):
            saklambac.ipucu_ver(SABIT_SAKLANANLAR, bulunanlar)
        # Geriye sadece bahçedeki Zeynep kaldı
        self.assertIn("bahçe", cikti.getvalue())

    def test_bulunmus_birinin_odasi_soylenmez(self):
        bulunanlar = {("salon", "kanepe arkası")}
        for _ in range(30):
            cikti = io.StringIO()
            with redirect_stdout(cikti):
                saklambac.ipucu_ver(SABIT_SAKLANANLAR, bulunanlar)
            self.assertNotIn("salon", cikti.getvalue())


class OyunAkisiTesti(unittest.TestCase):
    def test_herkes_bulunursa_kazanilir(self):
        cikti = oyunu_calistir(girdiler(*SABIT_SAKLANANLAR))
        self.assertIn("Tebrikler", cikti)
        for isim in SABIT_SAKLANANLAR.values():
            self.assertIn(isim, cikti)

    def test_haklar_biterse_kaybedilir(self):
        cikti = oyunu_calistir(girdiler(*BOS_YERLER))
        self.assertIn("Hakların bitti", cikti)
        self.assertNotIn("Tebrikler", cikti)

    def test_kaybedince_saklananlar_gosterilir(self):
        cikti = oyunu_calistir(girdiler(*BOS_YERLER))
        for isim in SABIT_SAKLANANLAR.values():
            self.assertIn(isim, cikti)
        self.assertIn("bulunamadı", cikti)

    def test_kismen_bulunca_sayi_dogru_yazilir(self):
        # Biri bulunur, 7 boş yer denenir (8 hak biter)
        giris = girdiler(("salon", "kanepe arkası"), *BOS_YERLER[:7])
        cikti = oyunu_calistir(giris)
        self.assertIn("2 arkadaşını bulamadın", cikti)
        self.assertIn("(bulundu)", cikti)

    def test_ayni_yere_tekrar_bakmak_hak_harcamaz(self):
        # 8 farklı boş yer + araya 3 tekrar: tekrarlar hak yemediği için
        # oyun yine de tam 8 farklı denemeyle biter.
        giris = girdiler(
            BOS_YERLER[0], BOS_YERLER[0], BOS_YERLER[0], BOS_YERLER[0], *BOS_YERLER[1:]
        )
        cikti = oyunu_calistir(giris)
        self.assertEqual(cikti.count("Orayı zaten kontrol ettin"), 3)
        self.assertIn("Hakların bitti", cikti)

    def test_ipucu_hakki_biter(self):
        # 3 kez ipucu iste (hak 2), sonra herkesi bul
        giris = ["ipucu", "ipucu", "ipucu"] + girdiler(*SABIT_SAKLANANLAR)
        cikti = oyunu_calistir(giris)
        # "İpucu: Biri ..." gerçek ipucu cümlesi; durum satırındaki "İpucu: N" sayılmaz
        self.assertEqual(cikti.count("İpucu: Biri"), saklambac.IPUCU_HAKKI)
        self.assertIn("İpucu hakkın kalmadı", cikti)
        self.assertIn("Tebrikler", cikti)

    def test_ipucu_hak_harcamaz(self):
        # İpucu istemek deneme hakkını düşürmemeli: 8 boş yer + 2 ipucu
        giris = ["ipucu", "ipucu"] + girdiler(*BOS_YERLER)
        cikti = oyunu_calistir(giris)
        self.assertIn("Hakların bitti", cikti)
        self.assertEqual(cikti.count("kimse yok"), saklambac.HAK)

    def test_yanlis_yer_kimse_yok_yazar(self):
        cikti = oyunu_calistir(girdiler(*BOS_YERLER))
        self.assertIn("kimse yok", cikti)


class AnaDongusuTesti(unittest.TestCase):
    def test_hayir_deyince_oyun_biter(self):
        cikti = io.StringIO()
        # Tek tur kaybet, sonra "h" ile çık
        giris = girdiler(*BOS_YERLER) + ["h"]
        with patch("saklambac.saklan", return_value=dict(SABIT_SAKLANANLAR)), \
                patch("saklambac.time.sleep"), \
                patch("builtins.input", side_effect=giris), \
                redirect_stdout(cikti):
            saklambac.main()
        self.assertIn("Oynadığın için teşekkürler", cikti.getvalue())

    def test_evet_deyince_yeni_oyun_baslar(self):
        cikti = io.StringIO()
        giris = girdiler(*BOS_YERLER) + ["e"] + girdiler(*BOS_YERLER) + ["h"]
        with patch("saklambac.saklan", return_value=dict(SABIT_SAKLANANLAR)), \
                patch("saklambac.time.sleep"), \
                patch("builtins.input", side_effect=giris), \
                redirect_stdout(cikti):
            saklambac.main()
        self.assertEqual(cikti.getvalue().count("=== SAKLAMBAÇ ==="), 2)


if __name__ == "__main__":
    unittest.main()
