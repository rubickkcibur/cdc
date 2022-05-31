import React, { useCallback, useEffect, useState } from 'react'
import ASRRecorder from './recorder'

type UserCallback = {
    onMessage: (e) => void

}
type TCallback = {
    onStart: (e: any) => void
    onError: (e: any) => void
    onClose: (edd: any) => void
    onMessage: (e: any) => void
}

const getR = (cb: TCallback) => new ASRRecorder({
    app_id: '6029d739',
    api_key: 'ddad4feb31add051ffab4074cad06f19',
    ...cb
})



function mergeStr(data) {

    let str = ""
    const i = JSON.parse(data.data)
    if (i.cn.st.type == 0) {
        i.cn.st.rt.forEach(j => {
            j.ws.forEach(k => {
                k.cw.forEach(l => {
                    str += l.w
                })
            })
        })
    }
    return str
}
let res = ""
export default function useASR(cb: UserCallback) {
    const [r, _] = useState(getR({
        onStart(e) {
            console.log("start", e)
        },
        onError(e) {
            console.log("error", e)
        },
        onClose() {
            cb.onMessage(res)
        },
        onMessage: (e) => {
            try {
                const s = mergeStr(JSON.parse(e))
                res += s
            } catch (r) {
                console.log('parse err', r, e)
            }
        }
    }))
    return {
        start() {
            res = ""
            console.log('start')
            r.start.bind(r)()
        },
        stop() {
            r.stop.bind(r)()
        }
    }


}
