import Axios from "axios";
import Constant from '../constant'

export async function searchItem({ keyword }: { keyword: string }) {
    return Axios.post(`${Constant.apihost}/query`, { keyword })
}