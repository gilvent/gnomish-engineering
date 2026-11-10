import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { FurnaceReading } from '../types'

const HISTORY = 12
const WIDE_COLUMNS = 60
const ICON_CELLS = { columns: 4, rows: 2 }
const FLAMES = '▁▂▃▄▅▆▇█'
const HEATS = [
  { upTo: 25, sprite: 'embers', word: 'Embers', color: '#94A3B8' },
  { upTo: 50, sprite: 'kindled', word: 'Kindled', color: '#FACC15' },
  { upTo: 75, sprite: 'blazing', word: 'Blazing', color: '#FB923C' },
  { upTo: 90, sprite: 'white-hot', word: 'White-hot', color: '#F97316' },
] as const
const MELTDOWN = { sprite: 'meltdown', word: 'Meltdown, compact soon', color: '#EF4444' } as const

const readings = atom({ plugin: 'token-furnace', key: 'readings' } as const, [])

async function takeReading($: EngineInterface) {
  const { context } = await $.session.usage()

  if (!context?.window) {
    return
  }

  const tokens = context.tokens ?? 0
  const percent = context.percent ?? Math.round((tokens / context.window) * 100)
  const reading: FurnaceReading = { tokens, window: context.window, percent }

  await update($, readings, history => [...history, reading].slice(-HISTORY))
}

function short(n: number) {
  if (n >= 1_000_000) {
    return `${+(n / 1_000_000).toFixed(1)}M`
  }

  return n >= 1_000 ? `${+(n / 1_000).toFixed(1)}k` : String(n)
}

function flames(history: readonly FurnaceReading[]) {
  const top = Math.max(...history.map(reading => reading.tokens), 1)

  return history.map(reading => FLAMES[Math.floor((reading.tokens / top) * (FLAMES.length - 1))]).join('')
}

function stoked(delta: number) {
  if (delta === 0) {
    return '  steady burn'
  }

  return delta > 0 ? `  ▲ +${short(delta)} stoked last turn` : `  ▼ ${short(-delta)} raked out last turn`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    await takeReading($)

    return started
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)

    if (e.agentId === undefined) {
      await takeReading($)
    }

    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const history = await read($, readings)
    const now = history.at(-1)

    if (e.props.hasSurvey || now === undefined) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const previous = history.at(-2)
    const heat = HEATS.find(tier => now.percent < tier.upTo) ?? MELTDOWN
    const isWide = e.props.bodyColumns >= WIDE_COLUMNS

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" paddingX={1}>
          {e.surface === 'terminal' &&
            h($.ui.resolve(e).Image, {
              key: 'furnace',
              source: { file: `${$.plugin.root}/assets/${heat.sprite}.png`, format: 'png' },
              alt: ' ',
              ...ICON_CELLS,
            })}
          <Box flexDirection="column" paddingLeft={1}>
            <Text color={heat.color} bold>
              {heat.word}
            </Text>
            <Box flexDirection="row">
              <Text>{`${now.percent}% of context`}</Text>
              <Text dimColor>{`  ${short(now.tokens)} / ${short(now.window)}`}</Text>
              {isWide && <Text dimColor>{'   last turns '}</Text>}
              {isWide && <Text color={heat.color}>{flames(history)}</Text>}
              {isWide && previous !== undefined && <Text dimColor>{stoked(now.tokens - previous.tokens)}</Text>}
            </Box>
          </Box>
        </Box>
        {await next(e)}
      </Box>
    )
  })
}
