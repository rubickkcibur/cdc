from email.errors import MultipartInvariantViolationDefect
from ntpath import join
from signal import pause
from tracemalloc import start
from math import *
from datetime import datetime,timedelta
import json
import os
import csv
import re as regex
class Node():
    def __init__(self,pid,phone,name,gender,diagnosedTime,ntype):
        self.pid = pid
        self.phone = phone
        self.name = name
        self.gender = gender
        self.diagnosedTime = diagnosedTime
        self.type = ntype
    
    def getStoreFormat(self):
        return {
            "pid":self.pid,
            "phone":self.phone,
            "name":self.name,
            "gender":self.gender,
            "diagnosedTime":self.diagnosedTime,
            "type":self.type
        }

class Location():
    def __init__(self,name,gps,note):
        self.name = name
        self.gps = gps
        self.note = note
    
    def getStoreFormat(self):
        return {
            "name":self.name,
            "gps":self.gps,
            "note":self.note
        }

class Cluster():
    def __init__(self,location_cluster):
        self.location_cluster = location_cluster
        self.patients = []
        self.order = False
    def addPatient(self,dtime,node_id,location_id):
        self.patients.append((dtime,node_id,location_id))
        self.order=False
    def fromPatientList(self,l):
        self.patients = l
    def sort(self):
        self.patients.sort(key=lambda x:x[0])
        self.order=True
    def getStoreFormat(self):
        return{
            "location_cluster":list(self.location_cluster),
            "patients":[{
                    "datetime":str(e[0]),
                    "node_id":str(e[1])
                } for e in self.patients]
        }
    def getFirstTime(self):
        if not self.order:
            self.sort()
        return self.patients[0][0]
    def filterNodes(self,startTime=None,endTime=None,interval=60):
        interval = timedelta(minutes=interval)
        if not self.order:
            self.sort()
        if startTime is not None:
            tmp_patients = [p for p in self.patients if p[0]>=startTime and p[0]<=endTime]
        else:
            tmp_patients = self.patients
        re = []
        startPoint = tmp_patients[0][0]
        for i in range(len(tmp_patients)):
            nodes = set()
            locations = set()
            st = tmp_patients[i][0]
            et = tmp_patients[i][0]
            if st < startPoint:
                continue
            nodes.add(tmp_patients[i][1])
            locations.add(tmp_patients[i][2])
            for j in range(i+1,len(tmp_patients)):
                if tmp_patients[j][0]-tmp_patients[i][0] <= interval:
                    et = tmp_patients[j][0]
                    nodes.add(tmp_patients[j][1])
                    locations.add(tmp_patients[j][2])
                    if j == len(tmp_patients)-1:
                        startPoint = tmp_patients[j][0]+timedelta(seconds=1)
                else:
                    startPoint = tmp_patients[j][0]-interval
                    break
            re.append([nodes,locations,st,et])
        return re
    
class AggregateGraph():
    def __init__(self,node_list,location_list,pause_list,store_path,
                    location_clusters=None,location2clusterid=None,clusters=None,graph=None):
        self.node_list = node_list
        self.location_list = location_list
        self.pause_list = pause_list
        self.location_size = len(self.location_list)
        self.location_clusters = location_clusters
        self.location2clusterid = location2clusterid
        self.clusters = clusters
        self.graph = graph
        self.store_path = store_path
        self.pid2nid = {}
        for idx,n in enumerate(self.node_list):
            self.pid2nid[n.pid] = idx
        for p in pause_list:
            if p[3] == "None":
                p[3] = "12:00:00"
    
    @classmethod
    def load_data(cls,path):
        with open(os.path.join(path,"node_list.json"),"r",encoding="utf8") as f:
            nlist=json.load(f)
            node_list = [Node(e["pid"],e["phone"],e["name"],e["gender"],e["diagnosedTime"],e["type"]) for e in nlist]
        with open(os.path.join(path,"location_list.json"),"r",encoding="utf8") as f:
            llist = json.load(f)
            location_list = [Location(e["name"],e["gps"],e["note"]) for e in llist]
        with open(os.path.join(path,"pause_list.json"),"r",encoding="utf8") as f:
            pause_list = json.load(f)
        with open(os.path.join(path,"location_clusters.json"),"r",encoding="utf8") as f:
            location_clusters = [set(e) for e in json.load(f)]
        with open(os.path.join(path,"graph.json"),"r",encoding="utf8") as f:
            graph = json.load(f)
        with open(os.path.join(path,"location2clusterid.json"),"r",encoding="utf8") as f:
            location2clusterid = {}
            tmp = json.load(f)
            for k in tmp:
                location2clusterid[int(k)] = set(tmp[k])
        clusters = []
        for filename in os.listdir(os.path.join(path,"clusters")):
            with open(os.path.join(path,"clusters",filename),"r",encoding="utf8") as f:
                obj = json.load(f)
                c = Cluster(obj["location_cluster"])
                c.fromPatientList([(datetime.strptime(e["datetime"],"%Y-%m-%d %H:%M:%S"),int(e["node_id"])) for e in obj["patients"]])
                clusters.append(c)
        return cls(node_list,location_list,pause_list,path,location_clusters,location2clusterid,clusters,graph)

    def distance(self,str1,str2):
        lng1,lat1 = [radians(float(s)) for s in str1.split(",")]
        lng2,lat2 = [radians(float(s)) for s in str2.split(",")]
        a = lat1 - lat2
        b = lng1 - lng2
        return 2 * asin(sqrt(sin(a/2)**2+cos(lat1)*cos(lat2)*sin(b/2)**2))*6378.137

    def choose_pivot(self,P):
        max = 0
        u = -1
        for v in P:
            m = sum(self.graph[v])
            if m >= max:
                max = m
                u = v
        return u

    def get_neighbors(self,v):
        Nv = set()
        for j in self.clipped_locations:
            if self.graph[v][j] != 0 and v != j:
                Nv.add(j)
        return Nv

    def Bron_Kerbosch(self,R,P,X):
        if len(P)==0 and len(X)==0:
            self.location_clusters.append(R)
        u = self.choose_pivot(P)
        Nu = set()
        if u >= 0:
            Nu = self.get_neighbors(u)
        for v in (P - Nu):
            Nv = self.get_neighbors(v)
            self.Bron_Kerbosch(R | {v},P & Nv,X & Nv)
            P -= {v}
            X |= {v}

    def buildGraph(self,dmax):
        self.graph = [[0]*self.location_size for i in range(self.location_size)]
        for i in range(self.location_size):
            for j in range(i,self.location_size):
                if i == j:
                    self.graph[i][j] = 1
                elif self.distance(self.location_list[i].gps,self.location_list[j].gps) <= dmax:
                    self.graph[i][j] = 1
                    self.graph[j][i] = 1
    
    def buildClusters(self):
        #按地点index记录的团
        self.location_clusters = []
        #求极大团
        self.Bron_Kerbosch(set(),self.clipped_locations.copy(),set())
        #构建地点index到所在团的index
        self.location2clusterid = {}
        for i in range(len(self.location_clusters)):
            cluster = self.location_clusters[i]
            for location_id in cluster:
                if location_id not in self.location2clusterid:
                    self.location2clusterid[location_id] = set()
                self.location2clusterid[location_id].add(i)
        #构建以Cluster类记录的团
        self.clusters = []
        for cluster in self.location_clusters:
            self.clusters.append(Cluster(cluster))
        #对应团内添加人的停留信息
        for item in self.pause_list:
            node_id = item[0]
            location_id = item[1]
            date = item[2]
            time = item[3]
            if location_id not in self.location2clusterid:
                continue
            cluster_ids = self.location2clusterid[location_id]
            for cluster_id in cluster_ids:
                self.clusters[cluster_id].addPatient(datetime.strptime(" ".join([date,time]),"%Y-%m-%d %H:%M:%S"),node_id,location_id)
        #每个团的人员停留信息按时间顺序排序
        for cluster in self.clusters:
            cluster.sort()
    
    def save(self):
        if not os.path.exists(self.store_path):
            os.mkdir(self.store_path)
        with open(os.path.join(self.store_path,"node_list.json"),"w",encoding="utf8") as f:
            json.dump([n.getStoreFormat() for n in self.node_list],f)
        with open(os.path.join(self.store_path,"location_list.json"),"w",encoding="utf8") as f:
            json.dump([n.getStoreFormat() for n in self.location_list],f)
        with open(os.path.join(self.store_path,"pause_list.json"),"w",encoding="utf8") as f:
            json.dump(self.pause_list,f)
        with open(os.path.join(self.store_path,"location_clusters.json"),"w",encoding="utf8") as f:
            store_location_clusters = [list(c) for c in self.location_clusters]
            json.dump(store_location_clusters,f)
        with open(os.path.join(self.store_path,"graph.json"),"w",encoding="utf8") as f:
            json.dump(self.graph,f)
        with open(os.path.join(self.store_path,"location2clusterid.json"),"w",encoding="utf8") as f:
            store_location2clusterid = {}
            for key in self.location2clusterid:
                store_location2clusterid[str(key)] = list(self.location2clusterid[key])
            json.dump(store_location2clusterid,f)
        for i in range(len(self.clusters)):
            if not os.path.exists(os.path.join(self.store_path,"clusters")):
                os.mkdir(os.path.join(self.store_path,"clusters"))
            
            with open(os.path.join(self.store_path,"clusters/{}.json").format(i),"w",encoding="utf8") as f:
                json.dump(self.clusters[i].getStoreFormat(),f)

    def buildClusterEdges(self):
        self.node2clusters = {}
        for i in range(len(self.node_list)):
            self.node2clusters[i] = set()
        for item in self.pause_list:
            node_id = item[0]
            location_id = item[1]
            cluster_ids = self.location2clusterid[location_id]
            for cid in cluster_ids:
                self.node2clusters[node_id].add(cid)
    
    def outputCluster(self):
        n = len(self.location_clusters)
        adj = [[0]*n for i in range(n)]
        for s in self.node2clusters.values():
            clist = list(s)
            for i in range(len(clist)):
                for j in range(i+1,len(clist)):
                    c1 = self.clusters[clist[i]]
                    c2 = self.clusters[clist[j]]
                    if c1.getFirstTime() <= c2.getFirstTime():
                        adj[clist[i]][clist[j]] = 1
                        adj[clist[j]][clist[i]] = -1
                    else:
                        adj[clist[i]][clist[j]] = -1
                        adj[clist[j]][clist[i]] = 1
        with open(os.path.join(self.store_path,"clusters_adj.json"),"w",encoding="utf8") as f:
            json.dump(adj,f)
        
    def generateFormatData(self,start_time,end_time,district,filterNum=1,interval=60,people=[]):
        start_time = datetime.strptime(start_time,"%Y-%m-%d") if start_time != "" else None
        end_time = datetime.strptime(end_time,"%Y-%m-%d") if end_time != "" else None
        nodes = []
        edges = []
        clusters = []
        cluster_edges = []
        cnodes = []
        node_cnt = 0
        district_cluster = [c for c in self.clusters if len(set(district) & set(map(lambda x:self.location_list[x].note,c.location_cluster)))>=1]
        subClusters = []
        for cluster in district_cluster:
            for c in cluster.filterNodes(start_time,end_time,interval=interval):
                subClusters.append(c)
        def cantain(c1,c2):
            return (c2[0].issubset(c1[0]) and c2[1].issubset(c1[1])) \
                or (c2[0].issubset(c1[0]) and c1[0].issubset(c2[0]))
            # return c2[0].issubset(c1[0]) and c2[1].issubset(c1[1]) and c2[2] >= c1[2] and c2[3] <= c1[3]
        marks = set()
        for i in range(len(subClusters)):
            for j in range(i+1,len(subClusters)):
                if cantain(subClusters[i],subClusters[j]):
                    marks.add(j)
                    subClusters[i][1] |= subClusters[j][1]
                    subClusters[i][2] = min(subClusters[i][2],subClusters[j][2])
                    subClusters[i][3] = max(subClusters[i][3],subClusters[j][3])
                elif cantain(subClusters[j],subClusters[i]):
                    marks.add(i)
                    subClusters[j][1] |= subClusters[i][1]
                    subClusters[j][2] = min(subClusters[i][2],subClusters[j][2])
                    subClusters[j][3] = max(subClusters[i][3],subClusters[j][3])
                
        subClusters = [c for index,c in enumerate(subClusters) if index not in marks]

        if len(people) > 0:
            for cluster in subClusters:
                origin_id = cluster[0]
                filter_id = set([self.pid2nid[pid] for pid in people])
                new_id = origin_id & filter_id
                cluster[0] = new_id

        for cluster in subClusters:
            cluster_id = len(clusters)
            patients_id = cluster[0]
            if (len(patients_id) <= filterNum):
                continue
            locations_id = list(cluster[1])
            st = cluster[2]
            et = cluster[3]
            for pid in patients_id:
                patient = self.node_list[pid]
                nodes.append({
                    "pid": patient.pid,
                    "name": patient.name,
                    "gender":patient.gender,
                    "phone":patient.phone,
                    "diagnosedTime":patient.diagnosedTime,
                    "type":patient.type,
                    "clusterId": cluster_id,
                    "stayTime": str(st)
                })
            node_id1 = node_cnt
            node_cnt += len(patients_id)
            node_id2 = node_cnt
            for i in range(node_id1+1,node_id2):
                edges.append({
                    "source":node_id1,
                    "target":i,
                    "relation":"时空伴随",
                    "note":""
                })
            cnodes.append(patients_id)
            clusters.append({
                "id":"cluster-{}".format(cluster_id),
                "name":self.location_list[locations_id[0]].name,
                "gps":self.location_list[locations_id[0]].gps,
                "note":";".join([self.location_list[id].name for id in locations_id]),
                "nodes":list(range(node_id1,node_id2)),
                "rangeTime":"--".join([str(st),str(et)])
            })
        for i in range(len(cnodes)):
            for j in range(i+1,len(cnodes)):
                interset = cnodes[i] & cnodes[j]
                if len(interset) > 0:
                    itime = datetime.strptime(clusters[i]["rangeTime"].split("--")[0],"%Y-%m-%d %H:%M:%S")
                    jtime = datetime.strptime(clusters[j]["rangeTime"].split("--")[0],"%Y-%m-%d %H:%M:%S")
                    cluster_edges.append({
                        "source":"cluster-{}".format(i if itime<=jtime else j),
                        "target":"cluster-{}".format(i if itime>jtime else j),
                        "relation":"存在同一人",
                        "note":",".join([self.node_list[id].name for id in interset]),
                        "count":len(interset)
                    })
        for i in range(len(nodes)):
            for j in range(i+1,len(nodes)):
                if nodes[i]["pid"] == nodes[j]["pid"]:
                    itime = datetime.strptime(nodes[i]["stayTime"],"%Y-%m-%d %H:%M:%S")
                    jtime = datetime.strptime(nodes[j]["stayTime"],"%Y-%m-%d %H:%M:%S")
                    edges.append({
                        "source":i if itime<=jtime else j,
                        "target":i if itime>jtime else j,
                        # "relation":"--".join(
                        #     [str(itime),str(jtime)] if itime <= jtime else [str(jtime),str(itime)]
                        # ),
                        "relation":"相隔{}天".format(abs((itime-jtime).days)),
                        "note":nodes[i]["name"]
                    })
        return {"nodes":nodes,"edges":edges,"clusters":clusters,"clusterEdges":cluster_edges}
    
    def clipData(self,start_time,end_time):
        if len(start_time) == 0:
            return
        start_time = datetime.strptime(start_time,"%Y-%m-%d") if start_time != "" else None
        end_time = datetime.strptime(end_time,"%Y-%m-%d") if end_time != "" else None
        print(start_time,end_time)
        self.clipped_locations = set()
        for item in self.pause_list:
            location_id = item[1]
            date = " ".join([item[2],item[3]])
            date = datetime.strptime(date,"%Y-%m-%d %H:%M:%S")
            if start_time <= date <= end_time:
                self.clipped_locations.add(location_id)

    def formatData2csv(self,data,path):
        clusters = data["clusters"]
        cluster_edges = data["clusterEdges"]
        nodes = data["nodes"]
        items = []
        cluster_graph = [[0]*len(clusters) for i in range(len(clusters))]
        for c in clusters:
            items.append([
                c["id"],
                c["rangeTime"].split("--")[0],
                c["rangeTime"].split("--")[1],
                c["name"],
                c["gps"],
                ";".join([nodes[id]["name"] for id in c["nodes"]]),
                len(c["nodes"]),
                "/".join(sorted([[nodes[id]["name"],nodes[id]["diagnosedTime"]] for id in c["nodes"]],
                    key=lambda ele:datetime.strptime(ele[1],"%Y-%m-%d")).pop(0)),
                c["note"]
            ])
        for edge in cluster_edges:
            sid = int(regex.match(r'^cluster-(\d+)',edge["source"]).group(1))
            tid = int(regex.match(r'^cluster-(\d+)',edge["target"]).group(1))
            cluster_graph[sid][tid] = edge["note"]
            cluster_graph[tid][sid] = edge["note"]
        
        for i in range(len(clusters)):
            items[i].append(sum([1 if isinstance(ele,str) else 0 for ele in cluster_graph[i]]))
            neighbors = []
            for j in range(len(clusters)):
                if isinstance(cluster_graph[i][j],str):
                    neighbors.append("cluster-{}({})".format(j,cluster_graph[i][j]))
            items[i].append(";".join(neighbors))
        with open(path,"w",encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(["id","时间跨度起","时间跨度止","名称","经纬度","包含病例","总病例数","首例确诊","包含地点","连接度","链接团"])
            for item in items:
                writer.writerow(item)
            
# ag = AggregateGraph.load_data("./test")
# ag.buildGraph(0.1)
# ag.buildClusters()


        