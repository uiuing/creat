type Props = {
  width: string | number
  height: string | number
  fill: string
}

export default function TriangleSvg(options: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...options}>
      <path d="M255.953 84.804L459.429 432H52.583L255.953 84.804M255.994 32C241.591 32 227.175 39 218.953 53L5.741 417C-10.591 444.891 9.852 480 42.739 480H469.275C502.052 480 522.606 445 506.273 417L292.95 53C284.784 39 270.395 32 255.994 32L255.994 32Z" />
    </svg>
  )
}
