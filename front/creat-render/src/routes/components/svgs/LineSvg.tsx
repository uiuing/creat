type Props = {
  width: string | number
  height: string | number
  fill: string
}

export default function LineSvg(options: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...options}>
      <path d="M640 255.841C640 277.929 621.929 296 599.844 296H39.841C17.93 296 0 278.07 0 256.156C0 234.071 18.071 216 40.156 216H600.159C622.163 216 640 233.837 640 255.841Z" />
    </svg>
  )
}
