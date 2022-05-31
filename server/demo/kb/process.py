import os
import json

root_path = "./samples/"

name2no = {}
no2name = []
patient2locas = {}

for path, dir_list, file_list in os.walk(root_path):
    for file_name in file_list:
        sample = json.load(open(os.path.join(root_path, file_name), 'r', encoding="utf-8"))
        pname = sample['basic']['name']
        if pname == "王某某":
            print(file_name)
        locas = set()
        for route in sample['routes']:
            for p in route['route']:
                pause = p['pause']
                name = pause['location']['name']
                laglnt = pause['location']['location']
                if name not in name2no:
                    no2name.append((name,laglnt))
                    name2no[name] = len(no2name)-1
                locas.add(name2no[name])
        patient2locas[pname] = list(locas)

with open("./name2no.json","w",encoding="utf-8") as f1,\
    open("./no2name.json","w",encoding="utf-8") as f2,\
    open("./patient2locas.json","w",encoding="utf-8") as f3:
    json.dump(name2no,f1,ensure_ascii=False)
    json.dump(no2name,f2,ensure_ascii=False)
    json.dump(patient2locas,f3,ensure_ascii=False)

print(len(no2name))

