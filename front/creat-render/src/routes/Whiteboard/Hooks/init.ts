import creatLoader from '@uiuing/creat-loader'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { getUserTmpInfo, getWhiteboardLocalData } from '../../../utils/data'
import { cloudWhiteboardState } from '../store'
import { cooperationUsersState } from '../store/cooperationReceive'
import { GetLocalDataStateObject, whiteboardApp } from '../utils'
import { joinShare, syncNodes } from '../utils/sendMessage'

export function useInitWhiteboardLoader() {
  const setLocalData = useSetRecoilState<any>(GetLocalDataStateObject())
  const [isLoaderOK, setIsLoaderOK] = useState(false)
  const cloudWhiteboard = useRecoilValue(cloudWhiteboardState)
  const setCooperationUsers = useSetRecoilState(cooperationUsersState)
  useLayoutEffect(() => {
    window.whiteboard = creatLoader({ plotType: 'selection' }).mount(
      '#creat-loader'
    )
    window.whiteboard.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const initData = whiteboardApp().getData()
    // 如果是作者则进行数据操作
    if (cloudWhiteboard.isAuthor) {
      getWhiteboardLocalData().then((data) => {
        if (cloudWhiteboard.isCloud) {
          // 作者加入房间
          getUserTmpInfo().then((r) => {
            joinShare(
              (d: any) => {
                if (!window.noOnceJoinShare) {
                  // 本地覆盖远程数据
                  syncNodes({
                    type: 'cover-all',
                    nodes: data ? data.nodes : []
                  })
                  if (!d.whiteboard.readonly) {
                    setCooperationUsers(d.cooperation_users)
                  }
                  setIsLoaderOK(true)
                  window.noOnceJoinShare = true
                }
              },
              r.name,
              r.color
            )
          })
        } else if (data && 'state' in data) {
          setLocalData(data)
          whiteboardApp().setData(data, false)
          setIsLoaderOK(true)
        } else {
          setLocalData(initData)
          setIsLoaderOK(true)
        }
      })
    } else {
      // 协作者要加入房间了
      getUserTmpInfo().then((r) => {
        joinShare(
          (d: any) => {
            if (!window.noOnceJoinShare) {
              whiteboardApp().setData(
                {
                  ...initData,
                  nodes: d.whiteboard.nodes
                },
                false
              )
              if (!d.whiteboard.readonly) {
                setCooperationUsers(d.cooperation_users)
              }
              setIsLoaderOK(true)
              window.noOnceJoinShare = true
            }
          },
          r.name,
          r.color
        )
      })
    }
  }, [cloudWhiteboard])

  return isLoaderOK
}
