type Props = {
  width: string | number
  height: string | number
}

export default function DotLineSvg(options: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      className=""
      strokeWidth="2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...options}
    >
      <g strokeWidth="2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12h2" />
        <path d="M17 12h2" />
        <path d="M11 12h2" />
      </g>
    </svg>
  )
}
