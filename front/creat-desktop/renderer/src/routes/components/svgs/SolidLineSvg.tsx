type Props = {
  width: string | number
  height: string | number
}

export default function SolidLineSvg(options: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      className=""
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...options}
    >
      <path
        d="M4.167 10h11.666"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
