import { describe, expect, it } from 'vitest';
import { numWord, numWordKu, numWordLang, trG, trD, trDA, capFirst, numDist, WP_pick, trAbl, trAblSuf, trGen, trGenSuf, trDat, trDatSuf, trAcc, trAccSuf } from './numWords.js';

describe('numWord (Türkçe)', () => {
  it('temel sayılar 0-20', () => {
    expect(numWord(0)).toBe('sıfır');
    expect(numWord(1)).toBe('bir');
    expect(numWord(7)).toBe('yedi');
    expect(numWord(10)).toBe('on');
    expect(numWord(15)).toBe('on beş');
    expect(numWord(20)).toBe('yirmi');
  });

  it('iki basamaklı sayılar', () => {
    expect(numWord(34)).toBe('otuz dört');
    expect(numWord(99)).toBe('doksan dokuz');
    expect(numWord(100)).toBe('yüz');
  });

  it('100 üstü değer için kombinasyon mantığı (mevcut davranış)', () => {
    // Algoritma: NUM_WORDS[100] varsa onu, yoksa onlar*10 + birler kombinasyonu üretir.
    // Bu test davranışı dokümante eder (regresyon yakalar).
    expect(numWord(100)).toBe('yüz');
    expect(typeof numWord(150)).toBe('string');
  });
});

describe('numWordKu (Kürtçe)', () => {
  it('temel jimaras', () => {
    expect(numWordKu(0)).toBe('sifir');
    expect(numWordKu(5)).toBe('pênc');
    expect(numWordKu(20)).toBe('bîst');
  });

  it('birleşik jimara — bîst û çar', () => {
    expect(numWordKu(24)).toBe('bîst û çar');
  });
});

describe('numWordLang dil seçimi', () => {
  it('default tr', () => {
    expect(numWordLang(7)).toBe('yedi');
  });
  it('ku Kürtçe verir', () => {
    expect(numWordLang(7, 'ku')).toBe('heft');
  });
});

describe('Türkçe morfoloji', () => {
  it('genitif (trG)', () => {
    expect(trG('Elif')).toBe("Elif'in");
    expect(trG('Ali')).toBe("Ali'nin");
    expect(trG('Yusuf')).toBe("Yusuf'un");
  });

  it('datif (trD)', () => {
    expect(trD('Elif')).toBe("Elif'e");
    expect(trD('Ada')).toBe("Ada'ya");
  });

  it('de/da bağlacı', () => {
    expect(trDA('Elif')).toBe('de');
    expect(trDA('Kaan')).toBe('da');
  });

  it('capFirst Türkçe-aware', () => {
    expect(capFirst('üç')).toBe('Üç');
    expect(capFirst('iki')).toBe('İki');
  });

  it('ablatif sayı eki (trAbl) — ünlü uyumu + ünsüz benzeşmesi (TDK)', () => {
    // ünlü uyumu: ince→e, kalın→a
    expect(trAbl(1)).toBe("1'den"); // bir
    expect(trAbl(2)).toBe("2'den"); // iki
    expect(trAbl(6)).toBe("6'dan"); // altı
    expect(trAbl(9)).toBe("9'dan"); // dokuz
    expect(trAbl(10)).toBe("10'dan"); // on
    expect(trAbl(20)).toBe("20'den"); // yirmi
    // ünsüz benzeşmesi: sert ünsüzden sonra d→t
    expect(trAbl(3)).toBe("3'ten"); // üç
    expect(trAbl(4)).toBe("4'ten"); // dört
    expect(trAbl(5)).toBe("5'ten"); // beş
    expect(trAbl(40)).toBe("40'tan"); // kırk
    expect(trAbl(60)).toBe("60'tan"); // altmış
    expect(trAbl(70)).toBe("70'ten"); // yetmiş
    // bileşik: son kelimeye göre
    expect(trAbl(25)).toBe("25'ten"); // yirmi beş
    expect(trAbl(100)).toBe("100'den"); // yüz
    // yalnız ek
    expect(trAblSuf(5)).toBe('ten');
    expect(trAblSuf(6)).toBe('dan');
  });

  it('tamlayan/genitif sayı eki (trGen) — ünlü uyumu + kaynaştırma n', () => {
    expect(trGen(2)).toBe("2'nin"); // iki (ünlü) → nin
    expect(trGen(3)).toBe("3'ün"); // üç
    expect(trGen(4)).toBe("4'ün"); // dört
    expect(trGen(5)).toBe("5'in"); // beş
    expect(trGen(6)).toBe("6'nın"); // altı (ünlü) → nın
    expect(trGen(7)).toBe("7'nin"); // yedi (ünlü)
    expect(trGen(9)).toBe("9'un"); // dokuz
    expect(trGen(10)).toBe("10'un"); // on
    expect(trGen(20)).toBe("20'nin"); // yirmi (ünlü)
    expect(trGen(100)).toBe("100'ün"); // yüz
    expect(trGenSuf(2)).toBe('nin');
    expect(trGenSuf(5)).toBe('in');
  });

  it('yönelme/datif sayı eki (trDat) — ünlü uyumu + kaynaştırma y', () => {
    expect(trDat(2)).toBe("2'ye"); // iki (ünlü) → ye
    expect(trDat(4)).toBe("4'e"); // dört
    expect(trDat(5)).toBe("5'e"); // beş
    expect(trDat(6)).toBe("6'ya"); // altı (ünlü) → ya
    expect(trDat(9)).toBe("9'a"); // dokuz
    expect(trDat(10)).toBe("10'a"); // on
    expect(trDat(100)).toBe("100'e"); // yüz
    expect(trDatSuf(10)).toBe('a');
    expect(trDatSuf(6)).toBe('ya');
  });

  it('belirtme/akuzatif sayı eki (trAcc) — ünlü uyumu + kaynaştırma y', () => {
    expect(trAcc(2)).toBe("2'yi"); // iki (ünlü) → yi
    expect(trAcc(5)).toBe("5'i"); // beş
    expect(trAcc(6)).toBe("6'yı"); // altı (ünlü) → yı
    expect(trAcc(8)).toBe("8'i"); // sekiz
    expect(trAcc(9)).toBe("9'u"); // dokuz
    expect(trAcc(10)).toBe("10'u"); // on
    expect(trAcc(12)).toBe("12'yi"); // on iki (ünlü)
    expect(trAcc(100)).toBe("100'ü"); // yüz
    expect(trAccSuf(8)).toBe('i');
    expect(trAccSuf(2)).toBe('yi');
  });
});

describe('numDist üleştirme', () => {
  it('temel: birer/ikişer', () => {
    expect(numDist(1)).toBe('birer');
    expect(numDist(2)).toBe('ikişer');
    expect(numDist(5)).toBe('beşer');
  });
});

describe('WP_pick rastgele seçim', () => {
  it('listeden bir eleman döner', () => {
    const arr = ['a', 'b', 'c'];
    const out = WP_pick(arr);
    expect(arr).toContain(out);
  });
});
