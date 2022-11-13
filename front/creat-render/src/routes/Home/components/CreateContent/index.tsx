import { Input, Modal } from '@douyinfe/semi-ui'
import {
  faFileText,
  faFolderOpen,
  faSquarePlus
} from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { useRecoilState } from 'recoil'

import { getWhiteboardInfos } from '../../../../utils/data'
import {
  createWhiteboard,
  openWhiteboardFile,
  parseJoinUrl
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

  const [settingJoin, setSettingJoin] = useState(false)
  const [joinUrl, setJoinUrl] = useState('')

  const reGet = async () => {
    const infos = await getWhiteboardInfos()
    await setWhiteboardInfos(infos as any)
  }

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
          createWhiteboard(reGet)
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
        onClick: () => {
          openWhiteboardFile(reGet)
        }
      }
    },
    {
      title: '加入会议',
      faIconProps: {
        icon: faSquarePlus
      },
      semiButtonProps: {
        theme: 'light',
        onClick: () => {
          setSettingJoin(true)
        }
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
  return (
    <>
      <Modal
        title="加入会议配置"
        visible={settingJoin}
        okText="加入！"
        cancelText="取消"
        onCancel={() => {
          setSettingJoin(false)
        }}
        onOk={() => {
          parseJoinUrl(joinUrl)
        }}
        closeOnEsc
      >
        <p>您可以输入分享链接，或者输入白板id</p>
        <Input
          showClear
          defaultValue=""
          onChange={(e) => {
            setJoinUrl(e)
          }}
        />
      </Modal>
      <div className={className}>{renderOptions}</div>
    </>
  )
}
