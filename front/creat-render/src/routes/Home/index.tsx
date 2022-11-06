import { RecoilRoot } from 'recoil'

import { setTitle } from '../../utils/urls'
import CreateContent from './components/CreateContent'
import FixedBanner from './components/FixedBanner'
import HistoryContent from './components/HistoryContent'
import styles from './style.module.scss'

setTitle('CREAT - 远程协作白板')

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <FixedBanner className={styles.fixedBanner} />
      <RecoilRoot>
        <CreateContent className={styles.createContent} />
        <HistoryContent className={styles.historyContent} />
      </RecoilRoot>
    </div>
  )
}
