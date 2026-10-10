# Lisans kapısı sunucu senaryoları (deneme yolu). Önce test/sunucu.mjs çalıştırın.
set -u
P=$1; J=jar$P.txt; rm -f $J
B=http://localhost:$P
post() { curl -s -b $J -c $J -X POST -H 'content-type: application/json' -H "Origin: $B" -d '{}' -w " [%{http_code}]" $B/api/lisans/$1; echo; }
echo "-- 1 ilk deneme";  post deneme
echo "-- 2 durum";        curl -s -b $J $B/api/lisans/durum; echo
echo "-- 3 oyna";         curl -s -b $J -o /dev/null -w "%{http_code}\n" $B/oyna/
echo "-- 4 tekrar deneme (geçerliyken)"; post deneme
echo "-- 5 çerezi sil, iz kalsın"; sed -i '/gs_lis/d' $J; post deneme
echo "-- 6 yabancı köken"; curl -s -X POST -H "Origin: https://kotu.example" $B/api/lisans/deneme -w " [%{http_code}]\n"
echo "-- 7 uzatılmış sahte çerez"; F=$(( ($(date +%s)+60*86400)*1000 )); curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -b "gs_lis=d.$F" $B/oyna/
echo "-- 8 süresi dolmuş"; F=$(( ($(date +%s)-60)*1000 )); curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -b "gs_lis=d.$F" $B/oyna/
echo "-- 9 imzasız geçerli süreli"; F=$(( ($(date +%s)+86400)*1000 )); curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -b "gs_lis=d.$F" $B/oyna/
