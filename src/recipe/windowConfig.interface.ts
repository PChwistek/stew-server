export interface WindowConfig {
  readonly tabs: Array<TabConfig>
}

export interface TabConfig {
  readonly favIconUrl: string
  readonly index: number
  readonly title: string
  readonly url: string
}