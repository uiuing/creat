import createLoader from 'creat-loader'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { getWhiteboardLocalData } from '../../../utils/data'
import { localDataState } from '../store'
import { whiteboardApp } from '../utils'

export function useInitWhiteboardLoader() {
  const setLocalData = useSetRecoilState<any>(localDataState)

  useLayoutEffect(() => {
    window.whiteboard = createLoader({ plotType: 'selection' }).mount(
      '#creat-loader'
    )
  }, [])

  const [isLoaderOK, setIsLoaderOK] = useState(false)

  useEffect(() => {
    const initData = whiteboardApp().getData()
    getWhiteboardLocalData().then((data) => {
      if (data) {
        setLocalData(data)
        whiteboardApp().setData(data, false)
      } else {
        setLocalData(initData)
      }
      setIsLoaderOK(true)
    })
  }, [])

  return isLoaderOK
}
