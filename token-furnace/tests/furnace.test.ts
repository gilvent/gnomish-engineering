import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  plugin: 'token-furnace',
  surface: 'terminal',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 9 },
    view: {},
  },
} as const
const START = { surface: 'terminal', isInteractive: true, cwd: '/work' } as const
const TURN = { answer: 'ok', durationMs: 1, isAborted: false, turnId: 't1', reason: 'answer' } as const

function standIn(on: On, context: { tokens: number }) {
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.usage', () => ({
    value: {
      startedAt: 0,
      rateLimits: [],
      context: { tokens: context.tokens, window: 200_000, percent: Math.round(context.tokens / 2_000) },
    },
  }))
  on('turn.complete', (_$, e) => ({ text: e.answer }))
  on('ui.render', ($, e) => $.ui.resolve(e).Text({ children: 'the band beneath' }))
}

test('the furnace burns hotter as the context window fills', async ($, on) => {
  const context = { tokens: 36_100 }
  standIn(on, context)

  await $.session.start(START)
  const ui = await $.ui.mount(BAND)
  const furnaces = async () => (await ui.findAll({ type: 'Image' })).map(image => image.props.source)

  expect(await ui.find({ type: 'Text', text: /Embers/ })).toBeDefined()
  expect(await furnaces()).toEqual([{ file: expect.stringMatching(/\/assets\/embers\.png$/), format: 'png' }])

  context.tokens = 134_400
  await $.turn.complete(TURN)

  expect(await ui.find({ type: 'Text', text: /Blazing/ })).toBeDefined()
  expect(await furnaces()).toEqual([{ file: expect.stringMatching(/\/assets\/blazing\.png$/), format: 'png' }])
  expect(await ui.find({ type: 'Text', text: /67% of context/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /134\.4k \/ 200k/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /▲ \+98\.3k stoked last turn/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /the band beneath/ })).toBeDefined()
  await ui.unmount()
})

test('a narrow band keeps the heat and drops the chart', async ($, on) => {
  standIn(on, { tokens: 184_000 })

  await $.session.start(START)
  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, bodyColumns: 40 } })

  expect(await ui.find({ type: 'Text', text: /Meltdown, compact soon/ })).toBeDefined()
  expect(await ui.findAll({ type: 'Text', text: /last turns/ })).toEqual([])
  await ui.unmount()
})

test('a subagent finishing adds no reading', async ($, on) => {
  const context = { tokens: 36_100 }
  standIn(on, context)

  await $.session.start(START)
  context.tokens = 134_400
  await $.turn.complete({ ...TURN, agentId: 'agent-1' })
  const ui = await $.ui.mount(BAND)

  expect(await ui.find({ type: 'Text', text: /18% of context/ })).toBeDefined()
  await ui.unmount()
})
