import { Button } from '@douyinfe/semi-ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { CreateButtonProps } from '../types'

export default function CreateButton({
  title,
  faIconProps,
  semiButtonProps
}: CreateButtonProps) {
  return (
    <Button icon={<FontAwesomeIcon {...faIconProps} />} {...semiButtonProps}>
      {title}
    </Button>
  )
}
