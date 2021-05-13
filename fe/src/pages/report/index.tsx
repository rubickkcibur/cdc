import { Button, message } from "antd"
import React, { useEffect, useState } from "react"
import MainLayout from "../../components/MainLayoout/PageLayout"
import ReportCom from "../../components/report/index"
import sty from "./index.module.scss"
export default function Report(){
    return(
        <MainLayout>
            <div className={sty.Save}>
                <Button type="primary" onClick={()=>{message.success("已保存")}}>保存</Button>
            </div>
            <ReportCom/>
        </MainLayout>
    )
}