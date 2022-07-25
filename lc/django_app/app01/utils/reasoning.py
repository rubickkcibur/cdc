import json

def get_reason_result(pid,version):
    with open("app01/chains/chain_{}.json".format(version),"r") as f:
        obj = json.load(f)
    return obj