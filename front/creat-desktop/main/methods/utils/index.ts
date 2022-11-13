import { screen } from 'electron'

import { AutoScreenSize } from './types'

export function autoScreenSize(): AutoScreenSize {
  const auto: AutoScreenSize = { width: 1280, height: 720 }
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  if (width <= auto.width || height <= auto.height) {
    auto.width = Math.floor(width * 0.625)
    auto.height = Math.floor(auto.width * 0.625)
  }
  return auto
}
