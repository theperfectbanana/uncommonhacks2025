import { extendTheme } from "@chakra-ui/react"
import "@fontsource/ibm-plex-mono"

const theme = extendTheme({
  fonts: {
    heading: `'IBM Plex Mono', sans-serif`,
    body: `'IBM Plex Mono', sans-serif`,
  },
})

export default theme
