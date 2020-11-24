import React, { useEffect, useState } from 'react'
import { AutoComplete } from "antd"
import * as rxjs from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { useDispatch } from 'react-redux'
import { searchItem } from '../../lib/searchItem'
import { ActSetState } from '../../lib/state/global'
import { useTypedSelector } from '../../lib/store'

export default function DebouncedAutocomplete(props: any) {
    const [subject, setSubject] = useState(new rxjs.Subject<string>())
    const [value, setValue] = useState("")
    const searchRes = useTypedSelector(e => e.PAGlobalReducer.searchedResult)
    const dispatch = useDispatch()

    const onSearch = (keyword: string) => {
        searchItem({ keyword })
            .then(e => {
                if (Array.isArray(e.data?.result)) {
                    dispatch(ActSetState({ searchedResult: e.data.result }))
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
        const a = searchRes?.find(e => e._id == id)
        console.log(a)
        dispatch(ActSetState({ loaded_form: a }))
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
                searchRes ?
                    <AutoComplete.Option value={0} disabled>共有{searchRes.length}条结果</AutoComplete.Option> : null
            }
            {
                searchRes && searchRes.map((e, idx) => (<AutoComplete.Option key={e._id ?? idx} value={e._id ?? "unknown"}>
                    {e.basic?.name}
                </AutoComplete.Option>))
            }
        </AutoComplete>
    )
}
