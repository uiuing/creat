import {
  IllustrationNoContent,
  IllustrationNoContentDark
} from '@douyinfe/semi-illustrations'
import { Empty, Typography } from '@douyinfe/semi-ui'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import {
  deleteWhiteboard,
  downloadWhiteboard,
  getWhiteboardInfos,
  WhiteboardInfo
} from '../../../../utils/data'
import { whiteboardInfosState } from '../../store'
import HistoryList from './HistoryList'

type Props = {
  className?: string
}

export default function HistoryContent({ className }: Props) {
  const { Text } = Typography

  const [whiteboardInfos, setWhiteboardInfos] =
    useRecoilState(whiteboardInfosState)

  const [isRender, setIsRender] = useState(false)

  useEffect(() => {
    getWhiteboardInfos().then((r) => {
      if (whiteboardInfos.length === r.length) {
        setIsRender(true)
      }
    })
  }, [whiteboardInfos])

  const fns = {
    download: downloadWhiteboard,
    delete: (id: string) => {
      deleteWhiteboard(id).then(() => {
        setWhiteboardInfos(
          whiteboardInfos.filter((item: WhiteboardInfo) => item.id !== id)
        )
      })
    }
  }

  if (!isRender) {
    return <></>
  }

  if (whiteboardInfos.length === 0) {
    return <EmptyTip className={className} />
  }

  return (
    <div className={className}>
      <div>
        <Text type="quaternary">
          <FontAwesomeIcon icon={faClock} style={{ margin: '0 5px' }} />
          最近打开
        </Text>
      </div>
      <div>
        <HistoryList whiteboardList={whiteboardInfos} fns={fns} />
      </div>
    </div>
  )
}

function EmptyTip({ className }: Props) {
  return (
    <div className={className}>
      <Empty
        image={
          <IllustrationNoContent style={{ width: '15vw', height: '15vw' }} />
        }
        darkModeImage={
          <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
        }
        title="还没有历史记录"
        description="开始创建你的第一个白板吧！"
      />
    </div>
  )
}
