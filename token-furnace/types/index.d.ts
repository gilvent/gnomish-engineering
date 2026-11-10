export type FurnaceReading = {
  tokens: number
  window: number
  percent: number
}

declare module 'claude-code' {
  interface PluginState {
    'token-furnace': { readings: FurnaceReading[] }
  }
}
