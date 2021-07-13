# Szukajcie, a znajdziecie!

*2020-02-24*

W zeszłym roku popełniłem na blogu wyszukiwarkę pełnotekstową, o czym z dumą pisałem w poście pt. „Blog na indeksie”. Od tego czasu nieznacznie ulepszałem format opisu indeksu, a ostatnio dodałem obsługę indeksowania plików PDF oraz ZIP. W dzisiejszym odcinku o kolejnym drobnym usprawnieniu, czyli o realizacji mechanizmu podpowiedzi.

Działanie rzeczonego mechanizmu podpowiedzi wyobrażałem sobie następująco: w trakcie wpisywania przez użytkownika interesujących go słów, *na bieżąco*, sprawdzane jest występowanie tychże słów w zbiorze wszystkich zaindeksowanych słów. W przypadku wpisania słowa, które nie występuje w indeksie proponowane jest inne, *podobne* zaindeksowane słowo.

Należy doprecyzować kiedy słowa uważamy za podobne. Jak nie trudno się domyśleć, ktoś już kiedyś przede mną zastanawiał się nad określeniem takiego kryterium. Używając pewnej, istniejącej już wyszukiwarki pełnotekstowej łatwo można odnaleźć informacje o *odległości Levenshtein-a*. Jest to *metryka* podobieństwa słów mierzona miarą minimalnej liczby prostych przekształceń liter zamieniających jedno słowo w drugie, gdzie proste przekształcenia liter to:

* usunięcie litery
* wstawienie liter
* zamiana liter na inną

Kolejne zapytanie wspomnianej, pewnej wyszukiwarki pełnotekstowej o algorytm wyznaczania odległości Levenshtein-a pozwala odnaleźć informacje o algorytmie *Wagner-a–Fischer-a*. Jest to całkiem zgrabny algorytm oparty na technice *programowania dynamicznego*, wg którego odległość Levenshtein-a słów $a$ oraz $b$ długości odpowiednio $\#a$ i $\#b$ jest równa $\operatorname{lev}_{a,b}(\#a,\#b)$, gdzie

$$
\operatorname{lev}_{a,b}(i,j)=
  \begin{cases}
    i & \text{dla $j=0$},\\
    j & \text{dla $i=0$},\\
    \min
    \begin{cases}
      \operatorname{lev}_{a,b}(i-1,j)+1\\
      \operatorname{lev}_{a,b}(i,j-1)+1\\
      \operatorname{lev}_{a,b}(i-1,j-1)+c(a_i,b_j)
    \end{cases}
    &\text{dla $i\in\{1,\ldots,\#a\}$, $j\in\{0,\ldots,\#b\}$,}
  \end{cases}
$$

oraz

$$
c(x,y)=
  \begin{cases}
  0 & \text{dla $x=y$,}\\
  1 & \text{dla $x\ne y$.}
  \end{cases}
$$

Jak widać, dla wyznaczenia odległości Levenshtein-a wystarczy odpowiednio wypełnić dwuwymiarową tablicę rozmiaru $(\#a+1)\times(\#b+1)$. Przykładowo dla słów „kąt” i „kot” otrzymujemy tablicę:

|       |   | k | ą |   t   |
|-------|---|---|---|-------|
|       | 0 | 1 | 2 |   3   |
| **k** | 1 | 0 | 1 |   2   |
| **o** | 2 | 1 | 1 |   2   |
| **t** | 3 | 2 | 2 | **1** |

zaś dla  słów „kąt” i „koty” otrzymujemy tablicę:

|       |   | k | ą |   t   |
|-------|---|---|---|-------|
|       | 0 | 1 | 2 |   3   |
| **k** | 1 | 0 | 1 |   2   |
| **o** | 2 | 1 | 1 |   2   |
| **t** | 3 | 2 | 2 |   1   |
| **y** | 4 | 3 | 3 | **2** |

Powyższe przykłady pokazują, że w przypadku wyznaczania odległości Levenshtein dla wielu słów, warto wykorzystać wcześniejsze obliczenia.

Odległości Levenshtein-a nie jest idealną miarą podobieństwa słów. Zarówno słowa „kąt” i „kat” oraz słowa „kąt” i „kot” mają odległości Levenshtein-a równe $1$, a jednak słowa „kąt” i „kat” wyglądają na nieco bardziej podobne aniżeli słowa „kąt” i „kot”…

Na szczęście z łatwością możemy zastąpić człon $c(a_i,b_j)$ np. przez

$$
c'(a_i,b_j)=
  \begin{cases}
  0     & \text{dla $a_i=b_j$,}\\
  0{,}3 & \text{dla $a_i$ oraz $b_j$ różniących się jedynie akcentem,}\\
  1     & \text{w przeciwnym przypadku.}
  \end{cases}
$$

Wówczas odległością słów „kąt” i „kot” będzie liczba $0{,}3$, a słowa „zolw” i „żółw” będą miały odległość $0{,}9$ zamiast $3$.

Właśnie wg opisanych powyżej wywodów zaimplementowałem na blogu mechanizm podpowiedzi. Nie działa on jeszcze w pełni tak jak bym chciał. Przede wszystkim należałoby nieco poprawić wydajność. Metrykę podobieństwa słów też wartałoby trochę podrasować. Jednakże, jak na „pierwszy strzał” to chyba nie jest źle!

# Aktualizacja

Wyszukiwarka została wyłączona. Na jej podstawie popełnię, w tzw. wolnej chwili, ogólną bibliotekę do wyszukiwania pełnotekstowego.
