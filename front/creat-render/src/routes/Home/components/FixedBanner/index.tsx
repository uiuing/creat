import banner from './banner.png'

type Props = {
  className?: string
  width?: string | number
  height?: string | number
  alt?: string
}

export default function FixedBanner({
  className,
  width,
  height,
  alt = 'Hello, this is creat.'
}: Props) {
  return (
    <img
      src={banner}
      className={className}
      width={width}
      height={height}
      alt={alt}
    />
  )
}
