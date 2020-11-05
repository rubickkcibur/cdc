import path from 'path'
import Axios from 'axios'

import fs from 'fs'

const data = JSON.parse(fs.readFileSync('./src/components/BasicForm/pca.json').toString())
const refined = Object.keys(data).map(province => ({
    value: province,
    label: province,
    children: Object.keys(data[province]).map(cites => ({
        value: cites,
        label: cites,
        children: data[province][cites].map((areas: string) => ({
            value: areas,
            label: areas,
        }))
    }))
})
)
fs.writeFileSync('./out.json', JSON.stringify(refined))