import { Button, ButtonGroup, List } from '@douyinfe/semi-ui'

type Props = {
  whiteboardList: Array<{
    id: string
    name: string
  }>
  fns: {
    reName: (id: string) => void
    download: (id: string) => void
    delete: (id: string) => void
  }
}

export default function HistoryList({ whiteboardList, fns }: Props) {
  return (
    <div
      style={{
        padding: 12,
        border: '1px solid var(--semi-color-border)',
        margin: 12
      }}
    >
      <List
        dataSource={whiteboardList}
        renderItem={({ id, name }) => (
          <List.Item
            main={<div>{name}</div>}
            extra={
              <ButtonGroup theme="borderless" type="secondary" size="small">
                <Button onClick={() => fns.reName(id)}>重命名</Button>
                <Button onClick={() => fns.download(id)}>下载</Button>
                <Button onClick={() => fns.delete(id)}>删除</Button>
              </ButtonGroup>
            }
          />
        )}
      />
    </div>
  )
}
