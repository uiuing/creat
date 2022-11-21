import { setTitle } from '../../utils/urls'
import CreateContent from './components/CreateContent'
import FixedBanner from './components/FixedBanner'
import HistoryContent from './components/HistoryContent'
import TopHead from './components/TopHead'
import styles from './style.module.scss'

setTitle('CREAT - 远程协作白板')

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <TopHead />
      <a href="https://docs-creat.uiuing.com" target="_blank" rel="noreferrer">
        <FixedBanner className={styles.fixedBanner} />
      </a>
      <CreateContent className={styles.createContent} />
      <HistoryContent className={styles.historyContent} />
    </div>
  )
}
