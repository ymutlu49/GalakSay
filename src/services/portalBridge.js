// HÇMÖ portal köprüsü — çocuğun GalakSay pratiğini portala (bireysel öğretim planı /
// BÖP) PUSH eder. Portaldan çocuk-SSO ile (#hcmo_student=<code>) gelinmişse kodu çözer,
// öğrenci token + portal student_key saklar; oturum bitince ilerlemeyi app_results'a yazar.
// İZOLE: portal bağlamı YOKSA GalakSay normal akışını HİÇ etkilemez (sessiz no-op).

const PORTAL = 'https://hercocukmatematikogrenebilir.com'
const TKEY = 'portal_student_token'
const KKEY = 'portal_student_key'
const NSKEY = 'portal_student_ns' // portal kimliğinin bağlandığı yerel çocuk (ns)

export function getPortalToken() {
  try { return localStorage.getItem(TKEY) } catch { return null }
}
export function getPortalStudentKey() {
  try { return localStorage.getItem(KKEY) } catch { return null }
}
function set(k, v) {
  try { localStorage.setItem(k, v) } catch { /* depolama yok → köprü pasif */ }
}

// Portaldan çocuk-SSO ile gelinmişse (#hcmo_student=<code> ya da ?hcmo_student=)
// kodu çöz → öğrenci token + student_key sakla. URL'i temizle (kod geçmişte kalmasın).
export async function capturePortalStudent() {
  let code = ''
  try { code = new URLSearchParams((location.hash || '').replace(/^#/, '')).get('hcmo_student') || '' } catch { /* yok */ }
  if (!code) { try { code = new URLSearchParams(location.search).get('hcmo_student') || '' } catch { /* yok */ } }
  if (!code) return
  try { history.replaceState({}, '', location.pathname) } catch { /* yok say */ }
  try {
    const d = await fetch(PORTAL + '/api/student/sso/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }).then((r) => (r.ok ? r.json() : null))
    if (d && d.token) {
      set(TKEY, d.token)
      if (d.student && d.student.studentKey) set(KKEY, d.student.studentKey)
      // Yeni portal-SSO gelişi: eski çocuk bağını sıfırla — bağ, bundan sonra İLK
      // oynayan çocuğun ns'ine kurulur (aşağıdaki pushProgress).
      try { localStorage.removeItem(NSKEY) } catch { /* yok say */ }
    }
  } catch { /* portal erişilemedi → push pasif, GalakSay normal çalışır */ }
}

// Oturum özetini portala gönder (engellemez; hata sessiz). Dönüş: gönderildi mi.
// childNs verilirse portal kimliği İLK oynayan çocuğun ns'ine bağlanır; sonraki
// oturumlarda ns uyuşmazsa SESSİZ no-op (2026-08-05: paylaşılan cihazda kardeşin
// ilerlemesinin portaldaki diğer çocuğun kaydına yazılması kapatıldı).
export async function pushProgress(payload, childNs) {
  const token = getPortalToken(), sk = getPortalStudentKey()
  if (!token || !sk) return false
  if (childNs) {
    let bound = null
    try { bound = localStorage.getItem(NSKEY) } catch { /* yok say */ }
    if (!bound) set(NSKEY, childNs)
    else if (bound !== childNs) return false
  }
  try {
    const r = await fetch(PORTAL + '/api/app-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ student_key: sk, app: 'galaksay', kind: 'progress', payload }),
    })
    return r.ok
  } catch { return false }
}
