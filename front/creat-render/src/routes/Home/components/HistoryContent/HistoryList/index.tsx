import { Button, ButtonGroup, List, Typography } from '@douyinfe/semi-ui'

import { WhiteboardInfos } from '../../../../../utils/data'
import { openWhiteboard } from '../../../../../utils/optionControl'

type Props = {
  whiteboardList: WhiteboardInfos
  fns: {
    reName: (id: string) => void
    download: (id: string) => void
    delete: (id: string) => void
  }
}

export default function HistoryList({ whiteboardList, fns }: Props) {
  const { Text } = Typography
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
                  <Button onClick={() => fns.reName(id)}>重命名</Button>
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
