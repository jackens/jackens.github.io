# Nogi stonogi

*2019-07-07*

Moja latorośl jest już całkiem mądrą dziewczynką i bardzo fajnie gra się z nią w różne gry planszowe. Jedną z jej ulubionych gier są „nogi stonogi”. Postanowiłem więc napisać solver dla tej gry, czyli aplikację, która dla podanego stanu gry wyznacza optymalną strategię następnego ruchu gracza. Chciałem byśmy zagrali całą rodziną i dodatkowym graczem, którym byłaby owa aplikacja. W ten sposób chciałem przybliżyć córci możliwości programowania no i trochę jej zaimponować…

> ### Krótkie omówienie zasad gry „nogi stonogi”
>
> Rekwizyty gry:
> * 4 kostki; na poszczególnych ściankach kostek znajdują się kolory: czerwony, żółty, zielony, niebieski, czarny i joker zastępujący dowolny kolor.
> * 4 czerwone nogi, 3 czerwone nogi, 2 czerwone nogi
> * 4 żółte nogi, 3 żółte nogi, 2 żółte nogi
> * 4 zielone nogi, 3 zielone nogi, 2 zielone nogi
> * 4 niebieskie nogi, 3 niebieskie nogi, 2 niebieskie nogi
> * 4 czarne nogi, 3 czarne nogi, 2 czarne nogi
>
> W grze bierze udział od 2 do 4 graczy.
>
> W ramach ruchu, gracz najpierw rzuca *wszystkimi czterema* kostkami. Jeśli wyrzucone kolory odpowiadają dostępnej w puli liczbie nóg danego koloru to gracz może zabrać te nogi powiększając swoją stonogę. Może też rzucić ponownie *wybranymi* przez siebie kostkami i wówczas zabrać z puli jakąś nagrodę lub też rzucić ostatni, trzeci raz *wybranymi* kostkami i dopiero po tym trzecim rzucie zabrać z puli jakąś nagrodę.
>
> Celem gry jest „wyhodowanie” jak najdłuższej stonogi. Gra kończy się, gdy w puli nie ma już żadnych nagród do zdobycia.

Jasnym jest, że optymalna strategia różni się w zależności od ilości pozostałych rzutów. Przykładowo, w układzie zobrazowanym na powyższym obrazku, warto rzucić tylko kostką z wyrzuconym kolorem żółtym, jeśli pozostały jeszcze dwa możliwe rzuty, lecz w przypadku pozostałego ostatniego rzutu lepiej rzucić wszystkimi kostkami. Widać więc, że nie obejdzie się od programowania dynamicznego i zastosowania rekurencji.

Ochoczo zabrałem się do programowania. Oczywiście w języku JavaScript. Jako opis stanu gry przyjąłem sekwencję piętnastu wartości boolowskich określających dostępność w puli każdej z piętnastu nagród; sekwencję czterech wartości ze zbioru $\{0, 1, 2, 3, 4, 5\}$ oznaczających aktualne kolory każdej z czterech kostek (0: joker, 1: czerwony, 2: żółty, 3: zielony, 4: niebieski, 5: czarny); liczbę 1 lub 2 oznaczającą ilość pozostałych w danej turze rzutów. I to był błąd…

Mój pierwszy solver napisany w języku JavaScript działał koszmarnie wolno dla przypadku wyznaczania optymalnej strategi, gdy pozostały jeszcze dwie możliwości rzutu kostkami. Interfejs aplikacji zamierał na ok. 5 sek — to koszmarnie dużo! Ta wersja solver-a rozegrała z nami kilka gier, ale wstyd było jej dalej używać…

Pomyślałem więc, że to znak, by poćwiczyć technologię *WebAssembly* i przepisać solver w języku *rust*. Tak też zrobiłem. Napisałem (prawdopodobnie pokracznie) swój pierwszy program w języku rust. Poniżej jego kod źródłowy zamieszczony tutaj, abym w przyszłości mógł obejrzeć jak fatalne były moje początki z rust-em:

```rust
const JOKER:  usize = 0;
const RED:    usize = 1;
const YELLOW: usize = 2;
const GREEN:  usize = 3;
const BLUE:   usize = 4;
const BLACK:  usize = 5;
const COLORS: [usize; 5] = [RED, YELLOW, GREEN, BLUE, BLACK];
const COLORS_AND_JOKER: [usize; 6] = [JOKER, RED, YELLOW, GREEN, BLUE, BLACK];

const ROLL: bool = false;
const KEEP: bool = true;
const ACTIONS: [bool; 2] = [KEEP, ROLL];

pub fn _calculate_best_award(awards_state: [[bool; 5]; 3], colors_state: [usize; 4]) -> usize {
  let mut count: [usize; 6] = [0; 6];
  for color in colors_state.iter() {
    count[*color] += 1;
  }
  for color in COLORS.iter() {
    count[*color] += count[JOKER];
  }
  for (award_index, states) in awards_state.iter().enumerate() {
    for (color_index, state) in states.iter().enumerate() {
      if *state && count[color_index] == 4 - award_index {
        return 4 - award_index;
      }
    }
  }
  return 0;
}

pub fn _calculate_best_score_and_best_actions(awards_to_get: [[bool; 5]; 3], colors_state: [usize; 4], chances: usize) -> (usize, [bool; 4]) {
  let mut best_score: usize = 0;
  let mut best_actions: [bool; 4] = [ROLL, ROLL, ROLL, ROLL];
  for action_0 in ACTIONS.iter() {
    for action_1 in ACTIONS.iter() {
      for action_2 in ACTIONS.iter() {
        for action_3 in ACTIONS.iter() {
          let mut score = 0;
          let actions = [*action_0, *action_1, *action_2, *action_3];

          let colors_0 = if *action_0 == ROLL { COLORS_AND_JOKER.to_vec() } else { vec![colors_state[0]] };
          let colors_1 = if *action_1 == ROLL { COLORS_AND_JOKER.to_vec() } else { vec![colors_state[1]] };
          let colors_2 = if *action_2 == ROLL { COLORS_AND_JOKER.to_vec() } else { vec![colors_state[2]] };
          let colors_3 = if *action_3 == ROLL { COLORS_AND_JOKER.to_vec() } else { vec![colors_state[3]] };

          for color_0 in colors_0.iter() {
            for color_1 in colors_1.iter() {
              for color_2 in colors_2.iter() {
                for color_3 in colors_3.iter() {
                  let current_colors_state: [usize; 4] = [*color_0, *color_1, *color_2, *color_3];
                  let award = _calculate_best_award(awards_to_get, current_colors_state);
                  let possibilities = (7 - colors_0.len()) * (7 - colors_1.len()) * (7 - colors_2.len()) * (7 - colors_3.len());
                  if chances == 1 {
                    score += possibilities * award;
                  } else {
                    let subresults = _calculate_best_score_and_best_actions(awards_to_get, current_colors_state, chances - 1);
                    score += possibilities * award * subresults.0;
                  }
                }
              }
            }
          }

          if best_score < score {
            best_score = score;
            best_actions = actions;
          }
        }
      }
    }
  }

  return (best_score, best_actions);
}

pub fn calculate_best_actions(
  red_award_4: bool, yellow_award_4: bool, green_award_4: bool, blue_award_4: bool, black_award_4: bool,
  red_award_3: bool, yellow_award_3: bool, green_award_3: bool, blue_award_3: bool, black_award_3: bool,
  red_award_2: bool, yellow_award_2: bool, green_award_2: bool, blue_award_2: bool, black_award_2: bool,
  color_0: usize, color_1: usize, color_2: usize, color_3: usize,
  chances: usize
) -> String {
  let awards_to_get: [[bool; 5]; 3] = [
    [red_award_4, yellow_award_4, green_award_4, blue_award_4, black_award_4],
    [red_award_3, yellow_award_3, green_award_3, blue_award_3, black_award_3],
    [red_award_2, yellow_award_2, green_award_2, blue_award_2, black_award_2],
  ];

  let colors_state = [color_0, color_1, color_2, color_3];
  let (_best_score, best_actions) = _calculate_best_score_and_best_actions(awards_to_get, colors_state, chances);

  return format!("{},{},{},{}", best_actions[0], best_actions[1], best_actions[2], best_actions[3]);
}

#[test]
fn test() {
  assert_eq!(
    calculate_best_actions(
      false, false,  true, false, false,
      false, false, false, false, false,
       true,  true, false,  true,  true,
       GREEN, GREEN, GREEN, YELLOW,
       2
    ),
    "true,true,true,false"
  );
  assert_eq!(
    calculate_best_actions(
      false, false,  true, false, false,
      false, false, false, false, false,
       true,  true, false,  true,  true,
       GREEN, GREEN, GREEN, YELLOW,
       1
    ),
    "false,false,false,false"
  );
}

```

Wykonanie polecenia

```sh
time cargo test
```

na nie najgorszym laptopie z czterordzeniowym procesorem Intel Core i7 siódmej generacji, taktowanym częstotliwością 2.70 GHz, z 8GB RAM, i dyskiem SSD wymaga mniej-więcej 5 (magicznych) sekund… Mój kod JavaScript okazał się podobnie zły jak kod natywny napisany w języku rust!

To wyraźny znak, że moje programowanie było zbyt nonszalanckie. Pomijając ilość pozostałych w danej turze rzutów, w przyjętym opisie stanu gry, mamy $2^{15}\times6^4=42\,467\,328$ możliwych stanów. To całkiem sporo. Nie specjalnie można stablicować wyniki dla wszystkich możliwych stanów. Konieczna była więc jakaś solidna optymalizacja.

Jak się nad tym zastanowić, to przykładowo, strategia w przypadku puli nagród zawierającej 4 zielone nogi, 2 czerwone nogi, 2 żółte nogi, 2 niebieskie nogi i 2 czarne nogi oraz przy kostkach z wyrzuconymi kolorami zielonym, zielonym, zielonym i żółtym, niewiele różni się np. od strategii dla puli nagród zawierającej 4 żółte nogi, 2 czerwone nogi, 2 zielone nogi, 2 niebieskie nogi i 2 czarne nogi oraz kostkach z wyrzuconymi kolorami żółtym, żółtym, żółtym i zielonym. Innymi słowy, z opisu stanu gry uwzględniającego wszystkie możliwości należy przejść do klas abstrakcji takich możliwości względem naturalnej relacji równoważności poszczególnych stanów.

Takie klasy abstrakcji można opisać jako liczbę wyrzuconych jokerów, oraz pięć par określających dostępne w puli nagrody danego koloru oraz ilość wyrzuconych kostek danego koloru. Aby zliczyć różne klasy abstrakcji takich opisów napisałem prosty skrypt:

```js
#!/usr/bin/env node

const fs = require('fs')

const AWARDS = ['0', '2', '3', '4', '5', '6', '7', '9']
const COLORS = [0, 1, 2, 3, 4, 5]

const states = {}

AWARDS.forEach(a1 => {
  AWARDS.forEach(a2 => {
    AWARDS.forEach(a3 => {
      AWARDS.forEach(a4 => {
        AWARDS.forEach(a5 => {
          COLORS.forEach(d0 => {
            COLORS.forEach(d1 => {
              COLORS.forEach(d2 => {
                COLORS.forEach(d3 => {
                  const c = [0, 0, 0, 0, 0, 0];
                  [d0, d1, d2, d3].forEach(i => c[i]++)
                  states[c[0] + [a1 + c[1], a2 + c[2], a3 + c[3], a4 + c[4], a5 + c[5]].sort().reverse().join('')] = 1
                })
              })
            })
          })
        })
      })
    })
  })
})

fs.writeFileSync('nogi-stonogi.data', Object.keys(states).sort().join('\n'))
```

Klasy abstrakcji stanów są opisane w formacie

$$j\quad a_1\quad c_1\quad a_2\quad c_2\quad a_3\quad c_3\quad a_4\quad c_4\quad a_5\quad c_5,$$

gdzie $j$ oznacza ilość wyrzuconych jokerów, $a_1$ oznacza sumę nagród *pierwszego* z kolorów, $c_1$ oznacza ilość kostek z wyrzuconym pierwszym kolorem, itd., przy czym wartości $a_1c_1,…,a_5c_5$ są posortowane malejąco względem porządku leksykograficznego.

W wyniku działania powyższego skryptu powstał plik `nogi-stonogi.data` liczący (jedynie!) $52\,680$ linii. To ponad 800 razy mniej od liczby wszystkich możliwych stanów! Taką liczbę abstrakcyjnych stanów można już z powodzeniem stablicować!

Poniżej prosty skrypt wyznaczający strategie dla wszystkich możliwych stanów abstrakcyjnych:

```js
#!/usr/bin/env node

const fs = require('fs')

const JOKER = 0
const COLORS = [JOKER, 1, 2, 3, 4, 5]

const ROLL = '0'
const ACTIONS = ['1', ROLL]

const answers = {}

const awards = {
  94: 4, 93: 3, 92: 2,
  74: 4, 73: 3,
  64: 4, 63: 2, 62: 2,
  54: 3, 53: 3, 52: 2,
  44: 4,
  34: 3, 33: 3,
  24: 2, 23: 2, 22: 2
}

const calculateBestAnswerAndScore = (state, chances) => {
  let score = 0
  let answer = '0'
  if (!chances) {
    score = [1, 2, 3, 4, 5].map(i => awards[state[2 * i - 1] + (+state[2 * i] + +state[0])] || 0).sort()[4]
  } else {
    ACTIONS.forEach(a0 => {
      ACTIONS.forEach(a1 => {
        ACTIONS.forEach(a2 => {
          ACTIONS.forEach(a3 => {
            const d = '012345'.split('').map(i => i.repeat(+state[2 * +i])).join('').split('').map(i => +i)
            let tmpScore = 0;
            (a0 === ROLL ? COLORS : [d[0]]).forEach((d0, _, D0) => {
              (a1 === ROLL ? COLORS : [d[1]]).forEach((d1, _, D1) => {
                (a2 === ROLL ? COLORS : [d[2]]).forEach((d2, _, D2) => {
                  (a3 === ROLL ? COLORS : [d[3]]).forEach((d3, _, D3) => {
                    const c = [0, 0, 0, 0, 0, 0];
                    [d0, d1, d2, d3].forEach(i => (c[i]++))
                    const tmpState = c[0] + [
                      '' + state[1] + c[1],
                      '' + state[3] + c[2],
                      '' + state[5] + c[3],
                      '' + state[7] + c[4],
                      '' + state[9] + c[5]
                    ].sort().reverse().join('')
                    tmpScore += answers[tmpState][chances - 1].score *
                      (7 - D0.length) * (7 - D1.length) * (7 - D2.length) * (7 - D3.length)
                  })
                })
              })
            })
            if (score < tmpScore) {
              score = tmpScore
              answer = parseInt(a0 + a1 + a2 + a3, 2).toString(16).toUpperCase()
            }
          })
        })
      })
    })
  }
  return { answer, score }
}

fs.readFileSync('nogi-stonogi.data', 'utf8').toString().replace(/\r/g, '').split('\n')
  .forEach(state => (answers[state] = []));

[0, 1, 2].forEach(chances => {
  fs.readFileSync(`nogi-stonogi.${chances}`, 'utf8').toString().replace(/\r/g, '').split('\n').forEach(line => {
    const [, state, answer, score] = line.match(/^(\d{11}),(.+),(.+)$/i) || []
    if (state && answer && score) {
      answers[state][chances] = { answer, score }
    }
  })
  Object.keys(answers).forEach(state => {
    if (!answers[state][chances]) {
      const { answer, score } = answers[state][chances] = calculateBestAnswerAndScore(state, chances)
      fs.appendFileSync(`nogi-stonogi.${chances}`, state + ',' + answer + ',' + score + '\n')
    }
  })
})

fs.writeFileSync('nogi-stonogi.txt',
  Object.keys(answers).map(state => state + answers[state][1].answer + answers[state][2].answer).join('\n'))
```

Powyższy skrypt stanowi *prawidłowe* zastosowanie programowania dynamicznego — rekurencja na każdym poziomie większym od 0 wymaga takiego samego czasu obliczeń!

Spodziewałem się długiego czasu wykonania, dlatego skrypt zapisywał natychmiastowo wszystkie wyniki cząstkowe w systemie plików, tak by można było przerwać jego wykonywanie w dowolnym momencie bez utraty wyników wykonanych obliczeń oraz wznowić go w innym dogodnym momencie. Czas wykonania nie okazał się jednak aż tak tragiczny — na laptopie z czterordzeniowym procesorem Intel Core siódmej generacji, taktowanym częstotliwością 2.70 GHz, z 8GB RAM i dyskiem SSD, wykonywał się niespełna 42 minuty.

(Należy zaznaczyć, że mimo, iż procesor miał 4 rdzenie, to powyższy kod JavaScript i tak wykorzystuje tylko jeden rdzeń…)

Na komputerze stacjonarnym z czterordzeniowym procesorem Intel Core i5 siódmej generacji, taktowanym częstotliwością 3.40 GHZ, z 16 GB RAM i dyskiem SSD obliczenia wymagały się niespełna 5 minut.

Na laptopie/tablecie *HP Pavilion x2*, z dwurdzeniowym procesorem Intel Atom x5 Z8350, taktowanym częstotliwością 1.44 GHz, z 2 GB RAM i dyskiem SSD nie odważyłem się uruchamiać skryptu…

Finalna wersja solver-a, wykorzystuje przeliczone i stablicowane wyniki dla wszystkich możliwych klas abstrakcji stanów. Poza tym, kod solver-a realizuje jedynie prosty interfejs aplikacji (z metadanymi dla PWA). Interfejs wykorzystuje pradawną technikę nadawania obrazkowi koloru poprzez kolor tła, tzn. grafiki mają biały kolor i przezroczyste obszary przez które widoczny jest kolor tła. Pozwala to na zredukowanie liczby wymaganych grafik, a przy tym daje możliwość łatwej zmiany kolorów.

W pierwszej grze solver odniósł on sukces! Generalnie, wygląda jednak na to, że strategia optymalna niewiele różni się od strategi przyjmowanej przez (rozumnego) człowieka. Dodając do tego niewytłumaczalne szczęście mojej córeczki w rzucaniu kośćmi, spodziewam się, że w ostatecznym rozrachunku to ona nadal będzie najczęściej wygrywać…

Solver jest dostępny pod adresem <https://jackens.github.io/app/nogi-stonogi/>.

Do przeczytania!
