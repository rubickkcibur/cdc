import React from "react"
import sty from "./index.module.scss"
import KashHeader from "../Header"

interface IProps {
  children: React.ReactNode
}
export default function MainLayout({ children }: IProps) {
  return (
    <div className={sty.Main}>
      <KashHeader />
      <div className={sty.Content}>{children}</div>
    </div>
  )
}
