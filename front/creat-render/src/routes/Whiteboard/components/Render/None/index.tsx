import {
  IllustrationNoResult,
  IllustrationNoResultDark
} from '@douyinfe/semi-illustrations'
import { Button, Empty } from '@douyinfe/semi-ui'

import RotateLeftRightSvg from '../../../../components/svgs/RotateLeftRightSvg'
import styles from '../../style.module.scss'

export default function RenderNone() {
  return (
    <div className={styles.renderTop}>
      <Empty
        image={
          <IllustrationNoResult style={{ width: '15vw', height: '15vw' }} />
        }
        darkModeImage={
          <IllustrationNoResultDark style={{ width: '15vw', height: '15vw' }} />
        }
        description={
          <>
            <div style={{ marginBottom: 30 }}>貌似没有该白板的信息</div>
            <Button
              icon={
                <RotateLeftRightSvg
                  isLeft
                  width={15}
                  height={15}
                  fill="rgb(0,100,250)"
                />
              }
              style={{ borderRadius: 10 }}
              onClick={() => {
                window.location.replace('/')
              }}
            >
              <div style={{ margin: 3 }}>回到首页</div>
            </Button>
          </>
        }
        style={{ marginTop: '5%' }}
      />
    </div>
  )
}
