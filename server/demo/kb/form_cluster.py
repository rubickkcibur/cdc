import json
from tkinter.filedialog import Open

def get_clusters():
    with open("demo/kb/clique_no_v2_2.json","r") as f:
        clique_no = json.load(f)
    with open("demo/kb/patient_cliques_v2_2.json","r") as f:
        patient_cliques = json.load(f)
    with open("demo/kb/clique_no2name.json","r") as f:
        clique_no2name = json.load(f)
    nodes = []
    edges = []
    clusters = []
    cluster_edges = []
    node_cnt = 0
    for i in range(len(clique_no)):
        cno = str(clique_no[i])
        cname = clique_no2name[cno][0][0]
        gps = clique_no2name[cno][0][1]
        patients = patient_cliques[i]
        for pname in patients:
            nodes.append({
                "name":pname,
                "clusterId":i
            }) 
        for j in range(len(patients)-1):
            for k in range(j+1,len(patients)):
                edges.append({
                    "source":node_cnt+j,
                    "target":node_cnt+k,
                    "relation":"聚集性传染",
                    "note":""
                })
        clusters.append({
            "id":"cluster-{}".format(i),
            "name":cname,
            "gps":gps,
            "note":"",
            "nodes":list(range(node_cnt,node_cnt+len(patients)))
        })
        node_cnt += len(patients)
    ce = set()
    for i in range(len(nodes)):
        for j in range(i+1,len(nodes)):
            if nodes[i]["name"] == nodes[j]["name"]:
                edges.append({
                    "source":i,
                    "target":j,
                    "relation":"同一人",
                    "note":""
                })
                if nodes[i]["clusterId"] != nodes[j]["clusterId"]:
                    s = "{}-{}".format(nodes[i]["clusterId"],nodes[j]["clusterId"])
                    ce.add(s)
    for s in ce:
        st = s.split("-")
        cluster_edges.append({
            "source":clusters[int(st[0])]["id"],
            "target":clusters[int(st[1])]["id"],
            "relation":"存在同一人",
            "note":"备注",
            "count":1
        })
    print(cluster_edges)
    return {"nodes":nodes,"edges":edges,"clusters":clusters,"clusterEdges":cluster_edges}

# print(get_clusters())