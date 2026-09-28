# NuMap yamaları (numap-app)

GalakSay lisans modeli (a: NuMap hesabı, b: aile daveti) ve NuMap bütünleşmesi için NuMap tarafındaki
değişiklikler. Ayrıntı: [../NUMAP_BAGLANTISI.md](../NUMAP_BAGLANTISI.md) §6.2.

- `0001-…` Aile davetleri, hedefli tek kullanımlık SSO, `/game-progress` lisans denetimi, öğrenci
  sayfasında GalakSay paneli (rota, doz, yeniden tarama, aile daveti), karşılaştırma ayrımı.
- `0002-…` Davet doğrulamasında istemci adresi; GalakSay önizleme kökeni (CORS).

Temel: `numap-app` master `b4b14be`. Denetim: 1.081 birim testi, `tsc -b`, lint, derleme; yerel
wrangler + D1 ile 28 API denetimi.

Uygulama (numap-app klasöründe):

```
git checkout -b claude/galaksay-lisans-aile origin/master
git am /yol/GalakSay/docs/numap-yamalari/*.patch
git push -u origin claude/galaksay-lisans-aile   # ardından master'a birleştirme = getnumap.com yayını
```

Veritabanı göç adımı gerekmez: yeni tablolar ilk kullanımda oluşturulur.
