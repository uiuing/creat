import {
  Button,
  ButtonGroup,
  Collapsible,
  Input,
  Modal,
  Toast,
  Tooltip,
  Typography
} from '@douyinfe/semi-ui'
import { LocalData } from '@uiuing/creat-loader/types'
import PubSub from 'pubsub-js'
import { useState } from 'react'
import { TwitterPicker } from 'react-color'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  getRandomColor,
  UserInfo,
  UserTmpInfo
} from '../../../../../utils/data'
import LinkSvg from '../../../../components/svgs/LinkSvg'
import LockOpenSvg from '../../../../components/svgs/LockOpenSvg'
import LockSvg from '../../../../components/svgs/LockSvg'
import UnLinkSvg from '../../../../components/svgs/UnLinkSvg'
import UsersSvg from '../../../../components/svgs/UsersSvg'
import {
  closeWhiteboardShare,
  createWhiteboardShare
} from '../../../apis/prepare'
import { selectColors } from '../../../common/colors'
import {
  cloudWhiteboardState,
  userInfoState,
  userTmpInfoState
} from '../../../store'
import { GetLocalDataStateObject, whiteboardApp } from '../../../utils'
import styles from './style.module.scss'

const defaultStyle = {
  width: 20,
  height: 20,
  fill: '#3d3d3d'
}

export function CollatorState() {
  const [cloudWhiteboard, setCloudWhiteboard] =
    useRecoilState(cloudWhiteboardState)

  const [settingShare, setSettingShare] = useState(false)

  const userInfo = useRecoilValue<UserInfo>(userInfoState as any)
  const [userTmpInfo, setUserTmpInfo] = useRecoilState<UserTmpInfo>(
    userTmpInfoState as any
  )

  const [inputUsername, setInputUsername] = useState('')

  const localData = useRecoilValue(GetLocalDataStateObject()) as LocalData

  const [isChangeColor, setIsChangeColor] = useState(false)

  // 协作人员列表
  // const cooperationUsers = useRecoilValue(cooperationUsersState)

  // useEffect(() => {
  //   console.log('cooperationUsers', cooperationUsers)
  // }, [cooperationUsers])

  function shareManage() {
    return (
      <>
        {cloudWhiteboard.isCloud && cloudWhiteboard.isAuthor ? (
          <ButtonGroup
            type="tertiary"
            theme="borderless"
            className={styles.group}
          >
            <Tooltip
              content={
                cloudWhiteboard.readonly ? '让协作者可编辑' : '让协作者只读'
              }
              position="bottomRight"
            >
              <Button
                icon={
                  cloudWhiteboard.readonly ? (
                    <LockSvg {...defaultStyle} />
                  ) : (
                    <LockOpenSvg {...defaultStyle} />
                  )
                }
                onClick={() => {
                  if (cloudWhiteboard.isCloud) {
                    PubSub.publish('update-info', {
                      readonly: !cloudWhiteboard.readonly,
                      name: cloudWhiteboard.name
                    })
                    setCloudWhiteboard({
                      ...cloudWhiteboard,
                      readonly: !cloudWhiteboard.readonly,
                      name: cloudWhiteboard.name
                    })
                  } else {
                    Toast.warning({ content: '请创建白板会议之后再试～' })
                  }
                }}
              />
            </Tooltip>
          </ButtonGroup>
        ) : (
          <></>
        )}
        <ButtonGroup
          type="tertiary"
          theme="borderless"
          className={styles.group}
          style={{ padding: 7 }}
        >
          {/* TODO 添加选中样式 */}
          <Tooltip content="白板共享设置" position="bottomRight">
            <Button
              icon={
                <UsersSvg
                  {...defaultStyle}
                  fill={
                    cloudWhiteboard.isCloud
                      ? 'rgb(106, 58, 199)'
                      : 'rgb(0,100,250)'
                  }
                />
              }
              onClick={() => {
                setSettingShare(!settingShare)
              }}
            />
          </Tooltip>
        </ButtonGroup>
        <Modal
          title="会议状态"
          centered
          maskClosable
          onCancel={() => {
            setSettingShare(false)
          }}
          visible={settingShare}
          closeOnEsc
          footer={<></>}
        >
          {cloudWhiteboard.isCloud ? (
            <div style={{ marginBottom: 20 }}>
              <Typography.Title heading={6} style={{ marginBottom: 5 }}>
                共享链接
              </Typography.Title>
              <Typography.Text
                icon={<LinkSvg {...defaultStyle} width={13} height={13} />}
                underline
                copyable
              >
                {window.location.href}
              </Typography.Text>
              <Typography.Title heading={6} style={{ margin: '25px 0 10px' }}>
                您的用户名
              </Typography.Title>
              <Input
                minLength={2}
                maxLength={7}
                value={inputUsername}
                style={{ width: 120, borderRadius: 6, marginRight: 10 }}
                onFocus={() => {
                  whiteboardApp()?.unBindEvent()
                }}
                onBlur={() => {
                  whiteboardApp()?.bindEvent()
                }}
                placeholder={userTmpInfo.name}
                onChange={(e) => {
                  setInputUsername(e)
                }}
              />
              <Button
                type="secondary"
                style={{ borderRadius: 10 }}
                onClick={() => {
                  setUserTmpInfo({
                    color: userTmpInfo.color,
                    name: inputUsername
                  })
                  Toast.success('修改成功')
                }}
              >
                提交
              </Button>
              <div
                onMouseLeave={() => {
                  setIsChangeColor(false)
                }}
              >
                <Collapsible
                  className={styles.pickWrapper}
                  isOpen={isChangeColor}
                >
                  <TwitterPicker
                    color={userTmpInfo.color}
                    colors={selectColors}
                    triangle="hide"
                    onChangeComplete={(cl) => {
                      setUserTmpInfo({
                        name: userTmpInfo.name,
                        color: cl.hex as any
                      })
                      const data = whiteboardApp().getData() as any
                      whiteboardApp()?.setData(
                        {
                          nodes: data.nodes,
                          state: {
                            ...data.state,
                            defaultColor: cl.hex
                          }
                        },
                        true,
                        true
                      )
                    }}
                  />
                </Collapsible>
              </div>
              <Typography.Title heading={6} style={{ margin: '25px 0 10px' }}>
                您的默认颜色
              </Typography.Title>
              <div className={styles.option}>
                <Button
                  className={styles.colorSelection}
                  onClick={() => {
                    setIsChangeColor(!isChangeColor)
                  }}
                  style={{ backgroundColor: userTmpInfo.color }}
                />
                <Button
                  type="secondary"
                  style={{ borderRadius: 10 }}
                  onClick={() => {
                    const c = getRandomColor()
                    setUserTmpInfo({
                      name: userTmpInfo.name,
                      color: c as any
                    })
                    const data = whiteboardApp().getData() as any
                    whiteboardApp()?.setData(
                      {
                        nodes: data.nodes,
                        state: {
                          ...data.state,
                          defaultColor: c
                        }
                      },
                      true,
                      true
                    )
                  }}
                >
                  随机颜色
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 50
            }}
          >
            {(() => {
              if (cloudWhiteboard.isAuthor) {
                return cloudWhiteboard.isCloud ? (
                  <>
                    <Button
                      type="tertiary"
                      size="large"
                      theme="borderless"
                      className={styles.button}
                      icon={<UnLinkSvg {...defaultStyle} />}
                      onClick={() => {
                        closeWhiteboardShare(
                          {
                            userId: userInfo.id,
                            whiteboardId: window.whiteboardId
                          },
                          (data) => {
                            if (data.status === 300) {
                              Toast.warning('请检查网络～')
                            } else {
                              setCloudWhiteboard({
                                ...cloudWhiteboard,
                                isCloud: false
                              })
                              setSettingShare(false)
                            }
                          }
                        )
                      }}
                    >
                      关闭会议
                    </Button>
                  </>
                ) : (
                  <Button
                    type="tertiary"
                    size="large"
                    theme="borderless"
                    className={styles.button}
                    icon={<LinkSvg {...defaultStyle} />}
                    onClick={() => {
                      createWhiteboardShare(
                        {
                          nodes: whiteboardApp()?.getData().nodes,
                          info: {
                            name: userTmpInfo.name,
                            readonly: false
                          },
                          id: {
                            whiteboard: window.whiteboardId,
                            user: userInfo.id
                          }
                        },
                        (data) => {
                          if (data.status === 300) {
                            Toast.warning('请检查网络～')
                          } else {
                            setCloudWhiteboard({
                              ...cloudWhiteboard,
                              isCloud: true
                            })
                          }
                        }
                      )
                    }}
                  >
                    创建会议
                  </Button>
                )
              }
              return <></>
            })()}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <div className={styles.wrapper}>
      {cloudWhiteboard.readonly && !cloudWhiteboard.isAuthor ? (
        <></>
      ) : (
        shareManage()
      )}
    </div>
  )
}
