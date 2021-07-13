# Daemon wystawiający ludzi na próbę

*2019-03-22*

Ostatnimi czasy, przyszło mi tworzyć tytułowego daemon-a wystawiającego ludzi na próbę, czyli prosty serwer WWW, którego obsługa żądań miała posiadać zabezpieczenie typu *captcha*. Problem okazał się dość ciekawy, gdyż z różnych względów, nie wykorzystywał gotowca typu *Google reCAPTCHA* i konieczne było opracowanie bezpiecznego mechanizmu.

Rzeczony bezpieczny mechanizm działa następująco: Przy pomocy biblioteki *svg-captcha* (zob. <https://github.com/produck/svg-captcha>) serwer generuje obrazek SVG przedstawiający losowy tekst $t$. Przy pomocy helper-a `uuidv1` z projektu *Jackens’ Collection* (zob. <https://github.com/jackens/jc>) generowany jest *unikatowy* identyfikator $u$. Dla pary $(t,u)$ generowany jest ciąg kontrolny $c_1$:

$$\tag{1}c_1={\rm md5}(u+t)$$

Dla dodatkowego, *tajnego identyfikatora* $s$, znanego jedynie serwerowi, generowany jest ciąg kontrolny $c_2$:

$$\tag{2}c_2={\rm md5}(s+c_1)$$

Wraz z przesyłanym obrazem SVG, wysyłany jest nagłówek `set-cookie` ustawiający ciasteczko zawierające wartości $u$, $c_1$ oraz $c_2$.

Przesłane dane pozwalają weryfikować po stronie klienta, poprawność wpisywanego przez użytkownika tekstu $t'$ — wystarczy sprawdzić warunek (1) podstawiając $t'$ w miejsce $t$.

Po stronie klienta nie ma jednak możliwości *wyznaczenia* wartości tekstu $t$. Serwer natomiast *nie przechowuje* żadnej z wygenerowanych wartości.

W obsłudze żądania zabezpieczonego opisanym mechanizmem, dla przesłanych wartości $u$, $c_1$, $c_2$ oraz $t'$, serwer sprawdza warunki (1) i (2) dla $t=t'$ oraz weryfikuje, czy przesłany identyfikator $u$ nie występuje już w jakimś rekordzie tabeli rejestrującej obsłużone już żądania. Nie jest więc możliwe wielokrotne wykorzystanie tych samych wartości.

Po stronie klienta nie ma możliwości wygenerowania $c_2$, a tym samym nie można spreparować wszystkich parametrów, których serwer wymaga do obsługi zabezpieczonego żądania.

Proste i bezpieczne.

Do następnego!
