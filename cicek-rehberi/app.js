"use strict";

// Çiçek verisi: genel kabul gören (kültürel) anlamlar. Anlamlar kültüre göre değişebilir.
const CICEKLER = [
  { id: "gul", ad: "Gül", latince: "Rosa", emoji: "🌹", kisa: "Aşk ve tutku",
    anlam: "Kırmızı gül aşk ve tutkuyu, beyaz gül saflığı ve yeni başlangıcı, sarı gül dostluğu, pembe gül ise minnettarlığı ve zarafeti anlatır.",
    mevsim: "İlkbahar - Sonbahar", bakim: "Güneşi sever, düzenli sulanmalı ve çiçeklendikten sonra budanmalıdır." },
  { id: "lale", ad: "Lale", latince: "Tulipa", emoji: "🌷", kisa: "Mükemmel aşk",
    anlam: "Mükemmel ve derin aşkı simgeler. Türk kültüründe ayrıca çok özel bir yeri vardır; Osmanlı'da Lale Devri adıyla anılan bir dönem bile yaşanmıştır.",
    mevsim: "İlkbahar", bakim: "Soğuk kış geçirmesi gerekir. Soğan olarak sonbaharda dikilir." },
  { id: "papatya", ad: "Papatya", latince: "Bellis perennis", emoji: "🌼", kisa: "Masumiyet ve saflık",
    anlam: "Masumiyeti, saflığı ve içtenliği temsil eder. \"Seviyor, sevmiyor\" falıyla da bilinir.",
    mevsim: "İlkbahar - Yaz", bakim: "Çok bakım istemez, güneşli yeri sever." },
  { id: "aycicegi", ad: "Ayçiçeği", latince: "Helianthus annuus", emoji: "🌻", kisa: "Bağlılık ve neşe",
    anlam: "Başını güneşe çevirmesi nedeniyle bağlılığı, sadakati ve pozitif enerjiyi simgeler.",
    mevsim: "Yaz", bakim: "Tam güneş ve bol su ister, uzun boylu olduğu için desteğe ihtiyaç duyabilir." },
  { id: "lavanta", ad: "Lavanta", latince: "Lavandula", emoji: "🪻", kisa: "Sakinlik ve dürüstlük",
    anlam: "Huzuru, sakinliği ve sadakati anlatır. Kokusu rahatlatıcı olduğu için uykuyla da ilişkilendirilir.",
    mevsim: "Yaz", bakim: "Kurak ve güneşli yeri sever, az su yeterlidir." },
  { id: "menekse", ad: "Menekşe", latince: "Viola", emoji: "💜", kisa: "Tevazu ve sadakat",
    anlam: "Alçakgönüllülüğü, tevazuyu ve sadık sevgiyi simgeler. Yere yakın, mütevazı duruşuyla bilinir.",
    mevsim: "Erken ilkbahar", bakim: "Yarı gölgeyi ve nemli toprağı sever." },
  { id: "karanfil", ad: "Karanfil", latince: "Dianthus caryophyllus", emoji: "🌺", kisa: "Hayranlık ve sevgi",
    anlam: "Kırmızı karanfil derin sevgiyi ve hayranlığı, beyaz karanfil saf sevgiyi, pembe karanfil ise anne sevgisini anlatır.",
    mevsim: "İlkbahar - Yaz", bakim: "Güneşi ve iyi süzülen toprağı sever, fazla sulanmamalı." },
  { id: "orkide", ad: "Orkide", latince: "Orchidaceae", emoji: "🪷", kisa: "Zarafet ve güzellik",
    anlam: "Zarafeti, lüksü, güzelliği ve inceliği simgeler. Hediye olarak çok tercih edilir.",
    mevsim: "Tüm yıl (iç mekân)", bakim: "Dolaylı ışık ister, haftada bir az su yeterlidir. Kökleri çürümesin diye suda bırakılmamalı." },
  { id: "sumbul", ad: "Sümbül", latince: "Hyacinthus orientalis", emoji: "💐", kisa: "Neşe ve bağışlanma",
    anlam: "Renge göre değişir: mor sümbül \"üzgünüm, beni bağışla\" derken, mavi sümbül sadakati, pembe sümbül oyunu ve neşeyi anlatır.",
    mevsim: "İlkbahar", bakim: "Soğan olarak sonbaharda dikilir, güneşli ya da yarı gölgeli yeri sever." },
  { id: "nergis", ad: "Nergis", latince: "Narcissus", emoji: "🌼", kisa: "Yeni başlangıç ve umut",
    anlam: "Baharın habercisi olduğu için yeni başlangıçları ve umudu simgeler. Mitolojide kendine hayran olmasıyla (narsisizm) da anılır.",
    mevsim: "Kış sonu - İlkbahar", bakim: "Soğan olarak sonbaharda dikilir, çok az bakım ister." },
  { id: "zambak", ad: "Zambak", latince: "Lilium", emoji: "🤍", kisa: "Saflık ve asalet",
    anlam: "Beyaz zambak saflığı, temizliği ve asaleti simgeler. Birçok kültürde törenlerde kullanılır.",
    mevsim: "Yaz", bakim: "Güneş ve iyi süzülen toprak ister, soğanı su içinde kalmamalı." },
  { id: "yasemin", ad: "Yasemin", latince: "Jasminum", emoji: "🤍", kisa: "Zarafet ve tatlılık",
    anlam: "Zarafeti, sevgiyi ve tatlılığı anlatır. Akşamları yoğunlaşan kokusuyla bilinir.",
    mevsim: "Yaz", bakim: "Güneşi sever, sırık ya da tel gibi bir desteğe tırmanır." },
  { id: "mimoza", ad: "Mimoza", latince: "Acacia dealbata", emoji: "🌱", kisa: "Nezaket ve duyarlılık",
    anlam: "Nezaketi ve duyarlılığı simgeler. Türkiye'de ve birçok ülkede 8 Mart Dünya Kadınlar Günü ile ilişkilendirilir.",
    mevsim: "Kış sonu", bakim: "Soğuktan korunmuş, güneşli bir yer ister." },
  { id: "gelincik", ad: "Gelincik", latince: "Papaver rhoeas", emoji: "🌺", kisa: "Hatıra ve anma",
    anlam: "Kırmızı rengi nedeniyle birçok ülkede anma ve hatıra çiçeği olarak kullanılır. Kısa ömürlüdür, kopartılınca çabuk solar.",
    mevsim: "İlkbahar", bakim: "Doğada kendi kendine yetişir, tohumuyla çoğalır." },
  { id: "ortanca", ad: "Ortanca", latince: "Hydrangea", emoji: "💠", kisa: "Minnettarlık",
    anlam: "Bol ve dolgun çiçek öbekleriyle minnettarlığı ve içten teşekkürü anlatır. Toprağın asitliğine göre rengi pembe ile mavi arasında değişebilir.",
    mevsim: "Yaz", bakim: "Nemli toprak ve yarı gölgeyi sever, çok su ister." },
];

// Çiçeklerin belirgin özellikleri: görünüşü, kokusu, boyu ve dikkat edilecek noktalar.
const OZELLIKLER = {
  gul: "Dikenli sap, katmanlı ve kadifemsi taç yapraklar, tatlı ve güçlü koku. Kırmızı, beyaz, sarı, pembe gibi çok sayıda renkte olur.",
  lale: "Fincan biçiminde tek çiçek, dik ve düz sap, kalın uzun yapraklar. Soğanlı bir bitkidir; çizgili ve saçaklı çeşitleri de vardır.",
  papatya: "Sarı bir merkez ve çevresinde ince beyaz taç yapraklar. Küçük boyludur, kokusu hafiftir.",
  aycicegi: "3 metreye kadar uzayabilir. Büyük sarı taç yapraklar ortadaki kahverengi disk çiçeği çevreler; tohumlarından yağ elde edilir.",
  lavanta: "Mor-mavi başak biçimli çiçekler, gümüşi yeşil dar yapraklar ve rahatlatıcı güçlü koku. Arıları çeker.",
  menekse: "Kısa boylu, kadife dokulu kalp biçimli yapraklar ve mor ya da mavi (bazen beyaz, sarı) küçük çiçekler. Hafif tatlı kokar.",
  karanfil: "Kenarları tırtıklı taç yapraklar, baharatımsı koku ve gri-yeşil dar yapraklar. Vazoda uzun süre dayandığı için sık kullanılır.",
  orkide: "İki yanlı simetrik, dudak denilen özel bir yaprağı olan egzotik çiçekler. Haftalarca açık kalabilir.",
  sumbul: "Sapın çevresinde sıkışık dizilmiş çok sayıda küçük yıldız biçimli çiçek ve çok yoğun koku. Pembe, mor, mavi ve beyaz renkleri vardır.",
  nergis: "Ortada borazan biçimli bir taç, çevresinde altı yaprak; sarı ya da beyaz. Sivri uzun yaprakları vardır. Bitkinin tüm kısımları zehirlidir.",
  zambak: "Büyük, borazan ya da yıldız biçimli çiçekler ve geriye kıvrık yapraklar; belirgin ve yoğun koku. Kediler için zehirlidir.",
  yasemin: "Beyaz, yıldız biçimli küçük çiçekler ve çok tatlı yoğun koku. Sarılıcı dalları vardır, parfümde sık kullanılır.",
  mimoza: "Küçük, tüylü, top biçimli sarı çiçek öbekleri ve ince tüysü yapraklar. Hafif tatlı kokar.",
  gelincik: "Kağıt inceliğinde kırmızı yapraklar, ortada koyu bir leke ve tüylü sap. Tarlalarda kendiliğinden yetişir, vazoda çabuk solar.",
  ortanca: "Top biçiminde büyük çiçek öbekleri ve iri yapraklar. Toprağın asitliğine göre pembe ya da mavi olabilir.",
};

for (const cicek of CICEKLER) {
  cicek.ozellik = OZELLIKLER[cicek.id];
}

const FAVORI_ANAHTARI = "cicek-rehberi-favoriler";

// localStorage bazı durumlarda (özel pencere gibi) kullanılamayabilir; o yüzden güvenli sarmalayıcı.
let favoriler = new Set();
try {
  favoriler = new Set(JSON.parse(localStorage.getItem(FAVORI_ANAHTARI) || "[]"));
} catch (_) { /* depolama yoksa favoriler yalnızca bu oturumda kalır */ }

function favorileriKaydet() {
  try {
    localStorage.setItem(FAVORI_ANAHTARI, JSON.stringify([...favoriler]));
  } catch (_) { /* yoksay */ }
}

let sekme = "hepsi";
let aramaMetni = "";

const $liste = document.getElementById("liste");
const $bos = document.getElementById("bos");
const $bugun = document.getElementById("bugun");
const $ara = document.getElementById("ara");
const $detay = document.getElementById("detay");
const $detayIcerik = document.getElementById("detay-icerik");

// Türkçe karakterleri ve büyük/küçük harfi yok sayan arama için metni sadeleştirir.
function sadelestir(metin) {
  return metin
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function eslesir(cicek, sorgu) {
  if (!sorgu) return true;
  const samanlik = sadelestir([cicek.ad, cicek.latince, cicek.kisa, cicek.anlam, cicek.ozellik].join(" "));
  return samanlik.includes(sorgu);
}

function gorunenler() {
  const sorgu = sadelestir(aramaMetni.trim());
  return CICEKLER.filter((c) => (sekme === "hepsi" || favoriler.has(c.id)) && eslesir(c, sorgu));
}

function ogeOlustur(etiket, sinif, metin) {
  const el = document.createElement(etiket);
  if (sinif) el.className = sinif;
  if (metin !== undefined) el.textContent = metin;
  return el;
}

function listeyiCiz() {
  const liste = gorunenler();
  $liste.replaceChildren();

  for (const c of liste) {
    const satir = ogeOlustur("li", "kart");
    satir.append(ogeOlustur("span", "emoji", c.emoji));

    const metin = ogeOlustur("button", "metin");
    metin.type = "button";
    metin.append(ogeOlustur("div", "ad", c.ad), ogeOlustur("div", "kisa", c.kisa));
    metin.addEventListener("click", () => detayAc(c.id));

    const kalp = ogeOlustur("button", "kalp" + (favoriler.has(c.id) ? " acik" : ""), favoriler.has(c.id) ? "♥" : "♡");
    kalp.type = "button";
    kalp.setAttribute("aria-label", c.ad + (favoriler.has(c.id) ? " favorilerden çıkar" : " favorilere ekle"));
    kalp.addEventListener("click", () => favoriDegistir(c.id));

    satir.append(metin, kalp);
    $liste.append(satir);
  }

  $bos.hidden = liste.length > 0;
  if (liste.length === 0) {
    $bos.textContent = sekme === "favori" && !aramaMetni.trim()
      ? "Henüz favorin yok. Bir çiçeğin yanındaki ♡ simgesine dokun."
      : "Sonuç bulunamadı. Başka bir kelime dene.";
  }
}

function bugununCicegi() {
  // Her gün aynı çiçek çıksın diye gün sayısına göre seçilir.
  const gun = Math.floor(Date.now() / 86400000);
  return CICEKLER[gun % CICEKLER.length];
}

function bugunuCiz() {
  const c = bugununCicegi();
  $bugun.replaceChildren(
    ogeOlustur("small", "", "Bugünün çiçeği"),
    ogeOlustur("div", "ad", c.emoji + " " + c.ad),
    ogeOlustur("p", "", c.kisa)
  );
  $bugun.onclick = () => detayAc(c.id);
}

function favoriDegistir(id) {
  if (favoriler.has(id)) favoriler.delete(id); else favoriler.add(id);
  favorileriKaydet();
  listeyiCiz();
  if (!$detay.hidden) detayAc(id);
}

function detayAc(id) {
  const c = CICEKLER.find((x) => x.id === id);
  if (!c) return;

  const fav = favoriler.has(id);
  const baslik = ogeOlustur("h2", "", c.ad);
  baslik.id = "detay-ad";

  const buton = ogeOlustur("button", "detay-kalp" + (fav ? " acik" : ""), fav ? "♥ Favorilerde" : "♡ Favorilere ekle");
  buton.type = "button";
  buton.addEventListener("click", () => favoriDegistir(id));

  $detayIcerik.replaceChildren(
    ogeOlustur("div", "buyuk", c.emoji),
    baslik,
    ogeOlustur("p", "latince", c.latince),
    ogeOlustur("h3", "", "Anlamı"),
    ogeOlustur("p", "", c.anlam),
    ogeOlustur("h3", "", "Belirgin özellikleri"),
    ogeOlustur("p", "", c.ozellik),
    ogeOlustur("h3", "", "Mevsim"),
    ogeOlustur("p", "", c.mevsim),
    ogeOlustur("h3", "", "Bakım"),
    ogeOlustur("p", "", c.bakim),
    buton
  );
  $detay.hidden = false;
  document.getElementById("kapat").focus();
}

function detayKapat() {
  $detay.hidden = true;
}

$ara.addEventListener("input", () => { aramaMetni = $ara.value; listeyiCiz(); });

for (const dugme of document.querySelectorAll(".sekme")) {
  dugme.addEventListener("click", () => {
    sekme = dugme.dataset.sekme;
    document.querySelectorAll(".sekme").forEach((d) => d.classList.toggle("aktif", d === dugme));
    listeyiCiz();
  });
}

document.getElementById("kapat").addEventListener("click", detayKapat);
$detay.addEventListener("click", (olay) => { if (olay.target === $detay) detayKapat(); });
document.addEventListener("keydown", (olay) => { if (olay.key === "Escape") detayKapat(); });

bugunuCiz();
listeyiCiz();

// Çevrimdışı çalışma için service worker (yalnızca http/https üzerinde).
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* kayıt başarısızsa uygulama yine çalışır */ });
}
