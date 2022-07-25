from distutils.command.build import build
from email import utils
import json
import os
from tkinter import N
from tkinter.messagebox import NO
from urllib import response
from django.http import HttpResponse
from django.shortcuts import render
from app01.models import *
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app01.utils.reasoning import get_reason_result
from app01.utils.cluster import Cluster
from app01.max_clique.cluster import AggregateGraph
import datetime 
import math
from functools import reduce
# Create your views here.
@api_view(["POST"])
def get_chain(request):
    if request.method == "POST":
        data = request.data
        pid = data["pid"]
        version = data["version"]
        result = get_reason_result(pid,version)
        nodes = []
        edges = []
        edgeCount = 0
        for i, p in enumerate(result):
            pid = p["pid"]
            if len(pid) > 0:
                person = App01Patient.objects.get(pid=pid)
                nodes.append({
                    "pid": person.pid,
                    "phone": person.phone,
                    "name": person.name,
                    "gender": person.gender,
                    "diagnosedDate": str(person.diagnoseddate),
                    "level": p["level"],
                    "type": "核酸阴性" if person.diagnoseddate is None else "确诊"
                })
            else:
                pass
            if p["father"] >= 0:
                edges.append({
                    "id": edgeCount,
                    "source": p["father"],
                    "target": i,
                    "relation": p["relation"],
                    "isTruth": p["isTruth"]
                })
                edgeCount += 1
        ret = {"nodes": nodes, "edges": edges}
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["POST"])
def save_chain(request):
    if request.method == "POST":
        data = request.data
        nodes = data["nodes"]
        edges = data["edges"]
        nodeid2idx = {}
        chain = []
        for idx,node in enumerate(nodes):
            nodeid2idx[node["id"]] = idx
            chain.append({
                "pid":node["pid"],
                "name":node["name"],
                "recorded":1,
                "father":-1,
                "relation":"",
                "level":0,
                "isTruth":1
            })
        for edge in edges:
            source = edge["source"]
            target = edge["target"]
            sourceid = nodeid2idx[source]
            targetid = nodeid2idx[target]
            relation = edge["relation"]
            isTruth = edge["isTruth"]
            chain[targetid]["father"] = sourceid
            chain[targetid]["relation"] = relation
            chain[targetid]["isTruth"] = isTruth
        flag = True
        while(flag):
            flag = False
            for n in chain:
                if n["father"] == -1:
                    continue
                if n["level"] != chain[n["father"]]["level"] + 1:
                    flag = True
                    n["level"] = chain[n["father"]]["level"] + 1
        datestamp = str(datetime.datetime.now())
        with open("app01/chains/chain_{}.json".format(datestamp),"w",encoding="utf8") as f:
            json.dump(chain,f)
        response = HttpResponse(status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["GET"])
def get_all_versions(request):
    if request.method == "GET":
        files = os.listdir("app01/chains")
        files = [os.path.splitext(f.split("_")[1])[0] for f in files]
        response = HttpResponse(json.dumps(files), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["GET"])
def get_all_patients(request):
    if request.method == "GET":
        ret = []
        for e in App01Patient.objects.all():
            ret.append({
                "pid": e.pid,
                "name": e.name,
                "gender":"男" if e.gender else "女",
                "phone":e.phone,
                "diagnosedTime":str(e.diagnoseddate),
                "type":"确诊"
            })
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

@api_view(["GET"])
def get_clusters(request):
    location2cluster = {}
    for contact in App01Contact.objects.all():
        did = contact.contacttravel_id
        gps = contact.contactaddress_id
        pid = contact.pid1_id
        # print(pid)
        contact_name = contact.pid2
        contact_type = contact.type
        if gps is None and did is None:
            print(contact.__dict__)
        if did is not None:
            if did not in location2cluster:
                location = App01Dynamiclocation.objects.get(id = did)
                name = location.name
                note = location.note
                gps = ""
                location2cluster[did] = Cluster(name,gps,note)
            location2cluster[did].add_edge(pid,contact_name,contact_type)
        else:
            if gps not in location2cluster:
                name = contact.contactaddressname_id
                note = ""
                location2cluster[gps] = Cluster(name,gps,note)
            location2cluster[gps].add_edge(pid,contact_name,contact_type)
    nodes = []
    edges = []
    clusters = []
    cluster_edges = []
    node_cnt = 0
    cluster_cnt = 0
    for key,value in location2cluster.items():
        if len(value.edges) < 5:
            continue
        value.change_type()
        name2cnt = {}
        for name in value.generate_nodes_set():
            name2cnt[name] = node_cnt
            node_cnt += 1
            if name.isdigit():
                patient = App01Patient.objects.get(pid=name)
                nodes.append({
                    "pid": patient.pid,
                    "name": patient.name,
                    "gender":"男" if patient.gender else "女",
                    "phone":patient.phone,
                    "diagnosedTime":str(patient.diagnoseddate),
                    "type":"确诊",
                    "clusterId": cluster_cnt
                })
            else:
                nodes.append({
                    "pid": "not recorded",
                    "name": name,
                    "gender":"男",
                    "phone":"not recorded",
                    "diagnosedTime":"",
                    "type":"核酸阴性",
                    "clusterId": cluster_cnt
                })
        for edge in value.edges:
            edges.append({
                "source":name2cnt[edge[0]],
                "target":name2cnt[edge[1]],
                "relation":edge[2],
                "note":""
            })
        clusters.append({
            "id":"cluster-{}".format(cluster_cnt),
            "name":value.name,
            "gps":value.gps,
            "note":value.note,
            "nodes":list(name2cnt.values())
        })
        cluster_cnt += 1
    for i in range(len(nodes)):
        id = nodes[i]["pid"]
        if not id.isdigit():
            continue
        for j in range(i+1,len(nodes)):
            id2 = nodes[j]["pid"]
            if id == id2:
                edges.append({
                    "source":i,
                    "target":j,
                    "relation":"同一人",
                    "note":""
                })
                if nodes[i]["clusterId"] != nodes[j]["clusterId"]:
                    cluster_edges.append({
                        "source":clusters[nodes[i]["clusterId"]]["id"],
                        "target":clusters[nodes[j]["clusterId"]]["id"],
                        "relation":"存在同一人",
                        "note":"备注",
                        "count":1
                    })
    print(len(clusters),len(cluster_edges))
    ret = {"nodes":nodes,"edges":edges,"clusters":clusters,"clusterEdges":cluster_edges}
    response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response

@api_view(["POST"])
def get_clusters2(request):
    data = request.data
    dist = data["dist"]
    start_time = data["startTime"]
    end_time = data["endTime"]
    district = data["district"]
    filterNum = data["filter"]
    ag = AggregateGraph.load_data("./app01/max_clique/test")
    ag.clipData(start_time,end_time)
    ag.buildGraph(dist)
    ag.buildClusters()
    re = ag.generateFormatData(start_time,end_time,district,filterNum)
    response = HttpResponse(json.dumps(re), content_type="application/json", status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response

@api_view(["POST"])
def get_patient_route(request):
    if request.method == "POST":
        ret = []
        route=[]
        alldate=[]
        nodate=[]
        places=[]
        patientid=request.data["pid"]
        #patientid = request.GET.get("pid")
        nodate=list(App01Stay.objects.filter(pid=patientid,startdate=None).values_list('lname','gps'))
        alldate=list(set(list(App01Stay.objects.filter(pid=patientid).values_list('startdate',flat=True).order_by('startdate'))))
        alldate.sort()
        #print(alldate)
        for i in range(len(alldate)):
            start=[]
            end=[]
            places = list(App01Stay.objects.filter(pid=patientid,startdate=alldate[i]).values_list('lname','gps'))
            start = list(App01Stay.objects.filter(pid=patientid,startdate=alldate[i]).values_list('starttime',flat=True))
            end = list(App01Stay.objects.filter(pid=patientid,startdate=alldate[i]).values_list('endtime',flat=True))
            for j in range(len(places)):
                places[j]=places[j]+(str(start[j]),)+(str(end[j]),)
            
            places.insert(0,str(alldate[i]))
            route.append(places)
        route.append(nodate)
        e=App01Patient.objects.filter(pid=patientid).first()
        ret.append({
            #按需
            "pid": e.pid,
            "name": e.name,
            "gender": "男" if e.gender else "女",
            "phone": e.phone,
            "vocation":e.vocation,
            "height":e.height,
            "weight":e.weight,
            "smoking":e.smoking,
            "vaccine":e.vaccine,
            "diagnosedTime": str(e.diagnoseddate),
            "hospitalTime": str(e.hospitaldate),
            "note": e.note,
            "type": "确诊",
            "route":route
        })
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

@api_view(["POST"])
def get_person(request):
    if request.method == "POST":
        patientid = request.GET.get("pid")
        contactlist = []
        contactlist = list(App01Contact.objects.filter(pid1=patientid))
        contact_people = []
        same_place_people = []
        for i in range(len(contactlist)):
            contact_people.append({
                "pid": contactlist[i].pid2, #name
                "phone": contactlist[i].phone,
                "type": contactlist[i].type,
            })
        placelist = []
        placelist = list(App01Stay.objects.filter(pid=patientid).values_list('lname','gps'))
        for i in range(len(placelist)):
            tmpgps = placelist[i][1]
            tmp = list(App01Stay.objects.filter(gps=tmpgps).values_list('pid', 'lname', 'gps'))
            for j in range(len(tmp)):
                if tmp[j][0] == patientid:
                    continue
                e = App01Patient.objects.filter(pid=tmp[j][0]).first()
                #去重
                """flag = 0
                for k in range(len(contactlist)):
                    if contactlist[k].pid2 == e.name:
                        flag = 1
                        break
                if flag == 1:
                    continue"""
                
                same_place_people.append({
                    # 按需
                    "pid": e.pid,
                    "name": e.name,
                    "gender": "男" if e.gender else "女",
                    "phone": e.phone,
                    "vocation": e.vocation,
                    "height": e.height,
                    "weight": e.weight,
                    "smoking": e.smoking,
                    "vaccine": e.vaccine,
                    "diagnosedTime": str(e.diagnoseddate),
                    "hospitalTime": str(e.hospitaldate),
                    "note": e.note,
                    "type": "确诊",
                    "crushplace": placelist[i][0],
                    "crushplacegps": placelist[i][1]
                })
        ret = [
            contact_people,
            same_place_people
        ]
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

# 根据传入的的时间差和距离差返回病人关系图
@api_view(["POST"])
def get_patientmap_d_t(request):
    if request.method == "POST":
        patientid=request.data["pid"]
        tv=request.data["timeValue"]
        tu=request.data["timeUnit"]
        dv=request.data["distanceValue"]
        du=request.data["distanceUnit"]
        #patientid = request.GET.get("pid")
        #tv=request.GET.get("timeValue")
        #tu=request.GET.get("timeUnit")
        #dv=request.GET.get("distanceValue")
        #du=request.GET.get("distanceUnit")


        ret = get_patient_d_t(patientid,float(tv),float(tu),float(dv),float(du))

        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

# 根据传入的id返回病人关系图
@api_view(["POST"])
def get_patientmap_d_t_sel(request):
    if request.method == "POST":
        patientid=request.data["pid"]
        #tv=request.GET.get("timeValue")
        #tu=request.GET.get("timeUnit")
        #dv=request.GET.get("distanceValue")
        #du=request.GET.get("distanceUnit")
        #patientid=request.GET.get("pid")
        #timeUnit = request.GET.get("timeUnit")

        ret = get_patient_d_t(patientid,100,100,100,100)
        tmp = list(App01Contact.objects.filter(pid1 = patientid).values_list("pid2","phone","type","contactaddress","contactaddressname"))
        for i in range(len(tmp)):
            ret[0]["node_persons"].append({
                "name":tmp[i][0],
                "phone":tmp[i][1],
                "type":"密接",
                })
            ret[0]["edge_relation"].append({
                "pid1":patientid,
                "pid2":tmp[i][0],
                "contact_type":tmp[i][2],
                "crushlocationname":tmp[i][4],
                "crushlocation":tmp[i][3],

                })
        

        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

@api_view(["GET"])
def test_contact(request):
    #contact表里的pid1有问题吗？
    if request.method == "GET":
        ret=[]
        for e in App01Contact.objects.all():
            # print(e.__dict__)
            ret.append({
                "e.pid1":e.pid1_id,
                "e.pid2":e.pid2,
            })
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")



def turn_name(name,people):
    k=0
    for i in people:
        if i["name"]==name :
            return k
        k=k+1

def turn_pid(pid,people):
    k = 0
    for i in people:
        if i["pid"] == pid :
            return k
        k = k + 1

@api_view(["GET"])
def get_patientmap_d_t_all(request):
    if request.method == "GET":
        ret = []
        people1=[]
        people2=[]
        edge=[]
        tmpedge1=[]
        tmpedge2=[]
        tmpedge=[]
        tmppeople=[]
        run_function = lambda x, y: x if y in x else x + [y]

        for e in App01Patient.objects.all():
            people1.append({
                "pid": e.pid,
                "name": e.name,
                "gender": "男" if e.gender else "女",
                "phone": e.phone,
                "vocation": e.vocation,
                "height": e.height,
                "weight": e.weight,
                "smoking": e.smoking,
                "vaccine": e.vaccine,
                "diagnosedTime": str(e.diagnoseddate),
                "hospitalTime": str(e.hospitaldate),
                "note": e.note,
                "type": "patient"
            })
        for e in App01Contact.objects.all():
            flag2=0
            for tt in people1:
                if tt["name"]==e.pid2:
                    flag2=1
                    break
            if flag2==0:
                tmppeople={
                "pid": None,
                "name": e.pid2,
                "phone": e.phone,
                "type": "contact"
                }
                people1.append(tmppeople)
        for e in App01Contact.objects.all():
            placelist=[]
            flag=1
            for tt in tmpedge:
                if tt["source"] == turn_pid(e.pid1_id,people1) and tt["target"] == turn_name(e.pid2,people1):
                    flag = 0
                    if e.contactaddressname_id not in tt["location"]:
                        tt["location"].append(e.contactaddressname_id)
            if flag == 1:
                placelist.append(e.contactaddressname_id)
                newedge = {
                    "source": turn_pid(e.pid1_id,people1),
                    "target": turn_name(e.pid2,people1),
                    "type": "密接",
                    "contacttype":e.type,
                    "location": placelist
                }
                tmpedge.append(newedge)
        for e in App01Patient.objects.all():
            # tep=get_patient_d_t(e.pid, 0, 0, 0, 0)[0]["edge_relation"]
            # for te in tep:
            #     flag=1
            #     newedge=[]
            #     placelist=[]
            #     tp1=max(te["pid1"],te["pid2"])
            #     tp2=min(te["pid2"],te["pid2"])
            #     for tt in tmpedge1:
            #         if tt["source"]==tp1 and tt["target"]==tp2:
            #             flag=0
            #             if te["crushlocationname"] not in tt["location"]:
            #                 tt["location"].append(te["crushlocationname"])
            #     if flag==1:
            #         placelist.append(te["crushlocationname"])
            #         newedge={
            #             "source": te["pid1"],
            #             "target": te["pid2"],
            #             "type": "密接",
            #             "location": placelist
            #         }
            #         tmpedge1.append(newedge)
            tep2=get_patient_d_t(e.pid, 100, 100, 0, 0)[0]["edge_relation"]
            for te in tep2:
                flag = 1
                newedge = []
                placelist = []
                tp1=turn_pid(max(te["pid1"],te["pid2"]),people1)
                tp2=turn_pid(min(te["pid1"],te["pid2"]),people1)
                for tt in tmpedge:
                    if tt["source"] == tp1 and tt["target"] == tp2:
                        flag = 0
                        break
                if flag == 0 :
                    continue
                for tt in tmpedge2:
                    if tt["source"] == tp1 and tt["target"] == tp2:
                        flag = 0
                        if te["crushlocationname"] not in tt["location"]:
                            tt["location"].append(te["crushlocationname"])
                        break
                if flag == 1:
                    placelist.append(te["crushlocationname"])
                    newedge = {
                        "source": tp1,
                        "target": tp2,
                        "type": "时空伴随",
                        "location": placelist
                    }
                    tmpedge2.append(newedge)


        ret={
            "node_list": people1,
            "edge_list": tmpedge+tmpedge1+tmpedge2
        }
        response = HttpResponse(json.dumps(ret), content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
    else:
        print("method wrong!")

def get_patient_d_t(patientid,timeValue,timeUnit,distanceValue,distanceUnit):
    ret = []
    person=[]
    edge=[]
    contactlist = list(App01Contact.objects.filter(pid1=patientid).values_list('pid2','phone','type'))
    
    placelist = []
    placelist = list(App01Stay.objects.filter(pid=patientid).values_list('lname','gps','startdate','starttime','enddate','endtime'))
    for i in range(len(placelist)):
        tmpgps = placelist[i][1]
        lo1 = math.radians(float(tmpgps.split(",")[0]))
        la1 = math.radians(float(tmpgps.split(",")[1]))
        tmpst = placelist[i][3] if placelist[i][3]!=None else datetime.time( 12, 00, 00) 
        tmpet = placelist[i][5] if placelist[i][5]!=None else tmpst
        tmp = list(App01Stay.objects.filter(startdate=placelist[i][2], enddate=placelist[i][4]).values_list('pid','gps','starttime','endtime','lname'))
        tmp1=[]
        dis=[]
        tim=[]
        for j in range(len(tmp)):
            tmp1st = tmp[j][2] if tmp[j][2]!=None else datetime.time( 12, 00, 00)
            tmp1et = tmp[j][3] if tmp[j][3]!=None else tmp1st
            #时间筛选
            if time2hour(tmp1et)>=time2hour(tmpst)-timeValue*timeUnit and time2hour(tmp1et)<=time2hour(tmpet)+timeValue*timeUnit:
                #空间筛选
                lo2 = math.radians(float(tmp[j][1].split(",")[0]))
                la2 = math.radians(float(tmp[j][1].split(",")[1]))
                d = 6378.13*math.acos(math.sin(la1)*math.sin(la2)+math.cos(la1)*math.cos(la2)*math.cos(lo2-lo1))
                #print(6378.13*math.acos(math.sin(0)*math.sin(math.pi/2)+math.cos(0)*math.cos(math.pi/2)))
                if d <= distanceValue*distanceUnit:
                    tmp1.append(tmp[j])
                    dis.append(d)
                    tim.append(abs(time2hour(tmp1et)-time2hour(tmpst)))

        for j in range(len(tmp1)):
            if tmp1[j][0] == patientid:
                continue
            edge.append({
                "pid1": patientid,
                "pid2": tmp1[j][0],
                "pid2_name": tmp1[j][0],
                "crushlocationname": placelist[i][0],
                "crushlocation": placelist[i][1],
                "crushlocationname2": tmp1[j][4],
                "crushlocation2": tmp1[j][1],
                "distance": dis[j],
                "time_interval":tim[j],
                "crushdate": str(placelist[i][2]),
                "crushtime": str(placelist[i][3])
            })
            flag = 0
            for k in range(len(person)):
                if person[k]['pid'] == tmp1[j][0]:
                    edge[-1]["pid2_name"] = person[k]['name']
                    flag=1
                    break
            if flag==0:
                e = App01Patient.objects.filter(pid=tmp1[j][0]).first()
                edge[-1]["pid2_name"] = e.name
                person.append({
                    "pid": e.pid,
                    "name": e.name,
                    "gender": "男" if e.gender else "女",
                    "phone": e.phone,
                    "vocation":e.vocation,
                    "height":e.height,
                    "weight":e.weight,
                    "smoking":e.smoking,
                    "vaccine":e.vaccine,
                    "diagnosedTime": str(e.diagnoseddate),
                    "hospitalTime": str(e.hospitaldate),
                    "note": e.note,
                    "type": "确诊",
                })
    e=App01Patient.objects.filter(pid=patientid).first()
    ret.append({
        #按需
        "pid": e.pid,
        "name": e.name,
        "gender": "男" if e.gender else "女",
        "phone": e.phone,
        "vocation":e.vocation,
        "height":e.height,
        "weight":e.weight,
        "smoking":e.smoking,
        "vaccine":e.vaccine,
        "diagnosedTime": str(e.diagnoseddate),
        "hospitalTime": str(e.hospitaldate),
        "note": e.note,
        "type": "确诊",
        "node_persons":person,
        "edge_relation":edge
    })
    return ret

def time2hour(timein):
    tmp = str(timein).split(":")
    return float(tmp[0])+float(tmp[1])/60+float(tmp[2])/3600