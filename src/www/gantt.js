import { c, h, s } from '../../dist/nnn.js'

document.title = 'nnn • Gantt Chart Demo'

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24
const PIXELS_PER_DAY = 42

/**
 * @typedef {{
 *   name:          string;
 *   color:         string;
 *   duration:      number;
 *   start?:        number;
 *   finish?:       number;
 *   startPx?:      number;
 *   finishPx?:     number;
 *   predecessors?: Partial<Array<number>>;
 * }} Task
 */

const /** @type {Partial<Array<Task>>} */ tasks = [{
  name: 'Start', start: +new Date('2006-07-24'), duration: 0, color: '#e22'
}, {
  name: 'a', predecessors: [0], duration: 4, color: '#e73'
}, {
  name: 'b', predecessors: [0], duration: 5.33 + 2, color: '#fc3'
}, {
  name: 'c', predecessors: [1], duration: 5.17 + 2, color: '#ad4'
}, {
  name: 'd', predecessors: [1], duration: 6.33 + 4, color: '#4d9'
}, {
  name: 'e', predecessors: [2, 3], duration: 5.17 + 2, color: '#3be'
}, {
  name: 'f', predecessors: [4], duration: 4.5, color: '#45d'
}, {
  name: 'g', predecessors: [5], duration: 5.17 + 2, color: '#c3e'
}, {
  name: 'Finish', predecessors: [6, 7], duration: 0, color: '#e22'
}]

const midnight = (/** @type {number} */ timestamp, /** @type {number} */ days) => {
  const date = new Date(timestamp)

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days)
}

tasks.forEach(task => {
  if (task != null) {
  // @ts-expect-error
    task.start = task.start ?? Math.max(...(task.predecessors ?? []).map(predecessor => tasks[predecessor].finish))
    task.finish = task.start + MILLISECONDS_PER_DAY * task.duration
  }
})

// @ts-expect-error
let start = midnight(Math.min(...tasks.map(task => task.start)), -1)
// @ts-expect-error
const finish = midnight(Math.max(...tasks.map(task => task.finish)), 1)
const startPx = Math.round(PIXELS_PER_DAY * start / MILLISECONDS_PER_DAY)
const finishPx = Math.round(PIXELS_PER_DAY * finish / MILLISECONDS_PER_DAY)

// @ts-expect-error
tasks.forEach((/** @type {Required<Task>} */ task) => {
  task.startPx = Math.round(PIXELS_PER_DAY * (task.start) / MILLISECONDS_PER_DAY) - startPx
  task.finishPx = Math.round(PIXELS_PER_DAY * (task.finish) / MILLISECONDS_PER_DAY) - startPx
})

const /** @type {import('../nnn/h.js').HArgs} */ svg = ['svg', {
  viewBox: `0 0 ${finishPx - startPx} ${42 * tasks.length - 10}`,
  width: `${finishPx - startPx}px`,
  height: `${42 * tasks.length - 10}px`
}]

while (start < finish) {
  const date = new Date(start)
  const weekDay = date.getUTCDay()

  svg.push(['rect', {
    fill: weekDay === 6 ? '#eef' : weekDay === 0 ? '#fee' : '#fff',
    stroke: '#000',
    'stroke-opacity': 0.2,
    x: Math.round(PIXELS_PER_DAY * start / MILLISECONDS_PER_DAY) - startPx,
    y: -2,
    width: PIXELS_PER_DAY,
    height: 42 * tasks.length + 4
  }
  ])
  start += MILLISECONDS_PER_DAY
}

tasks.forEach((task, t) => (task?.predecessors ?? []).forEach(p => svg.push(
  ['path', {
    // @ts-expect-error
    d: `M${tasks[p].finishPx},${42 * p + 16}Q${tasks[p].finishPx + 32},${42 * p + 16},${tasks[p].finishPx},${21 * (t + p) + 16}T${tasks[p].finishPx},${42 * t + 16}L${task.startPx},${42 * t + 16}`,
    stroke: task?.color,
    'fill-opacity': 0,
    'stroke-linejoin': 'round',
    'stroke-width': 2
  }],
  ['path', {
    d: `M${task?.startPx},${42 * t + 16}l-10,-4v8z`,
    stroke: task?.color,
    fill: task?.color,
    'stroke-linejoin': 'round',
    'stroke-width': 2
  }]
)))

// @ts-expect-error
tasks.forEach((/** @type {Required<Task>} */ task, t) => {
  const /** @type {Partial<Record<PropertyKey, unknown>>} */ bgAttributes = { fill: '#fff', rx: 3 }
  const /** @type {Partial<Record<PropertyKey, unknown>>} */ rectAttributes = {
    rx: 3,
    'stroke-width': 2,
    stroke: task.color,
    fill: task.color,
    'fill-opacity': 0.84
  }
  const /** @type {import('../nnn/h.js').HArgs1} */ bg = ['rect', bgAttributes]
  const /** @type {import('../nnn/h.js').HArgs1} */ rect = ['rect', rectAttributes, ['title', task.name]]

  if (task.finish !== task.start) {
    bgAttributes.width = rectAttributes.width = task.finishPx - task.startPx
    bgAttributes.height = rectAttributes.height = 32
    bgAttributes.x = rectAttributes.x = task.startPx
    bgAttributes.y = rectAttributes.y = 42 * t
  } else {
    bgAttributes.width = rectAttributes.width = 22
    bgAttributes.height = rectAttributes.height = 22
    bgAttributes.x = rectAttributes.x = task.startPx - 11 * task.duration
    bgAttributes.y = rectAttributes.y = 42 * t
    bgAttributes.transform = rectAttributes.transform = `rotate(45 ${task.startPx} ${42 * t})`
  }

  svg.push(bg, rect,
    ['text', {
      fill: '#111',
      'fill-opacity': 0.75,
      x: (task.startPx + task.finishPx) / 2,
      y: 42 * t + 21,
      $style: {
        fontFamily: 'Arial,Helvetica,sans-serif',
        fontSize: '12px',
        fontWeight: 'bold',
        textAnchor: 'middle',
        userSelect: 'none'
      }
    }, task.name])
})

const href = 'https://en.wikipedia.org/wiki/Gantt_chart#Example'

h(document.body,
  ['style', c({
    body: { padding: '20px' }
  })],
  ['h1', 'Gantt chart'],
  ['p', 'Conf. ', ['code', ['a', { href }, href]]],
  s(...svg))
