import React, { useCallback, useRef, useState } from 'react'
import data from './mock.json'
import dynamic from "next/dynamic";
import { isModuleBlock } from 'typescript';
import text from './richtext'
import { Tag } from 'antd';
import sty from './index.module.scss'

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]


export default function index() {
    const audioRef = useRef<HTMLAudioElement>()
    const [html, setHTML] = useState(text)
    // audioRef.current.
    const goto = useCallback(
        (time: string) => {
            const ele = audioRef.current
            if (!ele) return
            ele.currentTime = parseFloat(time)




        },
        [audioRef],
    )

    return (
        <div className={sty.root}>
            <div className={sty.left}>
                <div><audio ref={audioRef} src={'./mock.mp3'} controls /></div>
                <div>
                    {data.map(e => (<div key={e.time}>
                        <Tag onClick={() => goto(e.time)}> {e.time}</Tag>
                        {e.text}
                    </div>))}

                </div>


            </div>
            <div className={sty.right}>
                <ReactQuill theme="snow" modules={modules} formats={formats} value={html} onChange={(e) => {
                    console.log(e)
                    return setHTML(e);
                }} />
            </div>

        </div>)
}
