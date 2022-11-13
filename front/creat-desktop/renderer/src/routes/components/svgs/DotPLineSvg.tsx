type Props = {
  width: string | number
  height: string | number
}

export default function DotPLineSvg(options: Props) {
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
        <path d="M4 12v.01" />
        <path d="M8 12v.01" />
        <path d="M12 12v.01" />
        <path d="M16 12v.01" />
        <path d="M20 12v.01" />
      </g>
    </svg>
  )
}
