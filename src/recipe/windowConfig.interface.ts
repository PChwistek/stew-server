export interface WindowConfig {
  readonly tabs: Array<TabConfig>
}

export interface TabConfig {
  readonly favIconUrl: string
  readonly url: string
  readonly title: string
  readonly index: number
}