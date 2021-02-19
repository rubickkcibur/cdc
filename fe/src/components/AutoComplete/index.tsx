import React, { useEffect, useState } from 'react'
import { AutoComplete } from "antd"
import * as rxjs from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { useDispatch } from 'react-redux'
import { searchItem } from '../../lib/searchItem'
import { ActSetState } from '../../lib/state/global'
import { useTypedSelector } from '../../lib/store'
import { BaseItem } from '../../lib/types/types'
import {extracDate} from '../../lib/utils'
import Base from 'antd/lib/typography/Base'

interface Nameid {
    name:string
    pid:string
}

const personizeSearchResult = (searchRes:BaseItem[]|undefined,choosen:Nameid) => {
    if (searchRes){
        var re:BaseItem[] = []
        for (let i of searchRes){
            if (i.basic.name == choosen.name && i.basic.personal_id == choosen.pid)
                re.push(i)
        }
        return re
    }
    return []
}

const res2nameid:(s: BaseItem[]) => Nameid[] = (searchRes:BaseItem[]) => {
    var temp:string[] = []
    for(let i of searchRes) {
        temp.push(JSON.stringify({name:i.basic.name,pid:i.basic.personal_id}))
    }
    //return JSON.parse(Array.from(new Set(temp))[0])
    return Array.from(new Set(temp)).map((e)=>(JSON.parse(e)))
}

export default function DebouncedAutocomplete(props: any) {
    const [subject, setSubject] = useState(new rxjs.Subject<string>())
    const [value, setValue] = useState("")
    var initNameid:Nameid[] = []
    const [nameid, setNameid] = useState(initNameid)
    const searchRes = useTypedSelector(e => e.PAGlobalReducer.searchedResult)
    const dispatch = useDispatch()

    const onSearch = (keyword: string) => {
        searchItem({ keyword })
            .then(e => {
                if (Array.isArray(e.data?.result)) {
                    dispatch(ActSetState({ searchedResult: e.data.result }))
                    setNameid(res2nameid(e.data.result))
                    //console.log("hhh")
                    //console.log(res2nameid(e.data.result))
                    return
                }
                console.error("searchItem api break")
            }).catch(e => console.log(e))
    }
    const onHandleInput = (txt: string) => {
        console.log("setvalue", txt)
        if (txt.length > 10) {
            return
        }
        setValue(txt)
        subject.next(txt)
    }
    const onSelect = (id: string) => {
        console.log(11111, id)
        var partialRes:BaseItem[] = personizeSearchResult(searchRes,nameid[Number(id)])
        //const a = searchRes?.find(e => e._id == id)
        //console.log(extracDate(partialRes[0].path.nodes[0].time))
        dispatch(ActSetState({ personalSearchedResults:partialRes,loaded_form: partialRes[0] }))
        setValue("")
    }

    useEffect(() => {
        const h = subject.pipe(debounceTime(500)).subscribe((text) => onSearch(text))
        return () => {
            h.unsubscribe()
        }
    }, [])
    return (
        <AutoComplete onChange={(e) => onHandleInput(e)} value={value} style={{ width: "200px" }} placeholder={"输入姓名查找"} onSelect={onSelect}>
            {
                nameid.length!=0 ?
                    <AutoComplete.Option value={0} disabled>共有{nameid.length}条结果</AutoComplete.Option> : null
            }
            {
                nameid.length!=0 && nameid.map((e, idx) => (<AutoComplete.Option key={e.name+e.pid+idx} value={idx.toString()}>
                    {e.name}+{e.pid}
                </AutoComplete.Option>))
            }
        </AutoComplete>
    )
}
