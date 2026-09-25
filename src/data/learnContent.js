// ═══ KÜRTÇE ÖĞRENME-ÖĞRETME İÇERİĞİ ═══════════════════════════════════════
// Canlı Türkçe LEARN_CONTENT GalakSay.jsx içindedir (tek kaynak); buradaki eski TR kopyası
// 2026-09-25 denetiminde kaldırıldı. KU modülleri TR'den daha az adım içerebilir —
// GalakSay.jsx getLC()/learn ekranı eksik adımda TR adımına düşer (boş ekran yok).
// ═══════════════════════════════════════════════════════════════════════════
// KÜRTÇE (KURMANCÎ) NAVEROKÊ FÊRBÛNÊ
// Referans: Ferhenga Matematikê, Prof. Dr. Yılmaz MUTLU
// Têgehên matematîkî: HEJMAR, KIRARÎ, PARJIMAR, CÎYOMETRÎ, PÎVANDIN
// ═══════════════════════════════════════════════════════════════════════════

export const LEARN_CONTENT_KU = {
  // KATEGORİ 1: NASKIRINA HEJMARAN — Têgehên bingehîn, hevsankirina yekeyê, kardinalîte
  level1: {
    title: "⚡ Şarjkirina Jimartinê",
    subtitle: "Ji bo jimartina kevirên stêrkan enerjiyê bar bike",
    icon: "⚡",
    color: "#16a34a",
    steps: [
      { title: "Kapsulê Enerjiyê Çi Ye?", text: "Li ser kapsulê enerjiyê kevirên stêrkan yên rengîn hene. Her kevirekî stêrkan tiştekî nîşan dide. Bi tiliya xwe li kevirên stêrkan dest bide, bihejmêre û hîn bibe!", tts: "Di kapsulê enerjiyê de kevirên stêrkan yên rengîn hene. Bi destdayînê jimaran hîn bibe!", visual: "rod", rodCount: 5, note: "Jimartina bi destdayînê têgeha jimaran somut dike." },
      { title: "Yek bi Yek Jimartin", text: "Dema ku dihejmêrî li her kevirekî stêrkan bi tiliya xwe dest bide û jimarekê bibêje: yek, du, sê, çar... Li her yekî tenê carekê dest bide! Bê bazdanê û bê dubarekirinê bihejmêre.", tts: "Li her kevirekî stêrkan dest bide û jimarekê bibêje: yek, du, sê... Ti yekî nebazde!", visual: "counting", countTo: 5, note: "Ji her tiştî re jimarek tê. Ji vê re 'hevsankirina yekeyê' tê gotin." },
      { title: "Jimar Her Dem Di Heman Rêzê De Ne", text: "Jimar her dem di heman rêzê de tên gotin: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Ev rêz tu caran naguhere! Sêv jî bihejmêrî kevirên stêrkan jî ev rêz ew yek e.", tts: "Jimar her dem di heman rêzê de tên gotin: yek, du, sê, çar, pênc... Ev rêz tu caran naguhere!", visual: "counting", countTo: 10, note: "Jimar her dem di rêza yek de tên gotin. Ji vê rêzikê re 'rêza sabît' tê gotin." },
      { title: "Jimara Dawî = Giştî", text: "Te bi destdayînê li kevirên stêrkan 1, 2, 3, 4 got. Jimara herî dawî '4' — ev jimara giştî ya kevirên stêrkan nîşan dide! Dema bê pirsîn 'Çend kevirên stêrkan hene?' gotina '4' bes e.", tts: "Jimara herî dawî ya ku gotî giştî nîşan dide. Eger te çar jimartibe, giştî çar e!", visual: "counting", countTo: 4, note: "Jimara herî dawî ya ku tê gotin jimara giştî ya di komê de nîşan dide." },
      { title: "Ji Ku Dest Pê Bikî", text: "Kevirên stêrkan ji çepê ber bi rastê bihejmêre an jî ji rastê ber bi çepê — encam her dem yek e! Cihê destpêkê cuda be jî giştî naguhere. Ya girîng ew e ku li her kevirî carekê dest bidî.", tts: "Ji çepê bihejmêre an ji rastê — encam yek e! Giştî naguhere.", visual: "counting", countTo: 6, note: "Ji ku dest pê bikî, jimara giştî her dem yek dimîne." },
      { title: "Rêzika Du Rengan", text: "Di kapsulê de 5 kevirên stêrkan yên yekem şîn in, yên piştî wê sor in. Dema 5 kevirên şîn dibînî bê jimartin zû 'pênc' bibêje! Paşê yên sor bihejmêre û zêde bike. Mînak: 5 şîn + 2 sor = 7.", tts: "Pêncî kevirên stêrkan yên yekem şîn in, yên piştî wê sor in! Pêncî zû nas bike, yên sor zêde bike.", visual: "twoColor", examples: [3, 5, 7, 9], note: "Naskirina 5'an bi çavan rêyek pir bihêz e ji bo zêdekirinê." },
      { title: "Sê Nîşandanên Jimarê", text: "Her jimar bi sê awayên cuda tê nîşandan: Wekî tişt di kapsulê de, Wekî sembol jimareya nivîskî û Wekî peyv navê dengî. 5 kevirên stêrkan (tişt), '5' (sembol) û 'pênc' (peyv) — her sê heman jimarê vedibêjin!", tts: "Her jimarê sê nîşandan hene: tişt, sembol û peyv. Pênc kevirên stêrkan bibîne, jimareya pênc bixwîne, pênc bibêje!", visual: "tripleCodeLearn", examples: [{ n: 3, chips: 3, symbol: "3", word: "sê" }, { n: 5, chips: 5, symbol: "5", word: "pênc" }, { n: 8, chips: 8, symbol: "8", word: "heşt" }], note: "Tişt (mîqdar), Sembol (jimare) û Peyv (nav): Sê nîşandanên cuda yên heman jimarê." },
      { title: "Yek Zêde, Yek Kêm", text: "Li kapsulê 5 kevirên stêrkan binêre — li ser her yekî jimara rêzê heye. Beriya 5'an 4 e, piştî 5'an 6 e. Kevirên stêrkan yên kesk rêzê nîşan didin. Her jimarê cîranekî heye!", tts: "Beriya pêncan çar e, piştî pêncan şeş e! Kevirên stêrkan yên kesk rêzê nîşan didin.", visual: "successorPredecessor", rodCount: 5, note: "Zêdekirina an derxistina kevirekî stêrkan gavê yekem ê fêrbûna zêdekirin û kemkirinê ye." },
      { title: "Tavilzanîn: Bê Jimartin Naskirin", text: "Tu dizarê li xalan bê jimartin dizanî çend heb in! Naskirin bi nêrînekê ya mîqdarên biçûk ji 'tavilzanîn' re tê gotin. 1, 2, 3 û 4 kevirên stêrkan yên kapsulê bê jimartin naskirinê biceribîne!", tts: "Li kevirên stêrkan demek kurt binêre û zû bibêje çend heb in! Ji vê re tavilzanîn tê gotin.", visual: "subitizing", examples: [2, 3, 4, 5], note: "Mîqdarên biçûk bê jimartin bi nêrînek nas bike!" },
      { title: "Parastina Jimarê", text: "5 kevirên stêrkan li kêleka hev rûne, paşê bi navbêran rûne. Rêzkirin guherî lê jimar hîn jî 5 e! Rêzkirina tiştan biguhere jî jimar naguhere. Jimar bi şeklê girêdayî nîne.", tts: "Rêzkirin guherî lê jimar ew yek ma! Pênc kevirên stêrkan, çawa rêz bikî hîn jî pênc in.", visual: "conservation", count: 5, note: "Cihê tiştan an şeklê wan biguhere jî jimara giştî ew yek dimîne." },
      { title: "🚀 Şarjkirin Qediya!", text: "Enerjiya jimartinê bi tevahî bar bû! Jimartina yek bi yek, ku jimara dawî giştî nîşan dide û rêzika du rengan bar kirine. Gemî amade ye, dest bi berhevkirina kevirên stêrkan bike!", tts: "Şarjkirina enerjiyê qediya! Hêza jimartinê bar bû, tu ji bo peywirê amade yî!", visual: "rod", rodCount: 10, note: "Her modulê enerjiyê yê bar bûyî, bingeha peywira pêş e." }
    ]
  },

  // KATEGORİ 2: TÊKILIYÊN HEJMARAN — Berhevkirin, rêzkirin, jimêrxêz
  level2: {
    title: "⚡ Şarjkirina Dengê",
    subtitle: "Enerjiya berhevkirinê kalibre bike",
    icon: "⚡",
    color: "#93c5fd",
    steps: [
      { title: "Du Koman Berhev Bike", text: "Du komên kevirên stêrkan berhev bike bi rûniştina wan a li binê hev. Her kevirekî stêrkan yek bi yek hevsanî bike. Li kîjan aliyê bê hevsanî bimîne kevirên stêrkan zêdetir hene!", tts: "Du koman li kêleka hev rûne. Her kevirê yek bi yek hevsanî bike. Yên bê hevsanî zêdeyî ne!", visual: "compare", pairs: [{ a: 3, b: 5, answer: "5 > 3 → 2 zêde" }, { a: 4, b: 4, answer: "4 = 4 → wekhev" }], note: "Kapsulên enerjiyê li binê hev rûne — kîjan dirêjtir be ew zêdetir e!" },
      { title: "Kêmtir, Wekhev, Zêdetir", text: "Dema du mîqdaran berhev dikî sê encam dibe: kêmtir, wekhev an zêdetir. 3 kevirên stêrkan bi 5 kevirên stêrkan: 3 kêmtir e, 5 zêdetir e. 4 kevirên stêrkan bi 4: wekhev!", tts: "Sê encam hene: kêmtir, wekhev, zêdetir!", visual: "lessMoreEqual", examples: [{ a: 2, b: 5, result: "kêm" }, { a: 4, b: 4, result: "wekhev" }, { a: 7, b: 3, result: "zêde" }], note: "Kêmtir, wekhev, zêdetir — sê encamên berhevkirinê." },
      { title: "Jimara Mezin, Kapsulê Dirêj", text: "Her ku jimar mezin dibe kapsul jî dirêj dibe. Kapsulê 3 kevirî kurt e, kapsulê 8 kevirî dirêj e. Bi berhevkirina dirêjahiya kapsulên tu dikarî bibînî kîjan jimar mezintir e.", tts: "Kapsulê jimara mezin dirêjtir e! Sê kurt e, heşt dirêj e.", visual: "compare", pairs: [{ a: 3, b: 8, answer: "8 > 3" }], note: "Kapsulê dirêj = jimara mezin." },
      { title: "Jimare bi Mîqdarê Hevsankirin", text: "Dema jimareyekê dibînî divê bizanî ew çend tiştan nîşan dide. 5 kevirên stêrkan bihejmêre, paşê karta '5' bibîne û hevsanî bike! Jimare û mîqdar her dem bi hev re diçin.", tts: "Kevirên stêrkan bihejmêre û jimareya rast bibîne. Jimare û mîqdar heval in!", visual: "matching", examples: [{ num: 3, desc: "3 kevirên stêrkan → jimareya 3" }, { num: 7, desc: "7 kevirên stêrkan → jimareya 7" }], note: "Kevirên stêrkan bihejmêre, jimareya rast bibîne û hevsanî bike!" },
      { title: "Ji Biçûk Heta Mezin Rêzkirin", text: "Ji bo rêzkirina jimaran ya herî biçûk bibîne û bide pêş. Paşê ji yên mayî ya herî biçûk hilbijêre. 5, 2, 8, 1 → rêzkirî: 1, 2, 5, 8.", tts: "Ya herî biçûk bibîne û bide pêş. Paşê ya herî biçûk hilbijêre!", visual: "ordering", numbers: [5, 2, 8, 1], note: "Ya herî biçûk bibîne, bide pêş, ji yên mayî bidomîne." },
      { title: "Ji Mezin Heta Biçûk Rêzkirin", text: "Berevajiyê jî dikarî bikî! Ya herî mezin bide pêş, paşê ya duyem herî mezin hilbijêre. 3, 7, 1, 9 → ji mezin heta biçûk: 9, 7, 3, 1.", tts: "Ya herî mezin bide pêş: neh, heft, sê, yek!", visual: "ordering", numbers: [3, 7, 1, 9], note: "Hem ji biçûk heta mezin hem ji mezin heta biçûk rêzkirin girîng e." },
      { title: "Yek Berê û Yek Piştê", text: "Her jimarê beriya wê û piştî wê yek heye. Beriya 5'an 4 tê, piştî 5'an 6 tê. Jimara piştê yek zêdetir e, ya berê yek kêmtir e.", tts: "Her jimarê du cîranên wê hene. Ya berê yek kêmtir, ya piştê yek zêdetir e!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }, { num: 7, before: 6, after: 8 }], note: "Zanîna jimarên cîran, ji bo zêdekirin û kemkirinê amadekar e." },
      { title: "Di Navbêrê de Kîjan Jimar Heye?", text: "Di navbera 3 û 5 de kîjan jimar heye? 4! Di navbera her du jimarên cîran de tam jimarek heye. Di navbera 6 û 8 de? 7!", tts: "Di navbera sê û pêncê de çi heye? Çar! Di navbera şeş û heştê de? Heft!", visual: "beforeAfter", examples: [{ num: 4, before: 3, after: 5 }], note: "Di navbera 3 û 5 de 4, di navbera 6 û 8 de 7 heye." },
      { title: "Jimêrxêz", text: "Jimaran li ser xêzekê bifikire: ber bi çepê biçûk dibin, ber bi rastê mezin dibin. Ji vê xêzê re 'jimêrxêz' tê gotin. Jimarên nêzîk li kêleka hev radiwestin.", tts: "Di hiş de jimêrxêzek xeyal bike. Çep biçûk e, rast mezin e!", visual: "numberLine", range: [0, 10], note: "Çep biçûk e, rast mezin e — jimar li ser kapsulê rêz dibin." },
      { title: "🚀 Şarjkirin Qediya!", text: "Hêzikên dengê te hatin kalibre kirin! Berhevkirin, rêzkirin û enerjiya jimêrxêzê hat barkirin.", tts: "Şarjkirina dengê qediya! Hêza berhevkirinê bar bû, ji bo peywirê amade yî!", visual: "numberLine", range: [0, 10], note: "Hêzikên berhevkirinê bingeha hemû peywirên galaksiyê ne." }
    ]
  },

  // KATEGORİ 3: AVAHIYA HEJMARAN
  level3: {
    title: "⚡ Şarjkirina Avahiyê", subtitle: "Hêza girêdanên jimaran vekin", icon: "⚡", color: "#ea580c",
    steps: [
      { title: "Jimaran Wekî Parçeyan Bibîne", text: "Li şûna jimartina yek bi yek, dîtina jimaran wekî parçeyên biçûk zûtir e. 7'yan bifikire: dîtina wekî '5 û 2' ji jimartina yek bi yek pir hêsantir e!", tts: "Heftê wekî pênc û du bifikire.", visual: "fiveRef", examples: [{ n: 3, desc: "3 = komek" }, { n: 7, desc: "7 = 5 + 2" }, { n: 9, desc: "9 = 5 + 4" }], note: "Dîtina jimaran wekî parçeyan gavê yekem e ji şêwaza jimartina yek bi yek." },
      { title: "5 Jimareke Girîng E", text: "5 jimareke pir girîng e ji ber ku jimara tiliyên destekî ye!", tts: "Pênc, jimara tiliyên destekî ye!", visual: "fiveRef", examples: [{ n: 2, desc: "ji 5'an 3 kêm" }, { n: 5, desc: "Tam 5 — destek" }, { n: 8, desc: "5 û 3 zêde" }], note: "5 û 10 'jimarên referansa krîtîk' in." },
      { title: "Girêdanên Jimaran heta 5", text: "Zanîna parçeyên 5'an pir bi kar tê: 1+4=5, 2+3=5, 0+5=5.", tts: "Girêdanên jimaran yên pêncê: yek zêde çar, du zêde sê.", visual: "makeN", target: 5, examples: [2, 3, 4, 1], note: "Girêdanên jimaran: Zanîna cotên parçeyan yên ku jimarekê çêdikin kirariyên zûtir dike." },
      { title: "Hevalên 10'an", text: "Cotên jimaran yên ku 10 çêdikin ji ber bike! 1+9, 2+8, 3+7, 4+6, 5+5.", tts: "Hevalên dehan: yek zêde neh, du zêde heşt, sê zêde heft... Hemûyan hîn bibî!", visual: "makeN", target: 10, examples: [6, 8, 3, 7], note: "Zanîna hevalên 10'an ji bo jimartina zikrî pir girîng e." },
      { title: "Ramana Parçe-Giştî", text: "Her jimar ji parçeyên cuda dikare çêbibe. 8 = 5+3 = 4+4 = 6+2 = 7+1.", tts: "Heşt: pênc zêde sê jî dibe, çar zêde çar jî! Jimar bi çend rêyan dikare bê parçekirin.", visual: "numberBonds", examples: [{ whole: 8, parts: [[5,3], [4,4], [6,2]] }], note: "Parçekirina heman jimarê bi awayên cuda, zêdekirin û kemkirinê bi hev re girê dide." },
      { title: "🚀 Şarjkirin Qediya!", text: "Modula avahiyê çalak e! Referansên enerjiyê yên 5 û 10, girêdanên jimaran û hêza parçe-giştî hat barkirin.", tts: "Şarjkirina avahiyê qediya!", visual: "makeN", target: 10, examples: [6, 8, 3], note: "Xalên referansa 5 û 10, bingeha enerjiyê ya hemû peywiran in." }
    ]
  },

  // KATEGORİ 4: KIRARÎ — ZÊDEKIRIN
  level5_addition: {
    title: "⚡ Sotemeniya Zêdekirinê", subtitle: "Enerjiya yekkirinê bar bike", icon: "⚡", color: "#f59e0b",
    steps: [
      { title: "Zêdekirin Çi Ye?", text: "Zêdekirin, anîna du koman li yek e. 3 + 4 = 7.", tts: "Zêdekirin, yekkirina du koman e. Sê zêde çar wekhev heft!", visual: "additionLearn", a: 3, b: 4, note: "Yekkirina du koman." },
      { title: "Bi Zêdekirina Kevirên Stêrkan Zêde Bike", text: "3 kevirên stêrkan yên te hene. 4 hên din zêde bike. Hemûyan bihejmêre: 7!", tts: "Sê kevirên stêrkan yên te hene. Çar hên din zêde bike. Ji destpêkê bihejmêre: heft!", visual: "countAllLearn", a: 3, b: 4, note: "Jimartina hemûyan bi rêzê gavê yekem ê fêrbûna zêdekirinê ye." },
      { title: "Sifir Zêdekirin", text: "Li jimarekê sifir zêde bikî jimar naguhere! 5 + 0 = 5.", tts: "Pênc zêde sifir wekhev pênc e.", visual: "additionLearn", a: 5, b: 0, note: "Zêdekirina sifir jimarê naguherîne!" },
      { title: "Ji Mezin Dest Pê Bike", text: "3 + 5 ji bo jimara mezin dest pê bike: ji 5'an dest pê bike, 3 ber bi pêş bihejmêre: 6, 7, 8.", tts: "Ji mezin dest pê bike: ji pêncan dest pê bike, sê ber bi pêş bihejmêre: şeş, heft, heşt!", visual: "countOnLearn", start: 5, add: 3, note: "Destpêkirina ji jimara mezin kurtereyek girîng e di zêdekirinê de." },
      { title: "Guheztina Cihan: 3+5 = 5+3", text: "Di zêdekirinê de cihên jimaran biguherînî jî encam yek e!", tts: "Sê zêde pênc jî pênc zêde sê jî heşt e!", visual: "commutativityLearn", a: 3, b: 5, note: "3+5 bi 5+3 heman encamê dide." },
      { title: "Ducar: 3+3, 4+4, 5+5...", text: "Zanîna du carê heman jimarê pir hêsan e: 2+2=4, 3+3=6, 4+4=8, 5+5=10.", tts: "Ducar pir hêsan e! Du zêde du çar, sê zêde sê şeş. Heman jimarê du car zêde bike!", visual: "doublesLearn", examples: [{ a: 3, b: 3 }, { a: 4, b: 4 }, { a: 5, b: 5 }], note: "Heman jimarê du car zêdekirin pir hêsan e!" },
      { title: "10'an Temam Bike, Paşê Zêde Bike", text: "8 + 5 zehmet e? Pêşî 10'an temam bike! 8 + 2 = 10. Paşê 3'yê mayî zêde bike: 10 + 3 = 13.", tts: "Heşt zêde pênc. Pêşî ji heştê du zêde bike, deh bû! Paşê sêyê zêde bike, sêzde!", visual: "bridgingLearn", a: 8, b: 5, note: "10'an temam bike û bermayiyê zêde bike." },
      { title: "🚀 Şarjkirin Qediya!", text: "Sotemeniya zêdekirinê tije ye! Yekkirinê, zêdekirinê, girêdanên jimaran û stratejiya temamkirina 10'an bar kirine.", tts: "Sotemeniya zêdekirinê hat barkirin!", visual: "progressionLearn", note: "Bê enerjiya têgihîştinî ezberata sist dimîne." }
    ]
  },

  // KATEGORİ 4b: KEMKIRIN
  level5_subtraction: {
    title: "⚡ Sotemeniya Kemkirinê", subtitle: "Enerjiya veqetandinê bar bike", icon: "⚡", color: "#ef4444",
    steps: [
      { title: "Kemkirin Çi Ye? Veqetandin", text: "Ji 7 kevirên stêrkan 3 heb derxe. 7 − 3 = 4.", tts: "Ji heft kevirên stêrkan sê heb derxe: çar dimîne!", visual: "subtractionLearn", total: 7, remove: 3, note: "Veqetandin, rêbaza herî bingehîn a kemkirinê ye." },
      { title: "Dîtina Ferqê", text: "7 kevirên stêrkan bi 4 kevirên stêrkan li kêleka hev rûne. Di 7'yan de 3 heb zêde hene → ferq 3 e.", tts: "Di navbera heft û çaran de ferq sê ye!", visual: "differenceLearn", a: 7, b: 4, note: "Du kapsulên enerjiyê berhev bike, ferqê bibîne!" },
      { title: "Parçeya Kêm", text: "? + 4 = 7 → parçeya kêm çend e? Bersiv 3 e.", tts: "Pirsmark zêde çar wekhev heft e. Jimara kêm sê ye!", visual: "inverseLearn", a: 3, b: 4, whole: 7, note: "Dîtina parçeya kêm jî kemkirinek e!" },
      { title: "Ber Bi Paş Jimartin", text: "8 − 3: Ji heştê dest pê bike, sê ber bi paş → 7, 6, 5. Bersiv 5 e!", tts: "Ji heştê sê ber bi paş bihejmêre: heft, şeş, pênc!", visual: "backCount", start: 8, steps: 3, note: "Jimartina ber bi paş, dema ku bermayî biçûk e stratejiya herî bi bandor e." },
      { title: "Zêdekirin û Kemkirin Xwişk û Bira Ne", text: "3 + 5 = 8 dizanî: 8 − 5 = 3 û 8 − 3 = 5 jî dizanî!", tts: "Sê zêde pênc heşt e. Heşt kemker pênc sê ye!", visual: "inverseLearn", a: 3, b: 5, whole: 8, note: "Zêdekirinê bizanî kemkirinê jî dizanî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Sotemeniya kemkirinê tije ye!", tts: "Sotemeniya kemkirinê hat barkirin!", visual: "subProgressionLearn", note: "Kemkirin û zêdekirin neynika hev in." }
    ]
  },

  // KATEGORİ 4c: CARKIRIN
  level5_multiplication: {
    title: "⚡ Reaktora Carkirinê", subtitle: "Hêza komdarkirinê çalak bike", icon: "⚡", color: "#9333ea",
    steps: [
      { title: "Koma Wekhev Çi Ye?", text: "Li ser masê 3 teştên hene û di her teştê de 4 tûtik hene. Ji van re 'komên wekhev' tê gotin.", tts: "Sê teşt, di her teştê de çar tûtik!", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Naskirina avahiya koma wekhev bingeha ramana carkirinê ye." },
      { title: "Zêdekirina Dubare", text: "Di 3 teştan de 4'an: 4 + 4 + 4 = 12. Ji vê re 'zêdekirina dubare' tê gotin.", tts: "Çar zêde çar zêde çar wekhev dwazde ye.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Zêdekirina dubare rêya sezgiyî ya ber bi carkirinê ye." },
      { title: "Nîşana Carkirinê: ×", text: "Li şûna nivîsandina 4 + 4 + 4 dikarin bi kurterê 3 × 4 binivîsin. Encam: 12.", tts: "Sê carîn çar, dwazde.", visual: "multiplyLearn", groups: 3, perGroup: 4, note: "Carkirin ji zêdekirina dubare têgeheke berfirehtir e." },
      { title: "Jimartina Rîtmîk bi Carkirinê", text: "5'an 5'an bihejmêre: 5, 10, 15, 20, 25. Jimara pêncemîn = 5 × 5 = 25!", tts: "Pêncan pêncan bihejmêre: pênc, deh, pazde, bîst, bîst û pênc!", visual: "skipCountLearn", step: 5, count: 5, note: "Bi her gavê komeke din zêde dikî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Reaktora carkirinê çalak e!", tts: "Reaktora carkirinê çalak e!", visual: "timesTableLearn", note: "Enerjiya carkirinê ya bi têgihîştinê bar bûye mayîndar e." }
    ]
  },

  // KATEGORİ 4d: PARKIRIN
  level5_division: {
    title: "⚡ Reaktora Parkirinê", subtitle: "Hêza parkirinê çalak bike", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Wekhev Parkirin", text: "6 nanên şîrîn ji 2 hevalan re wekhev belav bike: her kes 3 heb! 6 ÷ 2 = 3.", tts: "Şeş nanên şîrîn ji du hevalan re wekhev belav bike!", visual: "divisionLearn", total: 6, groups: 2, note: "Parkirina wekhev bingeha parkirinê ye!" },
      { title: "Yek bi Yek Belav Bike", text: "12 şêranî ji 4 zarokan re yek bi yek belav bike: her kes 3 bû. 12 ÷ 4 = 3.", tts: "Yek bi yek belav bike!", visual: "divisionLearn", total: 12, groups: 4, note: "Belavkirina yek bi yek rêya herî xwezayî ya fêrbûna parkirinê ye." },
      { title: "Carkirinê Bifikire!", text: "12 ÷ 3 = ? → 'Bi 3 çi carkirin bikim ku 12 bibe?' 3 × 4 = 12 → bersiv 4 e!", tts: "Dwazde par sê: sê carîn çend dwazde dike? Çar!", visual: "divisionLearn", total: 12, groups: 3, note: "Mifteya rastiyên parkirinê rastiyên carkirinê ne." },
      { title: "🚀 Şarjkirin Qediya!", text: "Reaktora parkirinê çalak e!", tts: "Reaktora parkirinê çalak e!", visual: "groupingLearn", total: 12, groupSize: 4, note: "Parkirin û carkirin neynika hev in." }
    ]
  },

  // KATEGORİ 5: RAMANA TÊKILDAR
  level6: {
    title: "⚡ Şarja Girêdanê", subtitle: "Perçe-giştî, hejmara kêm û ferq", icon: "⚡", color: "#0891b2",
    steps: [
      { title: "Her Jimar Dikare Bê Parçekirin", text: "7 = 3+4 = 2+5. Ji vê re ramana 'parçe-giştî' tê gotin.", tts: "Heft: sê zêde çar jî dibe, du zêde pênc jî!", visual: "partWholeLearn", whole: 7, examples: [[3, 4], [2, 5], [1, 6]], note: "Zêdekirin û kemkirin du rûyên heman girêdana jimaran in." },
      { title: "Jimara Kêm: Zêdekirin", text: "5 + ? = 8 → bersiv 3 e!", tts: "Pênc zêde çi wekhev heşt e? Bersiv sê ye!", visual: "missingLearn", examples: [{ eq: "3 + ? = 7", answer: 4 }, { eq: "? + 5 = 9", answer: 4 }], note: "Dîtina jimara kêm destpêka ramana cebîrî ye." },
      { title: "Dîtina Ferqê", text: "Ferqa di navbera 8 û 5 de: ji 5'an heta 8'an 3 gav → ferq 3 e.", tts: "Ferqa di navbera heşt û pêncê de sê ye!", visual: "differenceLearn", a: 8, b: 5, note: "Dîtina ferqê pîvandina dûrahiya di navbera du jimaran de ye." },
      { title: "Texmînkirin", text: "Li kevirên stêrkan yên kapsulê binêre û mîqdarê texmîn bike.", tts: "Ji pêncan kêmtir e, zêdetir e? Bi xalên referansê texmîn bike!", visual: "estimateLearn", examples: [3, 7, 11, 5], note: "Nêzîkî li ku ye texmîn bike!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Şîfreyên te yên desenê hatin çareserkirin!", tts: "Şîfreya desenê hat çareserkirin!", visual: "numberLine", range: [0, 10], note: "Hêzika ramana têkildar mifteya çareserkirina pirsgirêkan e." }
    ]
  },

  // KATEGORİ 6: ŞIYANÊN ZIKRÎ
  level7: {
    title: "⚡ Şarjkirina Birûskê", subtitle: "Hêza naskirina bilez bar bike", icon: "⚡", color: "#c026d3",
    steps: [
      { title: "Bi Nêrînek Naskirin", text: "Naskirin bi nêrînekê ya mîqdarên biçûk ji 'tavilzanîn' re tê gotin.", tts: "Li kevirên stêrkan demek kurt binêre. Bê jimartin çend heb in bibîne!", visual: "subitizingLearn", examples: [2, 3, 4], note: "Tavilzanîn: mîqdarên 1-4 bê jimartin nas bike." },
      { title: "Bi Koman Naskirin", text: "7 kevirên stêrkan wekî '5 û 2' bibînî zû nas dikî!", tts: "Heftê wekî pênc û du bibîne!", visual: "subitizingLearn", examples: [5, 6, 7, 8], note: "Parçeyan ji hev cuda nas bike, paşê bike yek." },
      { title: "Xala Referansa 5", text: "3 → '5'an 2 kêm'. 7 → '5 û 2 zêde'.", tts: "Sê: ji pêncan du kêm. Heft: pênc û du zêde.", visual: "refPointLearn", examples: [{ num: 3, ref: "5'an 2 kêm" }, { num: 7, ref: "5 û 2 zêde" }, { num: 5, ref: "Tam 5" }], note: "Pergala referansa 5 û 10." },
      { title: "Stratejiya Rast Hilbijêre", text: "5+5 → ducar! 9+4 → 10'an temam bike! 8−2 → ber bi paş bihejmêre!", tts: "Ji bo her pirsê rêya herî hêsan hilbijêre!", visual: "refPointLearn", examples: [{ num: 5, ref: "Ducar: 5+5=10" }, { num: 9, ref: "10'an temam bike" }], note: "Tu dikarî heman pirsê bi çend rêyan çareser bikî!" },
      { title: "🚀 Şarjkirin Qediya!", text: "Hêzikên birûskê çalak bûn!", tts: "Şarjkirina birûskê qediya!", visual: "refPointLearn", note: "Ramana nerm ji girêdayîbûna bi yekê rêbazê pir bihêztir e." }
    ]
  },

  // KATEGORİ 7: NIRXANE (XANE)
  level4: {
    title: "⚡ Şarjkirina Qatan", subtitle: "Enerjiya xaneyan nexşe bike", icon: "⚡", color: "#b45309",
    steps: [
      { title: "10 Jimareke Taybet E", text: "Pergala jimaran li ser 10'an e! Piştî 9'an xaneyeke nû dest pê dike: 10.", tts: "Deh jimareke taybet e!", visual: "bundleLearn", count: 10, note: "Pergala jimaran li ser komên 10'an e." },
      { title: "10 Yekane = 1 Dehane", text: "10 heb yekanan li hev bînî 'dehane' çêdibe.", tts: "Deh yekan komdar bike û dehaneyekê çêke!", visual: "bundleLearn", count: 10, note: "10 yekane = 1 dehane." },
      { title: "Dehane û Yekane", text: "14 = 1 dehane + 4 yekane. 23 = 2 dehane + 3 yekane.", tts: "Çarde: yek dehane, çar yekane!", visual: "decomposeLearn", examples: [{ num: 14, tens: 1, ones: 4 }, { num: 23, tens: 2, ones: 3 }, { num: 45, tens: 4, ones: 5 }], note: "Jimareyê çepê dehan nîşan dide, ya rastê yekan." },
      { title: "Baldar: Nirxa Rastîn a Jimareyê", text: "3'ya di 35'an de = 30! 5 = 5. 35 = 30 + 5.", tts: "Sêya di sî û pêncan de bi rastî sî nirx e!", visual: "decomposeLearn", examples: [{ num: 35, tens: 3, ones: 5 }, { num: 68, tens: 6, ones: 8 }], note: "3'ya di 35'an de ne sê tişt in lê sê dehane ye." },
      { title: "Ji Parçeyan Jimar Çêke", text: "3 dehane + 6 yekane = 36.", tts: "Sê dehane zêde şeş yekane: sî û şeş!", visual: "composeLearn", examples: [{ tens: 1, ones: 7 }, { tens: 3, ones: 2 }, { tens: 5, ones: 0 }], note: "Zarok divê yekaneya 0 jî fêm bikin." },
      { title: "Nîşandana Berfirehkirî", text: "56 = 50 + 6. 70 = 70 + 0.", tts: "Pêncî û şeş wekhev pêncî zêde şeş e!", visual: "expandLearn", examples: [{ num: 18, expanded: "10 + 8" }, { num: 34, expanded: "30 + 4" }, { num: 70, expanded: "70 + 0" }], note: "35 = 30 + 5 nivîsandin alîkariya têgihîştina nirxaneyê dike." },
      { title: "🚀 Şarjkirin Qediya!", text: "Şarjkirina qatan qediya!", tts: "Şarjkirina qatan qediya!", visual: "rhythmicCountLearn", step: 10, count: 5, note: "Enerjiya nirxaneyê sotemeniya bingehîn a peywirên pirjimareyî ye." }
    ]
  },
};
