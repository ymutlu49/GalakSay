# Android paketini derleme (TWA)

İlk paket (1.0.0) 10 Ekim 2026'da şöyle derlendi. Sonraki sürümler için aynı adımlar izlenir. Her yeni sürümde `twa-manifest.json`'daki `appVersionCode` bir artırılır ve `appVersion` güncellenir.

1. **Araçlar:**
   - JDK 17 ya da 21
   - Android SDK: `platforms;android-36`, `build-tools;36.0.0`
   - Node.js
   - `npm install @bubblewrap/core@1.27.0`
2. **Proje üretimi.** `twa-manifest.json`'dan Android projesi üretilir:
   ```js
   import { TwaGenerator, TwaManifest, ConsoleLog } from '@bubblewrap/core';
   const m = new TwaManifest(JSON.parse(fs.readFileSync('twa-manifest.json', 'utf8')));
   await new TwaGenerator().createTwaProject('proje', m, new ConsoleLog('uret'));
   ```
3. **Derleme:** `cd proje && echo "sdk.dir=$ANDROID_HOME" > local.properties && ./gradlew bundleRelease assembleRelease`
   - Maven Central'a erişim sorunluysa Gradle'a, `repo.maven.apache.org`, `repo1.maven.org` ve `jcenter.bintray.com` adreslerini `https://maven-central.storage-download.googleapis.com/maven2/` aynasına çeviren bir `-I` başlatma betiği verilir.
4. **İmzalama** (yükleme anahtarıyla; anahtar depoda değildir):
   - `jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore galaksay-upload.keystore app-release.aab galaksay-upload`
   - Test APK'sı için önce `zipalign -p 4`, sonra `apksigner sign --ks galaksay-upload.keystore --ks-key-alias galaksay-upload`.
5. **Denetim:**
   - `jarsigner -verify` sonucu "jar verified" olmalı.
   - `aapt2 dump badging` çıktısında `package: name='com.galaksay.app'` görünmeli.
   - `apksigner verify --print-certs` ile yazdırılan SHA-256, `canli-surum/site/.well-known/assetlinks.json`'daki yükleme anahtarı parmak iziyle aynı olmalı.
