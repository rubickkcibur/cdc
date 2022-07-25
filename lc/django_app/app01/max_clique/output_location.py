import os
import json
ver = 2
d = 0.5
with open("all_max_cliques_v{}_{}.json".format(ver,d),"r",encoding="utf-8") as f:
    all_Cliques = json.load(f)
with open("clique_no_v{}_{}.json".format(ver,d),"r",encoding="utf8") as f:
    cno = json.load(f)
with open("./no2name.json","r",encoding="utf8") as f:
    no2name = json.load(f)
for i in cno:
    print(i)
    print([no2name[j] for j in all_Cliques[i]])