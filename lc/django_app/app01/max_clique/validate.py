import os
import json
import re
patient2locas = json.load(open("./patient2locas.json","r",encoding="utf8"))

def label2name(label):
    global p2no
    global no2p
    cnt = 0
    name = []
    while label:
        if label & 1 !=0:
            name.append(no2p[cnt])
        cnt += 1
        label >>= 1
    return name

p2no = {}
no2p = []
cnt = 0
for name in patient2locas:
    p2no[name] = cnt
    no2p.append(name)
    cnt += 1
dir = os.listdir()
dir = [d for d in dir if re.match(pattern=r'result_.*_0.5\.json',string=d)]
for f in dir:
    result = json.load(open(f,"r",encoding="utf8"))
    label_set = set()
    for clique in result:
        label = 0
        for name in clique:
            label |= 1<<p2no[name]
        label_set.add(label)
    # print(f,[label2name(label) for label in label_set])
    print(f,label_set)