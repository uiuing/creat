import {
  faFileText,
  faFolderOpen,
  faSquarePlus
} from '@fortawesome/free-regular-svg-icons'

import {
  createWhiteboard,
  joinMeeting,
  openWhiteboard
} from '../../../../utils/optionControl'
import CreateButton from './CreateButton'
import { CreateButtonProps } from './types'

const options: Array<CreateButtonProps> = [
  {
    title: '创建白板',
    faIconProps: {
      icon: faFileText
    },
    semiButtonProps: {
      theme: 'solid',
      size: 'large',
      onClick: createWhiteboard
    }
  },
  {
    title: '打开白板',
    faIconProps: {
      icon: faFolderOpen
    },
    semiButtonProps: {
      theme: 'light',
      onClick: openWhiteboard
    }
  },
  {
    title: '加入会议',
    faIconProps: {
      icon: faSquarePlus
    },
    semiButtonProps: {
      theme: 'light',
      onClick: joinMeeting
    }
  }
]

type Props = {
  className?: string
}

export default function CreateContent({ className }: Props) {
  const renderOptions = options.map(
    ({ title, faIconProps, semiButtonProps }, index) => (
      <CreateButton
        key={index}
        title={title}
        faIconProps={faIconProps}
        semiButtonProps={semiButtonProps}
      />
    )
  )
  return <div className={className}>{renderOptions}</div>
}
