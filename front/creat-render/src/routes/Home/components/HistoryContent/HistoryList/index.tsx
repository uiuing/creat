import {
  Button,
  ButtonGroup,
  Input,
  List,
  Popconfirm,
  Typography
} from '@douyinfe/semi-ui'
import { useState } from 'react'

import { WhiteboardInfos } from '../../../../../utils/data'
import { openWhiteboard } from '../../../../../utils/optionControl'

type Props = {
  whiteboardList: WhiteboardInfos
  setWhiteboardInfos: any
  fns: {
    download: (id: string) => void
    delete: (id: string) => void
  }
}

export default function HistoryList({
  whiteboardList,
  setWhiteboardInfos,
  fns
}: Props) {
  const { Text } = Typography

  const [fileName, setFileName] = useState('')

  const list: WhiteboardInfos = Object.assign([], whiteboardList)
  list.sort((a, b) => b.recentlyOpened - a.recentlyOpened)
  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--semi-color-border)',
        margin: 12
      }}
    >
      <List
        dataSource={list}
        renderItem={({ id, name, recentlyOpened }) => (
          <List.Item
            header={
              <Button
                theme="borderless"
                type="tertiary"
                onClick={() => {
                  openWhiteboard(id)
                }}
              >
                {name}
              </Button>
            }
            extra={
              <>
                <ButtonGroup
                  theme="borderless"
                  type="secondary"
                  size="small"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Text type="quaternary">
                    {new Date(recentlyOpened).toLocaleString()}
                  </Text>
                  <Popconfirm
                    title="修改文件名"
                    content={
                      <Input
                        defaultValue={name}
                        onChange={(v) => {
                          setFileName(v)
                        }}
                      />
                    }
                    onConfirm={() => {
                      setWhiteboardInfos(
                        whiteboardList.map((item) =>
                          item.id === id ? { ...item, name: fileName } : item
                        )
                      )
                    }}
                  >
                    <Button theme="borderless" type="secondary" size="small">
                      重命名
                    </Button>
                  </Popconfirm>
                  <Button onClick={() => fns.download(id)}>下载</Button>
                  <Button onClick={() => fns.delete(id)}>删除</Button>
                </ButtonGroup>
              </>
            }
          />
        )}
      />
    </div>
  )
}
