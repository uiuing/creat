import { Button, ButtonGroup, Tooltip } from '@douyinfe/semi-ui'

import GitHubSvg from '../../../components/svgs/GitHubSvg'
import LearnSvg from '../../../components/svgs/LearnSvg'
import styles from './style.module.scss'

const defaultStyle = {
  width: 23,
  height: 23,
  fill: '#3d3d3d'
}
export default function TopHead() {
  return (
    <div className={styles.wrapper}>
      <Tooltip content="进入官网，了解我们更多～">
        <Button
          style={{ backgroundColor: 'white', margin: 10 }}
          icon={<LearnSvg {...defaultStyle} />}
          onClick={() => {
            window.open('https://docs-creat.uiuing.com')
          }}
        />
      </Tooltip>
      <Tooltip content="GitHub 仓库">
        <Button
          style={{ backgroundColor: 'white', margin: 10 }}
          icon={<GitHubSvg {...defaultStyle} />}
          onClick={() => {
            window.open('https://github.com/uiuing/creat')
          }}
        />
      </Tooltip>
    </div>
  )
}
