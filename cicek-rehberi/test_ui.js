// Çiçek Rehberi için tarayıcı testi (telefon ekranı boyutunda).
//
// Gerekenler: Node.js ve Playwright (npm i -D playwright && npx playwright install chromium)
// Çalıştırma:
//   1) cicek-rehberi klasöründe:  python3 -m http.server 8000
//   2) başka bir terminalde:      node test_ui.js http://localhost:8000/index.html
const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');

(async () => {
  const url = process.argv[2] || 'http://localhost:8000/index.html';
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  const hatalar = [];
  page.on('pageerror', (e) => hatalar.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') hatalar.push('console: ' + m.text()); });

  await page.goto(url);

  // Liste
  assert.strictEqual(await page.locator('#liste .kart').count(), 15, 'başlangıçta 15 çiçek olmalı');

  // Veri bütünlüğü: her çiçekte alanlar dolu, emojiler benzersiz
  const veri = await page.evaluate(() => ({
    eksik: CICEKLER.filter((c) => !c.anlam || !c.ozellik || !c.mevsim || !c.bakim || !c.emoji).map((c) => c.id),
    emojiler: CICEKLER.map((c) => c.emoji),
    idler: CICEKLER.map((c) => c.id),
  }));
  assert.deepStrictEqual(veri.eksik, [], 'eksik alanı olan çiçekler: ' + veri.eksik.join(','));
  assert.strictEqual(new Set(veri.emojiler).size, veri.emojiler.length, 'emojiler benzersiz olmalı');
  assert.strictEqual(new Set(veri.idler).size, veri.idler.length, 'id değerleri benzersiz olmalı');

  // Arama (Türkçe karaktersiz, anlam ve özellik üzerinden)
  await page.fill('#ara', 'mukemmel');
  assert.strictEqual(await page.locator('#liste .kart').count(), 1);
  assert.match(await page.locator('#liste .kart .ad').first().textContent(), /Lale/);
  await page.fill('#ara', 'aşk');
  assert.ok((await page.locator('#liste .kart').count()) >= 2);
  await page.fill('#ara', 'dikenli');
  assert.match(await page.locator('#liste .kart .ad').first().textContent(), /Gül/);
  await page.fill('#ara', 'xyzxyz');
  assert.strictEqual(await page.locator('#liste .kart').count(), 0);
  assert.ok(await page.locator('#bos').isVisible());
  await page.fill('#ara', '');

  // Detay penceresi: açılış, bölümler, arka plan kilidi
  const ilkAd = page.locator('#liste .kart .metin').first();
  await ilkAd.focus();
  await ilkAd.click();
  assert.ok(await page.locator('#detay').isVisible());
  const metin = await page.locator('#detay').textContent();
  for (const baslik of ['Anlamı', 'Belirgin özellikleri', 'Mevsim', 'Bakım']) {
    assert.ok(metin.includes(baslik), 'detayda "' + baslik + '" bölümü olmalı');
  }
  assert.ok(!metin.includes('undefined'));
  assert.ok(await page.evaluate(() => document.body.classList.contains('kilit')), 'arka plan kilitli olmalı');

  // Telefonun geri tuşu pencereyi kapatmalı ve sayfada kalmalı
  await page.goBack();
  assert.ok(await page.locator('#detay').isHidden(), 'geri tuşu pencereyi kapatmalı');
  assert.ok(!(await page.evaluate(() => document.body.classList.contains('kilit'))), 'kilit kalkmalı');
  assert.ok(page.url().startsWith(url.split('#')[0]), 'geri tuşu sayfadan çıkarmamalı');

  // Kapatınca odak açan öğeye dönmeli (Esc ile)
  await ilkAd.focus();
  await ilkAd.click();
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#detay').isHidden());
  assert.ok(await page.evaluate(() => document.activeElement.classList.contains('metin')), 'odak listeye dönmeli');

  // Favori: ekle, sekmede gör, yenilemeden sonra koru, kaldır
  await ilkAd.click();
  await page.locator('.detay-kalp').click();
  assert.match(await page.locator('.detay-kalp').textContent(), /Favorilerde/);
  await page.click('#kapat');
  await page.click('[data-sekme="favori"]');
  assert.strictEqual(await page.locator('#liste .kart').count(), 1);
  await page.reload();
  await page.click('[data-sekme="favori"]');
  assert.strictEqual(await page.locator('#liste .kart').count(), 1, 'favori yenilemeden sonra kalmalı');
  await page.locator('#liste .kalp').first().click();
  assert.strictEqual(await page.locator('#liste .kart').count(), 0);
  assert.match(await page.locator('#bos').textContent(), /favorin yok/);

  // Günün çiçeği yerel takvim gününe göre seçilmeli (gece yarısı değişir)
  const gunluk = await page.evaluate(() => {
    const secim = (yil, ay, gun) => {
      const g = Math.floor(Date.UTC(yil, ay, gun) / 86400000);
      return CICEKLER[g % CICEKLER.length].id;
    };
    return { bugun: bugununCicegi().id, beklenen: secim(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) };
  });
  assert.strictEqual(gunluk.bugun, gunluk.beklenen);

  // ---- Fotoğraf ekranı ----
  assert.ok(await page.locator('#foto-ac').isVisible());
  assert.ok(await page.locator('#foto').isHidden());
  assert.strictEqual(await page.getAttribute('#foto-kamera', 'capture'), 'environment', 'kamera girişi arka kamerayı açmalı');
  assert.strictEqual(await page.getAttribute('#foto-galeri', 'capture'), null, 'galeri girişinde capture olmamalı');
  await page.click('#foto-ac');
  assert.ok(await page.locator('#foto').isVisible());
  assert.strictEqual(await page.locator('#foto-liste .kart').count(), 15);
  assert.ok(await page.locator('#foto-onizleme').isHidden());

  // Resim olmayan dosya reddedilir
  await page.setInputFiles('#foto-galeri', { name: 'not.txt', mimeType: 'text/plain', buffer: Buffer.from('merhaba') });
  assert.match(await page.locator('#foto-durum').textContent(), /fotoğraf değil/);
  assert.ok(await page.locator('#foto-onizleme').isHidden());

  // Resim seçilince önizleme görünür ve gerçekten yüklenir
  await page.setInputFiles('#foto-kamera', path.join(__dirname, 'icon-192.png'));
  await page.waitForFunction(() => {
    const i = document.getElementById('foto-onizleme');
    return !i.hidden && i.naturalWidth > 0;
  });
  assert.match(await page.locator('#foto-durum').textContent(), /karşılaştır/);

  // Listeden çiçek seçilince detay, fotoğraf ekranının üstünde açılır
  await page.locator('#foto-liste .kart .metin').nth(1).click(); // Lale
  assert.ok(await page.locator('#detay').isVisible());
  assert.ok(await page.locator('#foto').isVisible(), 'fotoğraf ekranı altta açık kalmalı');
  assert.match(await page.locator('#detay h2').textContent(), /Lale/);
  const detayUstte = await page.evaluate(() => {
    const r = document.getElementById('detay').getBoundingClientRect();
    return !!document.elementFromPoint(r.left + r.width / 2, r.bottom - 20).closest('#detay');
  });
  assert.ok(detayUstte, 'detay fotoğraf ekranının üstünde olmalı');

  // Geri tuşu önce detayı, sonra fotoğraf ekranını kapatır; fotoğraf temizlenir
  await page.goBack();
  assert.ok(await page.locator('#detay').isHidden());
  assert.ok(await page.locator('#foto').isVisible());
  assert.ok(await page.evaluate(() => document.body.classList.contains('kilit')), 'fotoğraf açıkken kilit sürmeli');
  await page.goBack();
  assert.ok(await page.locator('#foto').isHidden());
  assert.ok(!(await page.evaluate(() => document.body.classList.contains('kilit'))));
  assert.ok(await page.locator('#foto-onizleme').isHidden(), 'kapatınca fotoğraf temizlenmeli');
  assert.strictEqual(await page.getAttribute('#foto-onizleme', 'src'), null);

  // Esc de her seferinde yalnızca en üstteki pencereyi kapatır
  await page.click('#foto-ac');
  await page.locator('#foto-liste .kart .metin').first().click();
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#detay').isHidden());
  assert.ok(await page.locator('#foto').isVisible());
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#foto').isHidden());
  assert.ok(await page.evaluate(() => document.activeElement.id === 'foto-ac'), 'odak foto düğmesine dönmeli');

  // Yatay taşma yok
  assert.ok(!(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)));

  // Service worker kaydı ve manifest ikonları
  await page.waitForTimeout(500);
  assert.ok(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())), 'service worker kayıtlı olmalı');
  const ikonlar = await page.evaluate(async () => {
    const bildirim = await (await fetch('manifest.webmanifest')).json();
    const sonuc = [];
    for (const ikon of bildirim.icons.concat([{ src: 'icon-180.png' }])) {
      sonuc.push([ikon.src, (await fetch(ikon.src)).ok]);
    }
    return sonuc;
  });
  for (const [dosya, tamam] of ikonlar) assert.ok(tamam, 'ikon bulunamadı: ' + dosya);

  assert.deepStrictEqual(hatalar, [], 'konsol hatası: ' + hatalar.join(' | '));
  console.log('TUM KONTROLLER GECTI');
  await browser.close();
})().catch((e) => { console.error('BASARISIZ:', e.message); process.exit(1); });
