import json
from app01.models import *

def mask_name(name):
    newname = list(name)
    newname[1] = "某"
    newname = "".join(newname)
    return newname

def get_reason_result(pid,version):
    with open("app01/chains/chain_{}.json".format(version),"r") as f:
        obj = json.load(f)
    return obj

def refresh_origin(pids,path):
    ordered_pids = sorted(pids,key=lambda ele:ele[1])
    with open(path,"r",encoding="utf8") as f:
        format_data = json.load(f)
    nodes = format_data["nodes"]
    clusters = format_data["clusters"]
    record = {}
    for pid,date in ordered_pids:
        if pid in record:
            continue
        arr = []
        arr.append((pid,0,-1,""))
        while(len(arr) > 0):
            id,level,father,r = arr.pop(0)
            record[id] = [level,father,r]
            for c in clusters:
                cids = [nodes[idx]["pid"] for idx in c["nodes"]]
                if id in cids:
                    for i in cids:
                        if i not in record:
                            arr.append((i,level+1,id,c["name"]))
    origin_chain = []
    pid2idx = {}
    for k,v in record.items():
        pid2idx[k] = len(origin_chain)
        origin_chain.append({
            "pid":k,
            "name":mask_name(App01Patient.objects.get(pid=k).name),
            "recorded":1,
            "father":v[1],
            "relation":v[2],
            "level":v[0],
            "isTruth":0
        })
    for obj in origin_chain:
        obj["father"] = pid2idx[obj["father"]] if obj["father"] != -1 else -1
    with open("app01/chains/chain_origin.json","w",encoding="utf8") as f:
        json.dump(origin_chain,f)
    return