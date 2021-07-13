# URIA konsumująca OKAPI

*2017-11-01*

Okapi leśne oraz nurzyki polarne (z angielskiego: *uria*) są swego rodzaju maskotkami moich dwóch wymysłów: *OKAPI* oraz *URIA*.

OKAPI to specjalny format opisujący API wymieniające dane w formacie *JSON*. *URIA* jest przykładową implementacją GUI „konsumującego” OKAPI. Założenia OKAPI przedstawiałem już dużo wcześniej w poście pt. „Wy nie wiecie, a ja wiem jak rozmawiać trzeba z… OKAPI”. Pora więc na URIĘ.

URIA oparta jest o framework *ExtJS* i jest uniwersalnym GUI tworzącym automatycznie formularze dla obiektów DTO opisanych w formacie OKAPI. Z racji tego, iż format OKAPI pozwala na opisanie logiki danych oraz logiki działania aplikacji, dostosowanie URIA do konkretnej aplikacji wymaga minimalnej ilości kodu specyficznego dla tej aplikacji.

Szczegółowe zasady działania URIA najłatwiej wyjaśnić omawiając jej poszczególne pliki źródłowe.

## Omówienie plików źródłowych URIA

### Wywołanie `/okapi/app.js`

Wywołanie `/okapi/app.js` powinno serwować tłumaczenia aplikacji w zależności od preferencji językowych przeglądarki klienta (mechanizm tłumaczeń opisywałem w poście pt. „Moje wytłumaczenie”) oraz obiekt `app` zawierający podobiekty `events`, `decorators` i `config`.

Obiekt `app.events` dostarcza metody obsługi zdarzeń wywoływanych przed i po dodaniu, przed i po odczycie, przed i po modyfikacji oraz przed i po usunięciu danych wg kodów serwowanych przez API w formacie OKAPI. Kody odpowiadają nazwom metod. Są one specyficzne dla konkretnej aplikacji.

Metody `app.events.before.*` winny zwracać `false`, gdy dane zdarzenie CRUD-owe powinno zostać wstrzymane. Metody `app.events.after.*` realizują logikę aplikacji w zakresie akcji wykonywanych po zdarzeniach CRUD-owych.

> **Uwaga.** Wywołanie `/okapi/app.js` zwraca metody obsługi zdarzeń `before` i `after` wykorzystywane przez serwer. Backend i frontend współdzielą ten sam kod!

Obiekt `app.config` zawiera konfigurację dostosowującą URIĘ do współpracy z konkretnym API (samoprzedstawiającym się w formacie OKAPI).

```js
module.exports = {
  demo: true,
  godsUrl: '/okapi/',
  logUrl: '/log/',
  loginUrl: '/okapi/login.json',
  logoutUrl: '/okapi/logout.json',
  idProperty: '_id',
  valueField: 'id',
  displayField: 'label',
  // '#' or something like '#uria/demo/' for hash based URLs
  // '/' or something like '/uria/demo/' for HTML5 History API
  routePrefix: '#',
  defaultPath: 'viewport=FilterAndAction/container=filter,dto=main_menu,id=_/container=action,dto=about',
  viewports: ['Action', 'FilterAndAction']
}
```

*   `demo`: specjalna flaga określająca tryb pracy demo URIA — na potrzeby statycznego demo hostowanego w ramach *GitHub Pages*
*   `godsUrl`: określa bazowy URL dla żądań do serwera
*   `logUrl`: określa bazowy URL dla żądań logowania nieobsłużonych wyjątków
*   `loginUrl`: określa URL dla żądań logowania do systemu
*   `logoutUrl`: określa URL dla żądań wylogowania z systemu
*   `idProperty`: pozwala przedefiniować nazwę wewnętrznego ExtJS-owego klucza identyfikującego ExtJS-owe modele
*   `valueField`: określa nazwę klucza wartości dla *wszystkich* komponentów słownikowych
*   `displayField`: określa nazwę klucza etykiety dla *wszystkich* komponentów słownikowych
*   `routePrefix`: określa prefiks routingu — URIA może pracować zarówno z tzw. hash URL-ami, jak i z wykorzystaniem HTML5 History API.
    > **Uwaga.** W przypadku serwera *nginx* routing oparty o history API „załatwia się” dyrektywą `try_files`:
    >
    > ```
    > […]
    > location / {
    >   […]
    >   try_files  $uri  $uri/  /index.html;
    >   […]
    > }
    > […]
    > ```
*   `defaultPath`: określa domyślną ścieżkę
*   `viewports`: lista obsługiwanych viewport-ów

Obiekt `app.decorators` zawiera metody (specyficzne dla konkretnej aplikacji) dekorującą formularze wygenerowane przez metodę `Engine.generateComponentConfig`.

### `Ajax.js`

Singleton `Ajax` „opakowuje” metodę `Ext.Ajax.request` o automatyczne wyświetlanie formularza logowania w przypadku zakończenia jakiegoś żądania niepowodzeniem. Ponadto, w przypadku demo URIA, modyfikuje żądania dostosowując je do statycznego pseudo-API.

### `Locale.js`

Klasa `Locale` zastępuje, raczej kiepski, ExtJS-owy mechanizm tłumaczeń, moim ogólnym mechanizmem, który opisywałem w poście pt. „Moje wytłumaczenie”.

### `Action.js`, `FilterAndAction.js`

URIA obsługuje dowolną liczbę widoków (viewport-ów). Klasy `Action` oraz `FilterAndAction` są przykładowymi viewport-ami. `Action` obsługuje jeden kontener `action`, który wyświetlany jest w całym obszarze strony, zaś `FilterAndAction` rozdziela obszar strony na dwa kontenery — `filter` i `action`. Viewport-y mogą obsługiwać *dowolną* liczbę kontenerów — wymaga to oprogramowania w klasie danego viewport-u.

### `Engine.js`

Główną rolą klasy `Engine` jest generowanie konfiguracji formularzy (a więc nie jest wykonywane `Ext.create`) na podstawie opisu, w formacie OKAPI, związanych z nimi obiektów DTO.

### `Panel.js`, `FieldSet.js`, `CheckboxField.js`, `DateField.js`, `NumberField.js`, `CurrencyField.js`, `TextField.js`, `TextAreaField.js`, `Grid.js`, `CheckboxColumn.js`, `DateColumn.js`, `NumberColumn.js`, `CurrencyColumn.js` oraz `TextColumn.js`

URIA nie używa „gołych” komponentów ExtJS-owych, lecz ich specjalnie rozszerzonych wersji.

Klasy `Panel`, `FieldSet` oraz `Grid` zostały rozszerzone o możliwość bindowania wartości (`value`).

Klasy `CheckboxField`, `DateField`, `NumberField`, `CurrencyField`, `TextField`, `TextAreaField` i `Grid` realizują logikę aplikacji zdefiniowaną w OKAPI (w obsłudze określonych zdarzeń wywołują stosowne metody z `app.events`).

Klasa `DateField` została dodatkowo dostosowana o obsługi dat w, standardowym dla JSON, formacie ISO.

Klasa `Grid` ma aktywowaną edycję wartości w poszczególnych komórkach tabeli (plugin `cellediting`), a także dodatkowy przycisk eksportu zawartości całej tabeli do formatu XLSX. Funkcjonalność eksportu nie wykorzystuje mechanizmów ExtJS, jako, że nie są one udostępniane na licencji open source. W ich miejsce zastosowano *FileSaver.js* oraz *Blob.js*.

Klasy `CheckboxColumn`, `DateColumn`, `NumberColumn`, `CurrencyColumn` i `TextColumn` mają określone klasy edytorów wartości komórki tabeli (odpowiednio `CheckboxField`, `DateField`, `NumberField`, `CurrencyField` i `TextField`).

### `ExcelExportXTemplate.js`

Klasa `ExcelExportXTemplate` jest szablonem typu `Ext.XTemplate` definiującym wygląd plików XLSX generowanych przez specjalny przycisk eksportu danych komponentu `Grid`.

### `CrudStatusColumn.js`

Klasa `CrudStatusColumn` implementuje specjalny rodzaj kolumny prezentującej graficzne oznaczenie statusu CRUD danego wiersza tabeli.

### Wywołanie `/okapi/metadata`

Wywołanie `/okapi/metadata` zwraca opis wszystkich obiektów DTO oraz definicje słowników stałych w postaci JSONP, w formacie OKAPI, który opisywałem w poście pt. „Wy nie wiecie, a ja wiem jak rozmawiać trzeba z… OKAPI”.

### `Application.js`

Plik `Application.js` zawiera poprawkę błędu ExtJS, a także rejestruje funkcję obsługi zdarzenia `onhashchange`/`onpopstate` — w zależności od trybu pracy aplikacji (hash URL lub HTML5 History API) określonego w `app.config.routePrefix`. Ponadto rejestruje funkcje obsługi zdarzenia `onbeforeunload`, a także `onerror`, co pozwala na wdrożenie systemu automatycznego zgłaszania nieobsłużonych wyjątków, który opisywałem w poście pt. „Błędy w inwigilacji”. Na końcu startowana jest aplikacja URIA.

## Licencja

Licencja URIA to GPL-3.0. Taka licencja wynika z wykorzystania biblioteki ExtJS właśnie w wersji GPL-3.0.

## Co dalej

URIA oparta o ExtJS ma kilka wad wynikających właśnie z zastosowania ExtJS-a:

*   licencja GPL-3.0
*   rozmiar zminifyowanych plików CSS i JavaScript jest dość duży (por. `gulp build`)
*   zastosowana wersja *Classic* biblioteki ExtJS nie najlepiej sprawdza się na ekranach urządzeń mobilnych, zaś zastosowanie wersji *Modern* nie wchodzi w grę ze względu na brak obsługi zdarzeń wymaganych do automatycznej realizacji logiki aplikacji opisanej w formacie OKAPI

W związku z powyższym chodzi mi po głowie implementacja URIA w oparciu o bibliotekę *Mithril*. Taka implementacja wymaga jednak własnej realizacji komponentów typu `Panel`, `FieldSet`, `CheckboxField`, `DateField`, `NumberField`, `CurrencyField`, `TextField`, `TextAreaField`, `Grid`, `CheckboxColumn`, `DateColumn`, `NumberColumn`, `CurrencyColumn` oraz `TextColumn`.

Ponadto po głowie chodzi mi również np. generyczny serwer OKAPI.

Na zakończenie odsyłam do postu pt. „Duża zielona herbata lepsza od małej” − w tym poście po raz pierwszy wzmiankowałem projekt URIA…
