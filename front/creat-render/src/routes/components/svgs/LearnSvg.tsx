type Props = {
  width: string | number
  height: string | number
  fill: string
}

export default function LearnSvg(options: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" {...options}>
      <path d="M623.953 136.914L341.215 35.684C327.482 30.773 312.518 30.773 298.785 35.684L16.047 136.914C6.438 140.352 0 149.617 0 160S6.438 179.648 16.047 183.086L76.008 204.555C64.121 220.359 55.811 238.734 51.518 258.531C40.047 263.395 32 274.758 32 288C32 297.953 36.814 306.488 43.939 312.359L19.105 461.367C17.48 471.121 25 480 34.887 480H93.113C103 480 110.52 471.121 108.895 461.367L84.061 312.359C91.186 306.488 96 297.953 96 288C96 277.707 90.826 268.969 83.277 263.113C87.529 245.352 96.154 229.289 108.213 216.086L298.785 284.316C312.518 289.227 327.482 289.227 341.215 284.316L623.953 183.086C633.562 179.648 640 170.383 640 160S633.562 140.352 623.953 136.914ZM351.988 314.449C341.688 318.133 330.926 320 320 320C309.076 320 298.312 318.133 287.998 314.445L142.781 262.453L128 405.328C128 446.602 213.999 480 320 480C425.999 480 512 446.602 512 405.328L497.219 262.453L351.988 314.449Z" />
    </svg>
  )
}