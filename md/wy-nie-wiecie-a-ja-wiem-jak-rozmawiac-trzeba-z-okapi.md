# Wy nie wiecie, a ja wiem jak rozmawiać trzeba z… OKAPI

*2017-06-04*

Wiadomo — trzeba ze sobą rozmawiać. Tylko, jak się dogadać z kimś, kto posługuje się sobie tylko znanym językiem? Właśnie z takim problemem mierzą się często programiści tworzący *GUI* „rozmawiające” z jakimś *REST API*.

Oczywiście nie przedstawię tutaj jakiejś uniwersalnej metody na dogadanie się z dowolnym REST API. Zaproponuję jedynie sposób na ułatwienie zrozumienia „języka” *CRUD REST API* wymieniającego dane w formacie *JSON*.

CRUD REST API niejako przedstawia klientowi jakie operacje CRUD-owe są dozwolone na poszczególnych obiektach *DTO*. Czemu by nie rozszerzyć takiego przedstawiania na *każdą składową* obiektu *DTO*?!? Tak! API przedstawiające klientowi dozwolone operacje na wszystkich składowych danego obiektu DTO!

> **Uwaga.** Takie eksponowanie przez API informacji o operacjach CRUD-owych na wszystkich składowych obiektów DTO to w zasadzie pełny opis logiki danych! Taki opis można wykorzystać do realizacji logiki działania aplikacji — w jednym z kolejnych postów, przedstawię projekt *URIA*, tzn. *Universal Rich Internet Application*, realizujący uniwersalne GUI dla aplikacji eksponującej logikę danych/logikę działania aplikacji w przedstawionym tutaj formacie.

Ludzie, podobnie jak sieci neuronowe, najlepiej uczą się na przykładach. Rozważmy więc przykład danych zwracanych i akceptowanych przez jakąś akcję CRUD REST API:

```json
{
  "id": 42,
  "name": "Jacek",
  "surname": "Czekaj",
  "sex": "M",
  "birth_date": "1980-03-31T02:30:00.000Z",
  "children": [{
    "id": 3,
    "name": "Iza",
    "surname": "Czekaj",
    "sex": "F",
    "sex_loan": "Female",
    "toys": [{
      "id": 1,
      "name": "Uria",
      "desc": "pluszowy nurzyk polarny",
      "condition": "As good as new"
    }, {
      "id": 2,
      "name": "Okapi",
      "desc": "pluszowe okapi leśne",
      "condition": "As good as new"
    }]
  }]
}
```

Ogólny meta-opis obiektów `person` w proponowanym przeze mnie formacie mógłby wyglądać następująco:

```json
{
  "name": "person",
  "desc": "Person",
  "base": "person",
  "type": "object",
  "uria": {
    "tabs": [{
      "name": "general",
      "desc": "General information",
      "icon": "user"
    }, {
      "name": "children",
      "desc": "Children",
      "icon": "child"
    }, {
      "name": "parents",
      "desc": "Parents",
      "icon": "blind"
    }]
  },
  "keys": [{
    "name": "id",
    "desc": "id",
    "type": "number",
    "crud": {
      "before": {
        "create": "disallow",
        "read": "disallow",
        "update": "disallow",
        "delete": "disallow"
      }
    },
    "uria": {
      "tab": "general"
    }
  }, {
    "name": "name",
    "desc": "Name",
    "type": "string",
    "uria": {
      "tab": "general"
    }
  }, {
    "name": "surname",
    "desc": "Surname",
    "type": "string",
    "uria": {
      "tab": "general"
    }
  }, {
    "name": "sex",
    "desc": "Sex",
    "type": "string",
    "role": "sex",
    "uria": {
      "tab": "general"
    }
  }, {
    "name": "birth_date",
    "desc": "Birth date",
    "type": "string",
    "role": "Date",
    "uria": {
      "tab": "general"
    }
  }, {
    "name": "children",
    "desc": "Children@list",
    "base": "person",
    "join": [
      "id",
      "child_id",
      "child_parent",
      "parent_id",
      "id"
    ],
    "type": "object",
    "list": true,
    "uria": {
      "tab": "children"
    },
    "keys": [{
      "name": "id",
      "desc": "Internal identifier",
      "type": "number",
      "role": "persons",
      "uria": {
        "extjs": {
          "width": 100
        }
      }
    }, {
      "name": "name",
      "desc": "Name",
      "type": "string",
      "crud": {
        "before": {
          "update": "disallow"
        }
      },
      "uria": {
        "extjs": {
          "width": 200
        }
      }
    }, {
      "name": "surname",
      "desc": "Surname",
      "type": "string",
      "crud": {
        "before": {
          "update": "disallow"
        }
      }
    }, {
      "name": "sex",
      "desc": "Sex",
      "type": "string",
      "role": "sex",
      "loan": "sex_loan",
      "crud": {
        "before": {
          "update": "disallow"
        }
      },
      "uria": {
        "extjs": {
          "width": 150
        }
      }
    }, {
      "name": "sex_loan",
      "desc": "",
      "type": "string",
      "temp": true
    }, {
      "name": "birth_date",
      "desc": "Birth date",
      "type": "string",
      "role": "Date",
      "crud": {
        "before": {
          "update": "disallow"
        }
      }
    }, {
      "name": "toys",
      "desc": "Toys",
      "base": "toy",
      "join": [
        "person_id",
        "id"
      ],
      "type": "object",
      "list": true,
      "crud": {
        "before": {
          "delete": "set_crud_status",
          "update": "disallow_if_crud_status_equals_d"
        },
        "after": {
          "create": "set_crud_status",
          "update": "set_crud_status"
        }
      },
      "uria": {
        "tab": "children"
      },
      "keys": [{
        "name": "id",
        "desc": "Internal identifier",
        "type": "number",
        "role": "persons",
        "crud": {
          "before": {
            "read": "disallow"
          }
        }
      }, {
        "name": "crud_status",
        "desc": "Status",
        "type": "string",
        "role": "CrudStatus"
      }, {
        "name": "name",
        "desc": "Name@toys",
        "type": "string"
      }, {
        "name": "desc",
        "desc": "Description",
        "type": "string",
        "uria": {
          "extjs": {
            "width": 450
          }
        }
      }, {
        "name": "condition",
        "desc": "Condition",
        "type": "string",
        "from": [
          "Brand new",
          "As good as new",
          "Used",
          "Heavily used"
        ],
        "uria": {
          "extjs": {
            "width": 200
          }
        }
      }]
    }]
  }, {
    "name": "parents",
    "desc": "Parents@list",
    "base": "person",
    "join": [
      "id",
      "parent_id",
      "child_parent",
      "child_id",
      "id"
    ],
    "type": "object",
    "list": true,
    "crud": {
      "before": {
        "delete": "disallow_if_name_equals_Ania"
      }
    },
    "uria": {
      "tab": "parents"
    },
    "keys": [{
      "name": "id",
      "desc": "Internal identifier",
      "type": "number",
      "role": "persons",
      "uria": {
        "extjs": {
          "width": 100
        }
      }
    }, {
      "name": "name",
      "desc": "Name",
      "type": "string",
      "crud": {
        "before": {
          "update": "disallow"
        }
      },
      "uria": {
        "extjs": {
          "width": 200
        }
      }
    }, {
      "name": "surname",
      "desc": "Surname",
      "type": "string",
      "crud": {
        "before": {
          "update": "disallow"
        }
      }
    }, {
      "name": "sex",
      "desc": "Sex",
      "type": "string",
      "role": "sex",
      "loan": "sex_loan",
      "crud": {
        "before": {
          "update": "disallow"
        }
      },
      "uria": {
        "extjs": {
          "width": 150
        }
      }
    }, {
      "name": "sex_loan",
      "desc": "",
      "type": "string",
      "temp": true
    }, {
      "name": "birth_date",
      "desc": "Birth date",
      "type": "string",
      "role": "Date",
      "crud": {
        "before": {
          "update": "disallow"
        }
      }
    }]
  }]
}
```

Proponowany przeze mnie format metadanych opisujących obiekty DTO obejmuje następujące klucze:

1.  `name` (*string*; **wymagane**): nazwa klucza
2.  `desc` (*string*; **wymagane**): opis klucza
3.  `base` (*string*): wskazanie źródła danych dla serwera GODS. Może oznaczać nazwę folderu, pliku lub tabeli
4.  `join` (tablica typu *string*): wskazanie powiązania między źródłami danych. Przykładowo:
    *   `person_id`, `id` oznacza powiązanie kolumny `person_id` tabeli wskazanej kluczem `base` z kolumną `id` tabeli nadrzędnej
    *   `id`, `employee_id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `employee_id` tabeli nadrzędnej
    *   `id`, `child_id`, `child_parent`, `parent_id`, `id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `child_id` tabeli złączeniowej `child_parent` oraz powiązanie kolumny `parent_id` tabeli złączeniowej z kolumną `id` tabeli nadrzędnej (takie złączenie daje listę dzieci)
    *   `id`, `parent_id`, `child_parent`, `child_id`, `parent_id`, `child_parent`, `child_id`, `id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `parent_id` tabeli złączeniowej `child_parent`, powiązanie kolumny `child_id` tabeli złączeniowej z kolumną `parent_id` drugiej tabeli złączeniowej `child_parent` oraz powiązanie kolumny `child_id` drugiej tabeli złączeniowej z kolumną `id` tabeli nadrzędnej (takie złączenie daje listę dziadków)
5.  `msql` (*object*): zapytania Multi SQL (zob. „Krótko o MSQL (nie mylić z MS SQL)”) dla serwera GODS działającego z modułem relacyjnej bazy danych. Może zawierać następujące składowe:
    *   `create` (*string*): zapytanie Multi SQL typu INSERT
    *   `read` (*string*): zapytanie Multi SQL typu SELECT
    *   `update` (*string*): zapytanie Multi SQL typu UPDATE
    *   `delete` (*string*): zapytanie Multi SQL typu DELETE
6.  `type` (*string*): określenie typu danych. Może przyjmować następujące wartości: `boolean`, `number`, `string`, `object`
7.  `role` (*string*): dodatkowe określenie charakteru danych (np. `Date` dla typu `string` lub `number`, albo kod słownika stałego/dynamicznego)
8.  `from` (tablica): lista dozwolonych wartości
9.  `loan` (*string*): wskazanie klucza pomocniczego, z którego można np. „pożyczyć” opis związany z wartością słownikową
10. `null` (*boolean*): określenie wymagalności danych. Może przyjmować następującą wartość: `false`
11. `list` (*boolean*): wskazanie danych tablicowych. Może przyjmować następującą wartość: `true`
12. `temp` (*boolean*): wskazanie klucza roboczego, który nie jest istotny w wymianie danych (np. może to być klucz wskazany przez `loan` w innym kluczu). Może przyjmować następującą wartość: `true`
13. `crud` (*object*): opis akcji, które należy wykonać przed lub po danej operacji CRUD-owej. Może zawierać następujące składowe:
    *   `before` (*object*): opis akcji, które należy wykonać przed wykonaniem danej operacji CRUD-owej. Może zawierać następujące składowe:
        *   `create` (*string*): kod akcji, którą należy wykonać przed dodaniem nowej wartości
        *   `read` (*string*): kod akcji, którą należy wykonać przed wyświetleniem danej wartości
        *   `update` (*string*): kod akcji, którą należy wykonać przed modyfikacją danej wartości
        *   `delete` (*string*): kod akcji, którą należy wykonać przed usunięciem danej wartości
    *   `after` (*object*): opis akcji, które należy wykonać po wykonaniu danej operacji CRUD-owej. Może zawierać następujące składowe:
        *   `create` (*string*): kod akcji, którą należy wykonać po dodaniu nowej wartości
        *   `read` (*string*): kod akcji, którą należy wykonać po wyświetleniu danej wartości
        *   `update` (*string*): kod akcji, którą należy wykonać po modyfikacji danej wartości
        *   `delete` (*string*): kod akcji, którą należy wykonać po usunięciu danej wartości
14. `uria` (*object*): opcjonalny opis dot. interfejsu użytkownika realizowanego przez URIA. Może zawierać następujące składowe:
    *   `tabs` (tablica typu *object*): definicja zakładek, w których grupowane będą poszczególne komponenty (powinna występować jedynie na najwyższym poziomie opisu). Może zawierać następujące składowe:
        *   `name` (*string*; **wymagane**): nazwa zakładki
        *   `desc` (*string*; **wymagane**): opis zakładki
        *   `icon` (*string*; **wymagane**): ikona związana z zakładką
    *   `tab` (*string*): wskazanie nazwy zakładki, w ramach której dany komponent winien zostać umieszczony
    *   `extjs` (*object*): dodatkowa konfiguracja dla ExtJS-owej implementacji URIA
15.  `gods` (*object*): opcjonalny opis dot. serwera GODS
16.  `keys` (tablica typu *object*): opis poszczególnych składowych danego obiektu
17.  `copy` (*string*): wskazanie klucza, który pochodzi z obiektu nadrzędnego
18.  `data`: dane (pozwala wygodnie definiować słowniki stałe)

Przedstawiony tutaj format metadanych opisujących CRUD REST API nazwałem *OKAPI*, bo takie API jest OK!

Tak się „przypadkiem” składa, że okapi to również taki zwierz, jak na miniaturce do tego postu ;)

Ciekawostka: format OKAPI można opisać w formacie OKAPI:

```json
{
  "name": "okapi",
  "desc": "Specyfikacja OKAPI (w formacie OKAPI :)",
  "type": "object",
  "keys": [{
    "name": "name",
    "desc": "nazwa klucza",
    "type": "string",
    "null": false
  }, {
    "name": "desc",
    "desc": "opis klucza",
    "type": "string",
    "null": false
  }, {
    "name": "base",
    "desc": "wskazanie źródła danych dla serwera GODS. Może oznaczać nazwę folderu, pliku lub tabeli",
    "type": "string"
  }, {
    "name": "join",
    "desc": "wskazanie powiązania między źródłami danych. Przykładowo:\n* `person_id`, `id` oznacza powiązanie kolumny `person_id` tabeli wskazanej kluczem `base` z kolumną `id` tabeli nadrzędnej\n* `id`, `employee_id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `employee_id` tabeli nadrzędnej\n* `id`, `child_id`, `child_parent`, `parent_id`, `id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `child_id` tabeli złączeniowej `child_parent` oraz powiązanie kolumny `parent_id` tabeli złączeniowej z kolumną `id` tabeli nadrzędnej (takie złączenie daje listę dzieci)\n* `id`, `parent_id`, `child_parent`, `child_id`, `parent_id`, `child_parent`, `child_id`, `id` oznacza powiązanie kolumny `id` tabeli wskazanej kluczem `base` z kolumną `parent_id` tabeli złączeniowej `child_parent`, powiązanie kolumny `child_id` tabeli złączeniowej z kolumną `parent_id` drugiej tabeli złączeniowej `child_parent` oraz powiązanie kolumny `child_id` drugiej tabeli złączeniowej z kolumną `id` tabeli nadrzędnej (takie złączenie daje listę dziadków)",
    "type": "string",
    "list": true
  }, {
    "name": "msql",
    "desc": "zapytania Multi SQL dla serwera GODS działającego z modułem relacyjnej bazy danych",
    "type": "object",
    "keys": [{
      "name": "create",
      "desc": "zapytanie Multi SQL typu INSERT",
      "type": "string"
    }, {
      "name": "read",
      "desc": "zapytanie Multi SQL typu SELECT",
      "type": "string"
    }, {
      "name": "update",
      "desc": "zapytanie Multi SQL typu UPDATE",
      "type": "string"
    }, {
      "name": "delete",
      "desc": "zapytanie Multi SQL typu DELETE",
      "type": "string"
    }]
  }, {
    "name": "type",
    "desc": "określenie typu danych",
    "type": "string",
    "from": [
      "boolean",
      "number",
      "string",
      "object"
    ]
  }, {
    "name": "role",
    "desc": "dodatkowe określenie charakteru danych (np. `Date` dla typu `string` lub `number`, albo kod słownika stałego/dynamicznego)",
    "type": "string"
  }, {
    "name": "from",
    "desc": "lista dozwolonych wartości",
    "list": true
  }, {
    "name": "loan",
    "desc": "wskazanie klucza pomocniczego, z którego można np. „pożyczyć” opis związany z wartością słownikową",
    "type": "string"
  }, {
    "name": "null",
    "desc": "określenie wymagalności danych",
    "type": "boolean",
    "from": [
      false
    ]
  }, {
    "name": "list",
    "desc": "wskazanie danych tablicowych",
    "type": "boolean",
    "from": [
      true
    ]
  }, {
    "name": "temp",
    "desc": "wskazanie klucza roboczego, który nie jest istotny w wymianie danych (np. może to być klucz wskazany przez `loan` w innym kluczu)",
    "type": "boolean",
    "from": [
      true
    ]
  }, {
    "name": "crud",
    "desc": "opis akcji, które należy wykonać przed lub po danej operacji CRUD-owej",
    "type": "object",
    "keys": [{
      "name": "before",
      "desc": "opis akcji, które należy wykonać przed wykonaniem danej operacji CRUD-owej",
      "type": "object",
      "keys": [{
        "name": "create",
        "desc": "kod akcji, którą należy wykonać przed dodaniem nowej wartości",
        "type": "string"
      }, {
        "name": "read",
        "desc": "kod akcji, którą należy wykonać przed wyświetleniem danej wartości",
        "type": "string"
      }, {
        "name": "update",
        "desc": "kod akcji, którą należy wykonać przed modyfikacją danej wartości",
        "type": "string"
      }, {
        "name": "delete",
        "desc": "kod akcji, którą należy wykonać przed usunięciem danej wartości",
        "type": "string"
      }]
    }, {
      "name": "after",
      "desc": "opis akcji, które należy wykonać po wykonaniu danej operacji CRUD-owej",
      "type": "object",
      "keys": [{
        "name": "create",
        "desc": "kod akcji, którą należy wykonać po dodaniu nowej wartości",
        "type": "string"
      }, {
        "name": "read",
        "desc": "kod akcji, którą należy wykonać po wyświetleniu danej wartości",
        "type": "string"
      }, {
        "name": "update",
        "desc": "kod akcji, którą należy wykonać po modyfikacji danej wartości",
        "type": "string"
      }, {
        "name": "delete",
        "desc": "kod akcji, którą należy wykonać po usunięciu danej wartości",
        "type": "string"
      }]
    }]
  }, {
    "name": "uria",
    "desc": "opcjonalny opis dot. interfejsu użytkownika realizowanego przez URIA",
    "type": "object",
    "keys": [{
      "name": "tabs",
      "desc": "definicja zakładek, w których grupowane będą poszczególne komponenty (powinna występować jedynie na najwyższym poziomie opisu)",
      "type": "object",
      "list": true,
      "keys": [{
        "name": "name",
        "desc": "nazwa zakładki",
        "type": "string",
        "null": false
      }, {
        "name": "desc",
        "desc": "opis zakładki",
        "type": "string",
        "null": false
      }, {
        "name": "icon",
        "desc": "ikona związana z zakładką",
        "type": "string",
        "null": false
      }]
    }, {
      "name": "tab",
      "desc": "wskazanie nazwy zakładki, w ramach której dany komponent winien zostać umieszczony",
      "type": "string"
    }, {
      "name": "extjs",
      "desc": "dodatkowa konfiguracja dla ExtJS-owej implementacji URIA",
      "type": "object"
    }]
  }, {
    "name": "gods",
    "desc": "opcjonalny opis dot. serwera GODS",
    "type": "object"
  }, {
    "name": "keys",
    "desc": "opis poszczególnych składowych danego obiektu",
    "type": "object",
    "list": true,
    "copy": "keys"
  }, {
    "name": "copy",
    "desc": "wskazanie klucza, który pochodzi z obiektu nadrzędnego",
    "type": "string"
  }, {
    "name": "data",
    "desc": "dane (pozwala wygodnie definiować słowniki stałe)"
  }]
}
```

# Aktualizacja

Obecnie JSON-owy format OKAPI został zastąpiony przez format à la OKAPI wykorzystujący pliki Markdown. Szczegóły w poście pt. „URIA bez OKAPI”.
