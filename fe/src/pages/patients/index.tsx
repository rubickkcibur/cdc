import { Select } from "antd";
import React, { useEffect, useState } from "react";
import DebouncedAutocomplete from "../../components/AutoComplete";
import MainLayout from "../../components/MainLayoout/PageLayout"
import { useTypedSelector } from "../../lib/store";
import sty from './index.module.scss'

export default function Pagepatients() {
    const [pid, setPid] = useState<string>("3");
    const loaded_form = useTypedSelector(e => e.PAGlobalReducer.loaded_form);
    console.log(loaded_form?.basic.personal_id);
    return <MainLayout>
    <div>
      <p>{loaded_form?.basic.personal_id}</p>
    </div>
  </MainLayout>
    
}