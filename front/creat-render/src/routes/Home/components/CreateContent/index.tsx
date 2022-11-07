import {
  faFileText,
  faFolderOpen,
  faSquarePlus
} from '@fortawesome/free-regular-svg-icons'
import { useRecoilState } from 'recoil'

import { getWhiteboardInfos } from '../../../../utils/data'
import {
  createWhiteboard,
  joinMeeting,
  openWhiteboardFile
} from '../../../../utils/optionControl'
import { whiteboardInfosState } from '../../store'
import CreateButton from './CreateButton'
import { CreateButtonProps } from './types'

type Props = {
  className?: string
}

export default function CreateContent({ className }: Props) {
  const [whiteboardInfos, setWhiteboardInfos] =
    useRecoilState(whiteboardInfosState)
  const options: Array<CreateButtonProps> = [
    {
      title: '创建白板',
      faIconProps: {
        icon: faFileText
      },
      semiButtonProps: {
        theme: 'solid',
        size: 'large',
        onClick: () => {
          createWhiteboard(async () => {
            const infos = await getWhiteboardInfos()
            await setWhiteboardInfos(infos as any)
          })
        }
      }
    },
    {
      title: '打开文件',
      faIconProps: {
        icon: faFolderOpen
      },
      semiButtonProps: {
        theme: 'light',
        onClick: openWhiteboardFile as any
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
