import React, { useCallback, useEffect, useState } from 'react'
import { AMapLngLat } from 'react-amap'
import { useTypedSelector } from '../../lib/store'




interface IProps {
    __map__?: any
}


export default function AMapLinkedMarker({ __map__ }: IProps) {
    if (!__map__ )
        console.error("no map instance injected")
    const AMap: any = (window as any).AMap
    const vertexs = useTypedSelector(e => e.PAGlobalReducer.pauses) 
    console.log(__map__,111)
    console.log(AMap, 111)

    const generateMarker = useCallback(
        () => {
            const markers = vertexs.map((e, i) => new AMap.Marker({ position: e.lnglat, extData: i }))
            __map__.add(markers)
        },
        []
    )
    const generateEdge = useCallback(
        () => {
            const polyline = new AMap.Polyline({
                path: vertexs.map(e => e.lnglat),
                borderWeight: 2,
                strokeColor: 'red',
                lineJoin: 'round'
            })
            __map__.add(polyline)
        }, [])

    useEffect(() => {
        generateMarker()
        generateEdge()
    }, [])
    return (null)
}
