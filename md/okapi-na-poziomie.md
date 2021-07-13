# OKAPI na poziomie!

*2019-04-25*

Miesiąc temu, w poście pt. „Update widoków na przyszłość” pisałem o widokach update-owalnych w relacyjnych bazach danych, które chciałem zastosować do realizacji framework-a *OKAPI*. Wcześniej, w poście pt. „Krótko o ODB (nie mylić z ODBC)” pisałem o bazie plikowej, którą chciałem zastosować w rzeczonym framework-u. Dzisiaj będzie o anty-koncepcji, czyli o kolejnej zmianie wcześniejszych koncepcji ;)

W założeniu OKAPI ma umożliwiać współdzielenie tabel na poziomie wierszowym. Takie współdzielenie można osiągnąć w zwykłych relacyjnych bazach danych przy pomocy wspomnianych widoków update-owalnych. Takie rozwiązanie przypomina jednak próbę tworzenia bombowca na bazie latawca, a poza tym nie jestem zwolennikiem relacyjnych baz danych — por. post pt. „Migracja (z) relacyjnych baz danych”. Postanowiłem więc przemyśleć na nowo koncepcję bazy danych, tabel, kolumn, wierszy, itd. i zmierzyć się z samodzielną implementacją bazy danych skrojonej na moje potrzeby.

Przypuśćmy, że mamy bazę danych z trzema tabelami:

|  `id`  | `c_a1` | `c_a2` |
|:------:|:------:|:------:|
| `0xA1` |   A11  |   A12  |
| `0xA2` |   A21  |   A22  |

|  `id`  | `c_b1` | `c_b2` | `c_b3` |
|:------:|:------:|:------:|:------:|
| `0xB1` |   B11  |   B12  |   B13  |
| `0xB2` |   B21  |   B22  |   B23  |
| `0xB3` |   B31  |   B32  |   B33  |

|  `id`  | `c_c1` |
|:------:|:------:|
| `0xC1` |   C11  |

Jeśli założymy, że identyfikatory we wszystkich tabelach są unikatowe w obrębie całej bazy danych, to całą bazę danych możemy *postrzegać* jak pojedynczą tabelę:

|  `id`  | `c_a1` | `c_a2` | `c_b1` | `c_b2` | `c_b3` | `c_c1` |
|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| `0xA1` |   A11  |   A12  |    —   |    —   |    —   |    —   |
| `0xA2` |   A21  |   A22  |    —   |    —   |    —   |    —   |
| `0xB1` |    —   |    —   |   B11  |   B12  |   B13  |    —   |
| `0xB2` |    —   |    —   |   B21  |   B22  |   B23  |    —   |
| `0xB3` |    —   |    —   |   B31  |   B33  |   B33  |    —   |
| `0xC1` |    —   |    —   |    —   |    —   |    —   |   C11  |

Wiele tabel sprowadziliśmy do jednej! Pierwotne tabele są widokami tej pojedynczej tabeli, z której możemy wyodrębnić również *dowolne* inne widoki.

Oczywiście jedna, wielka tabela ma mnóstwo „dziur”. Wcale nie oznacza to jednak, że musimy przeznaczać jakąkolwiek pamięć na przechowywanie informacji o tych dziurach. No właśnie, pytanie: w jaki sposób baza danych powinna *wydajnie* przechowywać wartości poszczególnych komórek? Moja odpowiedź: zredukujmy powstałą tabelę do pojedynczej kolumny, czy może raczej *listy* par klucz-wartość:

```
c_a1      → NULL
c_a1@0xA1 → 'A11'
c_a1@0xA2 → 'A21'
c_a2      → NULL
c_a2@0xA1 → 'A12'
c_a2@0xA2 → 'A22'
c_b1      → NULL
c_b1@0xB1 → 'B11'
c_b1@0xB2 → 'B21'
c_b1@0xB3 → 'B31'
c_b2      → NULL
c_b2@0xB1 → 'B12'
c_b2@0xB2 → 'B22'
c_b2@0xB3 → 'B32'
c_b3      → NULL
c_b3@0xB1 → 'B13'
c_b3@0xB2 → 'B23'
c_b3@0xB3 → 'B33'
c_c1      → NULL
c_c1@0xC1 → 'C11'
```

Zwykły, poczciwy algorytm [wyszukiwania binarnego](https://pl.wikipedia.org/wiki/Wyszukiwanie_binarne) pozwoli nam w czasie $O(\ln n)$ znajdować wartości *komórek*. Jak widać wcale nie przechowujemy informacji o dziurach z tabelarycznego widoku bazy danych. Przechowujemy za to po jednej „ekstra dziurze” per kolumna, czyli parę

```
‘nazwa kolumny’ → NULL
```

Dzięki takiej ekstra dziurze możemy w czasie $O(\ln n)$ odnaleźć początek wartości związanych z daną kolumną, a dostęp do kolejnych wartości zajmuje czas $\Theta(1)$.

Zastosowanie listy par klucz-wartość do przechowywania wartości komórek pozwala na rozluźnienie powiązań między wierszami tabel, które znamy z relacyjnych baz danych. Dane w pojedynczej komórce możemy modyfikować niezależnie o danych z komórek dot. tego samego wiersza. Jedyne powiązanie komórek z jednego wiersza tabeli, to wspólny identyfikator wiersza.

Bazy danych klucz-wartość to żadna nowość, nie ma więc potrzeby trudzenia się własnoręcznym implementowaniem algorytmu wyszukiwania binarnego ;) Ja zamierzam w prototypie wykorzystać *LevelDB*. Prototyp popełnię w *Node.js*, by później przemigrować na *Rust*-a. Abstrakcja zastosowania bazy danych klucz-wartość nie stanowi tutaj żadnego problemu. LevelDB bez większych problemów będę mógł zastąpić np. przez *RocksDB*, *TiKV* (zob. <https://github.com/tikv/tikv>), *Simple File-System Database* (zob. <https://github.com/simvux/sfsdb>) lub też *Redis*.

Zastosowanie którejś z wymienionych powyżej implementacji bazy danych klucz-wartość wiąże się z ograniczeniem typu wartości jedynie do wartości napisowych. Konieczne jest więc dodatkowe wyspecyfikowanie typów kolumn. Należy również uwzględnić typy referencyjne (odpowiadających kluczom obcym z relacyjnych baz danych). Ponadto, zakładając, że wszystkie identyfikatory w bazie danych mają jednakową ilość znaków, możemy zrezygnować ze znaków `@` w nazwach kluczy. Ostatecznie, możemy przyjąć następujący format listy klucz-wartość stosowany do przechowywania danych komórek:

```
c           → NULL
c‘cid’      → ‘column description’ + ‘column type’
c‘cid’‘rid’ → ‘value’
[…]
```

gdzie:

* `‘cid’` oznacza identyfikator kolumny
* `‘rid’` oznacza identyfikator wiersza
* `‘column description’` to jakiś opis komórki — skoro na liście mamy ekstra dziury, to mogą one dodatkowo przechowywać opisy kolumn
* `‘column type’` jest *opcjonalnym* wskazaniem typu kolumny, czyli nazwą funkcji serializującej/deserializującej. W szczególności może to być wskazanie na wartość z innej kolumny: `fk(‘cid2’)` — wówczas wartości to identyfikatory wierszy (`‘rid’`), które wraz z `‘cid2’` wskazują wartość powiązaną
* `‘value’` to *napisowa* wartość danej komórki

Każdy użytkownik mający uprawnienie `C` w kluczu `u‘uid’c` może utworzyć nową kolumnę (wówczas ma do niej pełne uprawnienia). Może również udostępnić dowolną kolumnę, do której ma uprawnienia z poziomem uprawnień nie większym niż przez niego posiadany i tylko tym użytkownikom, których ma na swojej liście.

Usunięcie danej kolumny wymaga *jedynie* usunięcia pojedynczego klucza `c‘cid’`. Użytkownicy, którzy mają usuniętą kolumnę na swojej liście, nie odnajdą jej już w bazie, jednakże baza może zawierać wiele zbędnych rekordów dot. usuniętej kolumny. Takie rekordy powinny być usuwane przez system przy ich najbliższym odczycie.

Poza formatem listy klucz-wartość dla danych konieczne jest określenie formatu kluczy dla metadanych. Framework OKAPI wymaga w tym zakresie opisu kont użytkowników oraz ich uprawnień, a także opisu widoków.

Na początek format opisu widoków:

```
v           → NULL
v‘vid’      → ‘view description’
v‘vid’‘iid’ → ‘cid’ + ‘column description’ + ‘column JC specification’
[…]
```

gdzie

* `‘vid’` oznacza identyfikator widoku
* `‘view description’` to jakiś opis widoku
* `‘iid’` oznacza identyfikator opisu kolejnej kolumny w ramach danego widoku
* `‘cid’` wskazuje identyfikator kolumn
* `‘column description’` to opisy kolumn *w ramach danego widoku*
* `‘column JC specification’` oznacza specyfikację dla *Jackens’ Components* (zob. <https://github.com/jackens/jc>)

Każdy użytkownik mający uprawnienie `C` w kluczu `u‘uid’v` może utworzyć nowy widok (wówczas ma do niego pełne uprawnienia). Może również udostępnić dowolny widok, do którego ma uprawnienia z poziomem uprawnień nie większym niż przez niego posiadany i tylko tym użytkownikom, których ma na swojej liście.

Usunięcie danego widoku wymaga *jedynie* usunięcia pojedynczego klucza `v‘vid’`. Użytkownicy, którzy mają usunięty widok na swojej liście, nie odnajdą go już w bazie, jednakże baza może zawierać wiele zbędnych rekordów dot. usuniętego widoku. Takie rekordy powinny być usuwane przez system przy ich najbliższym odczycie.

Przykładowo, opis:

```
vv_b1     → 'Opis widoku v_b1'
vv_b1i_01 → c_b2 + 'Opis kolumny c_b2' + 'w-1-2'
vv_b1i_02 → c_b1 + 'Opis kolumny c_b1' + 'w-1-2'
```

definiuje widok ograniczony do kolumn `c_b2` i `c_b1` (w tej kolejności).

Przejdźmy do formatu opisu kont użytkowników oraz ich uprawnień:

```
u             → NULL
u‘uid’        → ‘user description’ + ‘password’
u‘uid’c       → (C | '')
u‘uid’c‘cid’  → (U | '') + (D | '') + (V | '') +
                (c | '') + (u | '') + (d | '')
[…]
u‘uid’u       → (C | '')
u‘uid’u‘uid2’ → (U | '') + (D | '') + (c | '') + (u | '') + (d | '')
[…]
u‘uid’v       → (C | '')
u‘uid’v‘vid’  → (U | '') + (D | '') + (c | '') + (u | '') + (d | '') +
                ‘view description’ + ‘cid’
[…]
```

gdzie:

* `‘uid’` oznacza identyfikator konta użytkownika
* `‘user description’` to jakiś opis konta użytkownika
* `‘password’` to hasło dostępowe do konta użytkownika
* `u‘uid’c` zawierają definicję uprawnień:
  * `C`: uprawnienie do tworzenia nowych kolumn
* `u‘uid’c‘cid’` zawierają definicję uprawnień:
  * `U`: uprawnienie do modyfikowania metadanych danej kolumny
  * `D`: uprawnienie do usunięcia metadanych danej kolumny
  * `V`: uprawnienie do wykorzystania danej kolumny w tworzonym widoku
  * `c`: uprawnienie do tworzenia nowych rekordów w danej kolumnie
  * `u`: uprawnienie do modyfikowania istniejących rekordów w danej kolumnie
  * `d`: uprawnienie do usuwania istniejących rekordów rekordów w danej kolumnie
* `u‘uid’u` zawierają definicję uprawnień:
  * `C`: uprawnienie do tworzenia nowych kont użytkowników
* `u‘uid’u‘uid2’` zawierają definicję uprawnień:
  * `U`: uprawnienie do modyfikowania danego konta użytkownika
  * `D`: uprawnienie do usunięcia danego konta użytkownika
* `u‘uid’v` zawierają definicję uprawnień:
  * `C`: uprawnienie do tworzenia nowych widoków
* `u‘uid’v‘vid’` zawierają definicję uprawnień:
  * `U`: uprawnienie do modyfikowania danego widoku
  * `D`: uprawnienie do usunięcia danego widoku
* `‘view description’` określają dodatkowy opis dla danego widoku w kontekście danej kolumny iteratora
* `‘cid’` z kluczy `u‘uid’v‘vid’` to wskazanie domyślnej kolumny iteratora dla danego widoku

Każdy użytkownik mający uprawnienie `C` w kluczu `u‘uid’u` może utworzyć nowe konto użytkownika (wówczas ma do niego pełne uprawnienia). Może również udostępnić dowolne konto użytkownika, do którego ma uprawnienia z poziomem uprawnień nie większym niż przez niego posiadany i tylko tym użytkownikom, których ma na swojej liście.

Usunięcie danego konta użytkownika wymaga *jedynie* usunięcia pojedynczego klucza `u‘uid’`. Użytkownicy, którzy mają usunięte konto na swojej liście, nie odnajdą go już w bazie, jednakże baza może zawierać wiele zbędnych rekordów dot. usuniętego konta. Takie rekordy powinny być usuwane przez system przy ich najbliższym odczycie.

<!-- Info o różnym działaniu iteratorów kolumnowych w zależności od tego, czy dany iterator kolumnowy występuje na liście kolumn danego widoku -->

Przykładowa definicja dostępu do widoku `v_b1` dla konta użytkownika o identyfikatorze `u_01` może wyglądać następująco:

```
uu_01vv_b1 → UDcud + 'Opis widoku v_b1 dla użytkownika u_01' + c_i1
```

Jeśli kolumna o identyfikatorze `c_i1` będzie miała definicję

```
cc_i1     → 'Opis kolumny iteratora c_i1'
cc_i10xB1 → NULL
cc_i10xB3 → NULL
```

to widok `v_b1` z iteratorem kolumnowym `c_i1` będzie odpowiadał poniższej tabeli:

|  `id`  | `c_b2` | `c_b1` |
|:------:|:------:|:------:|
| `0xB1` |   B12  |   B11  |
| `0xB3` |   B32  |   B31  |

Inne założenia dot. bazy danych dla framework-a OKAPI:

* Modyfikacja wartości na zasadzie merge. Przykładowo, modyfikacja wartości jakiejś komórki wymaga oprócz przekazania identyfikatora kolumny, identyfikatora wiersza oraz nowej wartości, przekazania dodatkowo poprzedniej wartości. Modyfikacja zostanie wykonana jedynie w przypadku, gdy przekazana poprzednia wartość odpowiada aktualnej wartości.

* Unikatowość identyfikatorów w obrębie całej bazy danych. Takie identyfikatory mogą być generowane w oparciu o czas (w przypadku *Node.js* można zastosować `process.hrtime()`) oraz indeks fork-a procesu. Należy mieć na uwadze, że uruchomienie na innym komputerze bazy działającej wcześniej na jakimś komputerze może doprowadzić do utraty danych, jeśli na tym innym komputerze zegar jest opóźniony w stosunku do pierwszego komputera!

  Dzięki unikatowości identyfikatorów w obrębie całej bazy danych, metadane mogą być przechowywane w ramach odrębnej listy klucz-wartość jak również w ramach jednej wspólnej listy.

W najbliższym czasie udaję się na majówkę. Będę udawał Greka i rozmyślał na temat poczynionych w niniejszym poście rozważań. Wszystko zdaje się jednak trzymać kupy! Do przeczytania!
