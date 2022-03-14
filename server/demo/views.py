import copy
import datetime
import math
import re

import dill
import spacy
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import json
import os
import pymongo
from py2neo import Graph, Node, Relationship, NodeMatcher, RelationshipMatcher
from django.http import FileResponse
from bson import json_util
from pathlib import Path
import os
# Create your views here.

neo4j_path = "http://192.168.1.194:7474/"
mongo_path = pymongo.MongoClient(
    "mongodb://%s:%s@192.168.1.194:27017" % ("admin", "123456"))
db = mongo_path["surveys"]
col = db["production"] #患者表
col_contacts = db["contacts"] #密接者表
col_epidemic = db["epidemic"] #疫情表
graph = Graph(neo4j_path, user="neo4j", password="123456")
node_matcher = NodeMatcher(graph)
rel_matcher = RelationshipMatcher(graph)


@api_view(["POST"])
def upload(request):
    if request.method == "POST":
        data = request.data
        #col.insert_one(data)
        #name = data["basic"]["name"].strip()
        pname = data["basic"]["name"].strip()##
        gender = "男" if data["basic"]["gender"].strip() == "male" else "女"
        phone = data["basic"]["phone"].strip()
        age = data["basic"]["age"].strip()
        address = "".join(data["basic"]["addr1"]) + data["basic"]["addr2"]
        
        routes = data["routes"] ##
        if routes is not None:
            for r in routes: ##
                path = r["route"]
                #path = data["path"]
                tx = graph.begin()
                res = node_matcher.match("Patient", name=pname).first()
                if res is not None:
                    person_node = res
                    person_node["count"] += 1
                    tx.push(person_node)
                else:
                    person_node = Node("Patient", name=pname)
                    person_node["count"] = 1
                    person_node["gender"] = gender
                    person_node["phone"] = phone
                    person_node["age"] = age
                    person_node["address"] = address
                    tx.create(person_node)

                # create loc nodes
                #nodes = path["nodes"]
                nodes = [obj["pause"] for obj in path] ##
                loc_nodes = []
                for node in nodes:
                    print(node.keys())
                    time = node["time"]
                    name = node["location"]["name"]
                    address = node["location"]["address"]
                    district = node["location"]["district"]
                    location = node["location"]["location"]

                    res = node_matcher.match("Location", name=name).first()
                    if res is not None:
                        loc_node = res
                        loc_node["count"] += 1
                        tx.push(loc_node)
                    else:
                        loc_node = Node("Location", name=name)
                        loc_node["count"] = 1
                        loc_node["name"] = name
                        loc_node["time"] = time
                        loc_node["address"] = address
                        loc_node["district"] = district
                        loc_node["location"] = location

                        tx.create(loc_node)

                    loc_nodes.append(loc_node)

                    # create person loc relationship
                    print(person_node)
                    print(loc_node)
                    res = rel_matcher.match(nodes=[person_node, loc_node]).first()
                    if res is not None:
                        rel = res
                        rel["count"] += 1
                        tx.push(rel)
                    else:
                        rel = Relationship(person_node, "TravelTo", loc_node)
                        rel["count"] = 1
                        tx.create(rel)

                    # create contact and links
                    if "contacts" in node:
                        #contacts = node["contacts"].replace("，", ",").split(",")
                        contacts = [obj["name"] for obj in node["contacts"]]  ##
                        print(len(contacts))

                        for c in contacts:
                            res = node_matcher.match("Contact", name=c).first()
                            if res is not None:
                                c_node = res
                                c_node["count"] += 1
                                tx.push(c_node)
                            else:
                                c_node = Node("Contact", name=c)
                                c_node["count"] = 1
                                tx.create(c_node)

                            # link to person
                            res = rel_matcher.match(
                                nodes=[person_node, c_node]).first()
                            if res is not None:
                                rel = res
                                rel["count"] += 1
                                tx.push(rel)
                            else:
                                rel = Relationship(person_node, "With", c_node)
                                rel["count"] = 1
                                tx.create(rel)

                            # link to location
                            res = rel_matcher.match(nodes=[c_node, loc_node]).first()
                            if res is not None:
                                rel = res
                                rel["count"] += 1
                                tx.push(rel)
                            else:
                                rel = Relationship(c_node, "Locate", loc_node)
                                rel["count"] = 1
                                tx.create(rel)

                # create edges
                #edges = path["edges"]
                edges = [obj["travel"] for obj in path] ##
                edges = edges[:-1] if len(edges) == len(loc_nodes) else edges
                for i, e in enumerate(edges):
                    if e is None:
                        continue
                    #traffic = e["traffic"]
                    traffic = e["transform"] ##
                    #if "description" in e:
                    #    description = e["description"]
                    if "note" in e:
                        description = e["note"]
                    else:
                        description = ""
                    from_node = loc_nodes[i]
                    to_node = loc_nodes[i+1]

                    res = rel_matcher.match(nodes=[from_node, loc_node]).first()
                    if res is not None:
                        rel = res
                        rel["count"] += 1
                        tx.push(rel)
                    else:
                        rel = Relationship(from_node, "To", to_node)
                        rel["count"] = 1
                        rel["traffic"] = traffic
                        rel["description"] = description
                        tx.create(rel)
                tx.commit()
        col.insert_one(data)
        return Response({"result": "upload successfully!"}, status=status.HTTP_200_OK)

"""""
根据名字查询
输入:json
{
    "keyword":"***"
}
返回: 包含所有basic信息的list
{
    "result": []
}
"""""
@api_view(["POST"])
def query(request):
    data = request.data
    keyword = data['keyword'].strip()
    if len(keyword) == 0:
        query_res = col.find()
        res_return = []
        for res in query_res:
            res["_id"] = str(res["_id"])
            res_return.append(res)
        return Response({"result": res_return}, status=status.HTTP_200_OK )


    res = []
    query_res = col.find({"basic.name":{"$regex":".*{}.*".format(keyword)}})
    if query_res is None:
        return Response({"result":res}, status=status.HTTP_200_OK)
    else:
        for post in query_res:
            #post["_id"] = str(post["_id"])
            res.append(post["basic"])
            print(res)
        return Response({"result":res}, status=status.HTTP_200_OK)

# 返回所有人basic中的信息
@api_view(["GET"])
def getall(request):
    if request.method == "GET":
        #ret = col.find({}, {"_id": 0, "basic.name": 1, "basic.gender":1,"basic.phone":1,"basic.age":1,"basic.addr1":1,"basic.addr2":1,"basic.personal_id":1}).distinct("basic.personal_id")
        ret = col.find()
        json_list = []
        for i in ret.distinct("basic.personal_id"):
            ret2 = col.find_one({"basic.personal_id":i})
            json_list.append(ret2["basic"])
        ret1 = json.dumps(json_list)
        response = HttpResponse(ret1, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

# 测试用得到所有数据
@api_view(["GET"])
def testget(request):
    if request.method == "GET":
        ret = col.find()
        ret = json_util.dumps(ret)
        response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

# 上传一条数据
@api_view(["POST"])
def newupload(request):
    if request.method == "POST":
        data = request.data
        col.insert_one(data)
        return HttpResponse("succeed", status=status.HTTP_200_OK)

"""""
查找指定某人,返回除_id外的PersonDocument
输入:paraments
 personal_id:***
"""""
@api_view(["GET"])
def queryperson(request):
    if request.method == "GET":
        ret = col.find_one({"basic.personal_id":request.GET.get("personal_id")})
        ret2 = {}
        ret2['basic'] = ret['basic']
        ret2['routes'] = ret['routes']
        ret1 = json.dumps(ret2)
        response = HttpResponse(ret1, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

"""""
插入一条路径
输入json
{
   "personal_id":
    "data": {
        "date":""
        "route":[]
        "remarks":""
    }
}
"""""
@api_view(["POST"])
def insertRoute(request):
    if request.method == "POST":
        #print(request.data)
        id = request.data["personal_id"]
        print(id)
        data = request.data["data"]
        print(data)
        ret = col.find_one({"basic.personal_id": id})
        ret = json_util.dumps(ret)
        ret = json.loads(ret)

        # 先删掉这个数据后面更新后再插入
        #col.delete_one({"basic.personal_id":id})
        date1 = data["date"]
        month,day,year = date1.split("-")
        if len(year) == 4:
            data["date"] = year+"-"+month.zfill(2)+"-"+day.zfill(2)
        if ret["routes"] is None:
            routes = []
        else:
            routes = list(ret["routes"])
        routes.append(data)

        routes.sort(key=lambda x:x["date"])
        #col.update_one({"basic.personal_id": id},{"$set":{"routes":routes}})
        #col.insert_one(new)

        pname = ret["basic"]["name"].strip()  ##
        gender = "男" if ret["basic"]["gender"].strip() == "male" else "女"
        phone = ret["basic"]["phone"].strip()
        age = ret["basic"]["age"].strip()
        address = "".join(ret["basic"]["addr1"]) + ret["basic"]["addr2"]

        path = request.data["data"]["route"]
        # path = data["path"]
        tx = graph.begin()
        res = node_matcher.match("Patient", name=pname).first()
        if res is not None:
            person_node = res
            person_node["count"] += 1
            tx.push(person_node)
        else:
            person_node = Node("Patient", name=pname)
            person_node["count"] = 1
            person_node["gender"] = gender
            person_node["phone"] = phone
            person_node["age"] = age
            person_node["address"] = address
            tx.create(person_node)

        # create loc nodes
        # nodes = path["nodes"]
        nodes = [obj["pause"] for obj in path]  ##
        loc_nodes = []
        for node in nodes:
            print(node.keys())
            time = node["time"]
            name = node["location"]["name"]
            address = node["location"]["address"]
            district = node["location"]["district"]
            location = node["location"]["location"]

            res = node_matcher.match("Location", name=name).first()
            if res is not None:
                loc_node = res
                loc_node["count"] += 1
                tx.push(loc_node)
            else:
                loc_node = Node("Location", name=name)
                loc_node["count"] = 1
                loc_node["name"] = name
                loc_node["time"] = time
                loc_node["address"] = address
                loc_node["district"] = district
                loc_node["location"] = location

                tx.create(loc_node)

            loc_nodes.append(loc_node)

            # create person loc relationship
            print(person_node)
            print(loc_node)
            res = rel_matcher.match(nodes=[person_node, loc_node]).first()
            if res is not None:
                rel = res
                rel["count"] += 1
                tx.push(rel)
            else:
                rel = Relationship(person_node, "TravelTo", loc_node)
                rel["count"] = 1
                tx.create(rel)

            # create contact and links
            if "contacts" in node:
                # contacts = node["contacts"].replace("，", ",").split(",")
                contacts = [obj["name"] for obj in node["contacts"]]  ##
                print(len(contacts))

                for c in contacts:
                    res = node_matcher.match("Contact", name=c).first()
                    if res is not None:
                        c_node = res
                        c_node["count"] += 1
                        tx.push(c_node)
                    else:
                        c_node = Node("Contact", name=c)
                        c_node["count"] = 1
                        tx.create(c_node)

                    # link to person
                    res = rel_matcher.match(
                        nodes=[person_node, c_node]).first()
                    if res is not None:
                        rel = res
                        rel["count"] += 1
                        tx.push(rel)
                    else:
                        rel = Relationship(person_node, "With", c_node)
                        rel["count"] = 1
                        tx.create(rel)

                    # link to location
                    res = rel_matcher.match(nodes=[c_node, loc_node]).first()
                    if res is not None:
                        rel = res
                        rel["count"] += 1
                        tx.push(rel)
                    else:
                        rel = Relationship(c_node, "Locate", loc_node)
                        rel["count"] = 1
                        tx.create(rel)

        # create edges
        # edges = path["edges"]
        for obj in path:
            if "travel" not in obj:
                obj["travel"] = None
        edges = [obj["travel"] for obj in path]  ##
        edges = edges[:-1] if len(edges) == len(loc_nodes) else edges
        for i, e in enumerate(edges):
            if e is None:
                continue
            if "transform" not in e:
                continue
            # traffic = e["traffic"]
            traffic = e["transform"]  ##
            # if "description" in e:
            #    description = e["description"]
            if "note" in e:
                description = e["note"]
            else:
                description = ""
            from_node = loc_nodes[i]
            to_node = loc_nodes[i + 1]

            res = rel_matcher.match(nodes=[from_node, loc_node]).first()
            if res is not None:
                rel = res
                rel["count"] += 1
                tx.push(rel)
            else:
                rel = Relationship(from_node, "To", to_node)
                rel["count"] = 1
                rel["traffic"] = traffic
                rel["description"] = description
                tx.create(rel)
        tx.commit()
        col.update_one({"basic.personal_id": id}, {"$set": {"routes": routes}})

        response = HttpResponse("succeed", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
"""""
更新person数据
输入:json
{
    "oldid":"**", 旧的personal_id
    "PersonDocument":{} (注意无_id)
}
"""""
@api_view(["POST"])
def update(request):
    if request.method == "POST":
        id = request.data["oldid"]
        persondocument = request.data["PersonDocument"]
        col.delete_one({"basic.personal_id":id})

        col.insert_one(persondocument)
        return HttpResponse("succeed", status=status.HTTP_200_OK)

@api_view(["GET"])
def download_template(request):
    if request.method == "GET":
        file = open('./report.pdf', 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/pdf'
        response['Content-Disposition'] = 'attachment;filename="report.pdf"'
        return response

@api_view(["GET"])
def download_docx(request):
    if request.method == "GET":
        file = open('./report.docx', 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/docx'
        response['Content-Disposition'] = 'attachment;filename="report.docx"'
        return response

"""""
上传疫情数据
}
"""""
@api_view(["POST"])
def epidemicUpload(request):
    if request.method == "POST":
        data = request.data
        col_epidemic.insert_one(data)
        return HttpResponse("succeed", status=status.HTTP_200_OK)


"""""
上传密接者数据
"""""
@api_view(["POST"])
def contactUpload(request):
    if request.method == "POST":
        data = request.data
        col_contacts.insert_one(data)
        return HttpResponse("succeed", status=status.HTTP_200_OK)

"""""
获取所有密接者数据
"""""
@api_view(["GET"])
def getAllContacts(request):
    if request.method == "GET":
        ret = col_contacts.find()
        ret = json_util.dumps(ret)
        response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

"""""
获取所有疫情数据
"""""
@api_view(["GET"])
def getAllEpidemics(request):
    if request.method == "GET":
        ret = col_epidemic.find()
        ret = json_util.dumps(ret)
        response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["POST"])
def deleteperson(request):
    if request.method == "POST":
        x = col_contacts.delete_many({})

        return HttpResponse(x.deleted_count, status=status.HTTP_200_OK)



"""""
根据名字查询疫情
输入:json
{
    "name":"***"
}
返回: 包含所有信息的list
{
    "name":"日本东京",
    "patients":0,
    "first_time":"2021-01-03",
    "gene":"L型欧洲家系分支2.3",
    "temprature":[],
    "humidity":[]
}
"""""
@api_view(["POST"])
def queryEpidemic(request):
    if request.method == "POST":
        data = request.data
        name = data['name'].strip()
        ret = col_epidemic.find_one({"name": name})
        ret2 = {}
        ret2['name'] = ret['name']
        ret2['patients'] = ret['patients']
        ret2['first_time'] = ret['first_time']
        ret2['gene'] = ret['gene']
        ret2['temprature'] = ret['temprature']
        ret2['humidity'] = ret['humidity']
        ret1 = json.dumps(ret2)
        response = HttpResponse(ret1, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

"""""
根据名字查询属于疫情的Person
输入:json
{
    "name":"***" //疫情名称
}
返回: 属于该波疫情的所有人员的资料
"""""
@api_view(["POST"])
def queryEpidemicPerson(request):
    if request.method == "POST":
        data = request.data
        name = data['name'].strip()
        mydoc = col.find({"epidemic":name})
        ret = []
        for x in mydoc:
            temp = {}
            temp['epidemic'] = x['epidemic']
            temp['basic'] = x['basic']
            temp['routes'] = x['routes']
            ret.append(temp)
        ret1 = json.dumps(ret)
        response = HttpResponse(ret1, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response


"""""
根据经纬度查询这个范围内的detail_location
输入:json
{
    "location":"***" //
    'epidemic'
}
返回: 这个范围内的所有detail_location
"""""
@api_view(["POST"])
def queryDetailLocation(request):
    if request.method == "POST":
        data = request.data
        location = data['location'].strip()
        #date = data['date'].strip()
        epidemic = data['epidemic'].strip()
        longitude,latitude = location.split(',')
        longitude = float(longitude)
        latitude = float(latitude)
        mydoc = col.find({})
        ret = []
        eps = 0.1 #10km
        for x in mydoc:
            if epidemic != x['epidemic']:
                continue
            routes = x['routes']
            for i in routes:
                #if date != i['date']:
                   # continue
                route = i['route']
                for j in route:
                    pause = j['pause']
                    temp_location = pause['location']
                    temp_location = temp_location['location']
                    temp_longitude, temp_latitude = temp_location.split(',')
                    temp_longitude = float(temp_longitude)
                    temp_latitude = float(temp_latitude)
                    if temp_longitude >= longitude - eps and temp_longitude <= longitude + eps and temp_latitude >= latitude - eps and temp_latitude <= latitude + eps:
                        if 'detail_location'in pause:
                            temp_dict = {}
                            temp_dict["detail_location"] = pause['detail_location']
                            temp_dict["relate_basic"] = x["basic"]
                            ret.append(temp_dict)

        ret1 = json.dumps(ret)
        response = HttpResponse(ret1, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["POST"])
def updateNull(request):
    if request.method == "POST":
        mydoc = col.find({},{ "_id": 0})
        mydoc = json_util.dumps(mydoc)
        mydoc = json.loads(mydoc)
        for x in mydoc:
            col.update_one({"basic.personal_id": x["basic"]["personal_id"]},{"$set":{"epidemic": "北京顺义"}})
        """""
        mydoc = col.find({},{ "_id": 0})
        ret = []
        for x in mydoc:
            personal_id = x['basic']['personal_id']
            x = json_util.dumps(x)
            x = json.loads(x)
            routes = x['routes']
            for i in routes:
                route = i['route']
                for j in route:
                    pause = j['pause']
                    y = pause["time"].split(':')
                    a = y[0].strip().zfill(2)
                    b = y[1].strip().zfill(2)
                    pause["time"] = a+":"+b+":"+"00"

            col.delete_one({"basic.personal_id": personal_id})
            col.insert_one(x)
        """""
        """""
        mydoc = col.find({},{"_id": 0})
        mydoc = json_util.dumps(mydoc)
        mydoc = json.loads(mydoc)
        mylist = ["二楼的超市","超市门口的凳子","旁边的电话亭","里面的贩卖机","旁边的小站台","一楼的娃娃机"]
        count = 0
        for i in mydoc:
            if i["basic"]["name"] == "未某某":
                temp = i
                routes = i["routes"]
                routes.pop(0)
                for j in routes:
                    route = j["route"]
                    for t in route:
                        #t["pause"]["detail_location"] = mylist[count]
                        if count == 1:
                            print(t["pause"]["detail_location"])
                        if t["pause"]["detail_location"] == "超市门口的凳子":
                            t["pause"]["detail_location"] = "猪肉铺"
                        elif t["pause"]["detail_location"] == "里面的贩卖机":
                            t["pause"]["detail_location"] = "水果摊"
                        elif  t["pause"]["detail_location"] == "一楼的娃娃机":
                            t["pause"]["detail_location"] = "冷柜"
                        count = count + 1
                        #print(t["pause"]["detail_location"])
                #i["epidemic"] = "北京顺义"
                i["basic"]["name"] = "未某某"
                print(i)
            #col.delete_one({"basic.personal_id":i["basic"]["personal_id"]})
            #col.insert_one(i)
            """""
        """""
        mydoc = col.find({}, {"_id": 0})
        mydoc = json_util.dumps(mydoc)
        mydoc = json.loads(mydoc)
        for i in mydoc:
            if "epidemic" not in i:
                i["epidemic"] = "北京顺义"
                col.delete_one({"basic.personal_id":i["basic"]["personal_id"]})
                col.insert_one(i)
        """""
        return HttpResponse("success", status=status.HTTP_200_OK)


"""""
根据身份证号筛查相关信息
时间差8小时 距离差5km
输入:json
{
    "personal_id":"***" //身份证号
    "hour":8 //时间 小时
    "distance":5 //距离 千米
}
返回: 这个时间和距离范围内的所有相关信息
"""""
# lat lon - > distance
# 计算经纬度之间的距离，单位为千米

EARTH_REDIUS = 6378.137

def rad(d):
    return d * math.pi / 180.0


def getDistance(lat1, lng1, lat2, lng2):
    radLat1 = rad(lat1)
    radLat2 = rad(lat2)
    a = radLat1 - radLat2
    b = rad(lng1) - rad(lng2)
    s = 2 * math.asin(math.sqrt(math.pow(math.sin(a/2), 2) + math.cos(radLat1) * math.cos(radLat2) * math.pow(math.sin(b/2), 2)))
    s = s * EARTH_REDIUS
    return s

@api_view(["POST"])
def queryRelatedInfo(request):
    if request.method == "POST":
        data = request.data
        personal_id = data['personal_id']
        doc1 = col.find_one({"basic.personal_id":personal_id})
        doc1 = json_util.dumps(doc1)
        doc1 = json.loads(doc1) #这个人的信息
        mydoc = col.find({}) #所有人的信息
        mydoc = json_util.dumps(mydoc)
        mydoc = json.loads(mydoc)
        hour = data["hour"] #小时
        distance = data["distance"] #千米
        eps = 0.01*distance

        ret = []
        for i in doc1["routes"]:
            route = i["route"]
            date = i["date"]
            for j in route:
                time = j["pause"]["time"]
                location = j["pause"]["location"]["location"]
                longitude, latitude = location.split(',')
                longitude = float(longitude)
                latitude = float(latitude)

                #print(datetime.datetime.strptime(date+" "+time, "%Y-%m-%d %H: %M"))
                try:
                    datetime0 = datetime.datetime.strptime(date+" "+time, "%Y-%m-%d %H:%M:%S")
                except:
                    print(doc1["basic"]["personal_id"])
                    print(doc1["basic"]["age"])
                datetime1 = (datetime0 - datetime.timedelta(hours=hour)) #范围左
                datetime2 = (datetime0 + datetime.timedelta(hours=hour)) #范围右
                #print(datetime0,datetime1,datetime2)
                for person in mydoc: #遍历所有人
                    if person["basic"]["personal_id"] == personal_id: #跳过自己
                        continue
                    for k in person["routes"]:
                        route2 = k["route"]
                        date2 = k["date"]
                        for t in route2:
                            time2 = t["pause"]["time"]
                            datetime3 = datetime.datetime.strptime(date2+" "+time2, "%Y-%m-%d %H:%M:%S")
                            location2 = t["pause"]["location"]["location"]
                            longitude2, latitude2 = location2.split(',')
                            longitude2 = float(longitude2)
                            latitude2 = float(latitude2)

                            my_distance = round(getDistance(latitude,longitude,latitude2,longitude2),2)
                            if datetime3 >= datetime1 and datetime3 <= datetime2:
                                if my_distance <= distance:
                                    temp_dict = {}
                                    temp_dict["basic"] = doc1["basic"]
                                    temp_dict["time"] = datetime0.strftime("%Y-%m-%d %H:%M:%S")
                                    temp_dict["location"] = j["pause"]["location"]
                                    temp_dict["relate_basic"] = person["basic"]
                                    temp_dict["relate_time"] = datetime3.strftime("%Y-%m-%d %H:%M:%S")
                                    temp_dict["relate_location"] = t["pause"]["location"]
                                    temp_dict["distance_interval"] = my_distance
                                    if datetime3 > datetime0:
                                        temp_dict["time_interval"] = (datetime3 - datetime0).seconds
                                    else:
                                        temp_dict["time_interval"] = (datetime0 - datetime3).seconds
                                    ret.append(temp_dict)

        ret = json.dumps(ret)
        response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@api_view(["POST"])
def text2Info(request):
    text = request.data["text"]
    #BASEPATH = Path(__file__).resolve().parent.parent
    #mypath = BASEPATH.joinpath('myModel')
    nlp = spacy.load("myModel")

    doc = nlp(text)

    # 加载数据格式
    with open("./sample.json", encoding="utf8") as f:
        data = json.loads(f.read())

    with open("./routes.json", encoding="utf8") as f2:
        routesSample = json.loads(f2.read())

    with open("./route.json", encoding="utf8") as f3:
        routeSample = json.loads(f3.read())

    if (re.match(r'(.)*男(.)*', text)):
        data["basic"]["gender"] = "男"
    elif (re.match(r'(.)*女(.)*', text)):
        data["basic"]["gender"] = "女"
    elif (re.match(r'(.)*难(.)*', text)):
        data["basic"]["gender"] = "男"

    globalyear = ""
    for i in range(len(doc.ents)):
        ent = doc.ents[i]
        print(ent.text, ent.label_)
        if ent.label_ == "PERSON" and data["basic"]["name"] == "":  # 姓名
            data["basic"]["name"] = ent.text
        elif ent.label_ == "AGE" and data["basic"]["age"] == "":  # 年龄
            data["basic"]["age"] = ent.text.replace('岁', '')
        elif ent.label_ == "CARDINAL":
            if (len(ent.text) >= 8 and len(ent.text) <= 11) and data["basic"]["phone"] == "":  # 电话号码
                data["basic"]["phone"] = ent.text
            elif (len(ent.text) == 15 or len(ent.text) == 18) and data["basic"]["personal_id"] == "":  # 身份证号
                data["basic"]["personal_id"] = ent.text
        elif ent.label_ == "POSITION" and data["basic"]["vocation"] == "":  # 职位和工作地
            data["basic"]["vocation"] = ent.text
            # 查找其附近有没有出现地点
            if i - 1 >= 0 and doc.ents[i - 1].label_ == "LOC" and data["basic"]["working_place"] == "":
                data["basic"]["working_place"] = doc.ents[i - 1].text
            elif i + 1 < len(doc.ents) and doc.ents[i + 1].label_ == "LOC" and data["basic"]["working_place"] == "":
                data["basic"]["working_place"] = doc.ents[i + 1].text
        elif ent.label_ == "QUANTITY":  # 重量
            if (data["basic"]["weight"] == ""):
                if re.match(r'(\d)*千克', ent.text):
                    data["basic"]["weight"] = ent.text.replace('千克', '')
                elif re.match(r'(\d)*公斤', ent.text):
                    data["basic"]["weight"] = ent.text.replace('公斤', '')
                elif re.match(r'(\d)*斤', ent.text):
                    data["basic"]["weight"] = str(round(int(ent.text.replace('斤', '')) / 2, 1))
                elif re.match(r'(\d)*kg', ent.text):
                    data["basic"]["weight"] = ent.text.replace('kg', '')
                elif re.match(r'(\d)', ent.text):
                    data["basic"]["weight"] = ent.text
        elif ent.label_ == "HEIGHT":  # 身高
            if data["basic"]["height"] == "":
                if re.match(r'(\d)米(\d)*', ent.text):
                    data["basic"]["height"] = ent.text.replace('米', '')
                elif re.match(r'(\d)厘米', ent.text):
                    data["basic"]["height"] = ent.text.replace('厘米', '')
                elif re.match(r'(\d)m(\d)*', ent.text):
                    data["basic"]["height"] = ent.text.replace('m', '')
                elif re.match(r'(\d)cm', ent.text):
                    data["basic"]["height"] = ent.text.replace('cm', '')

                if (len(data["basic"]["height"]) < 3):  # 单位cm
                    data["basic"]["height"] = data["basic"]["height"] + "0"
        elif ent.label_ == "GPE":
            if data["basic"]["addr1"] == []:  # addr1
                if re.match(r'(.)*市', ent.text) and i + 1 < len(doc.ents) and doc.ents[i + 1].label_ == "GPE":
                    data["basic"]["addr1"] = [ent.text, "市辖区", doc.ents[i + 1].text]
        elif ent.label_ == "LOC":
            if data["basic"]["addr2"] == "" and i - 1 >= 0 and doc.ents[i - 1].label_ == "GPE":  # addr2
                data["basic"]["addr2"] = ent.text
        elif ent.label_ == "DATE":
            newroutes = copy.deepcopy(routesSample)

            matchObj = re.match(r'(\d)*年', ent.text)
            if matchObj and len(matchObj.group(0).replace('年', '')) == 4:
                year = matchObj.group(0).replace('年', '')
            else:
                if globalyear != "":
                    year = globalyear
                else:
                    year = datetime.datetime.now().year
            if globalyear == "":
                globalyear = year
            matchObj = re.match(r'(.*?)(\d)*月(.*?)', ent.text)
            if matchObj:
                # print("YES")
                # print(matchObj.group(2))
                month = str(matchObj.group(2).replace('月', '')).zfill(2)
            else:
                # print("NO")
                month = str(datetime.datetime.now().month).zfill(2)
            matchObj = re.match(r'(.*?)(\d)*日(.*?)', ent.text)
            if matchObj:
                day = str(matchObj.group(2).replace('日', '')).zfill(2)
            else:
                day = str(datetime.datetime.now().day).zfill(2)
            date = str(year) + "-" + str(month) + "-" + str(day)
            newroutes["date"] = str(year) + "-" + str(month) + "-" + str(day)

            newroute = copy.deepcopy(routeSample)
            for j in range(i, i + 5):
                if j < len(doc.ents):
                    if doc.ents[j].label_ == "LOC":
                        newroute["pause"]["location"]["name"] = doc.ents[j].text
                    elif doc.ents[j].label_ == "VEHICLE":
                        if re.match(".*公交.*", doc.ents[j].text):
                            newroute["travel"] = {"note": "", "transform": "公交","protection":""}
                        elif re.match(".*地铁.*", doc.ents[j].text):
                            newroute["travel"] = {"note": "", "transform": "地铁","protection":""}
                        newroute["travel"]["contacts"] = None
                    elif doc.ents[j].label_ == "PERSON":
                        if newroute["pause"]["contacts"] == None:
                            newroute["pause"]["contacts"] = []
                        newroute["pause"]["contacts"].append({"name": doc.ents[j].text,
                                                              "pid": "111111111111111111"})
                        if newroute["travel"] != None:
                            if newroute["travel"]["contacts"] == None:
                                newroute["travel"]["contacts"] = []
                            newroute["travel"]["contacts"].append({"name": doc.ents[j].text,
                                                                  "pid": "111111111111111111"})
                    elif doc.ents[j].label_ == "TIME":
                        matchObj = re.match(r'(\d*)(.*?)分(.*?)', doc.ents[j].text)
                        # print(doc.ents[j].text)
                        if matchObj:
                            # print(matchObj.group(1))
                            if newroute["pause"]["stay"] == None:
                                newroute["pause"]["stay"] = []
                            newroute["pause"]["stay"].append(matchObj.group(1))
                            newroute["pause"]["stay"].append("min")
                        else:
                            matchObj = re.match(r'(\d*)(.*?)时(.*?)', doc.ents[j].text)
                            # print(doc.ents[j].text)
                            if matchObj:
                                # print(matchObj.group(1))
                                if newroute["pause"]["stay"] == None:
                                    newroute["pause"]["stay"] = []
                                newroute["pause"]["stay"].append(matchObj.group(1))
                                newroute["pause"]["stay"].append("hour")
                    elif doc.ents[j].label_ == "DATE":
                        matchObj = re.match(r'(.*?)(\d*)时(.*)', doc.ents[j].text)
                        hour = ""
                        if matchObj:
                            hour = matchObj.group(2).zfill(2)
                        else:
                            matchObj = re.match(r'(.*?)(\d*)点(.*)', doc.ents[j].text)
                            if matchObj:
                                hour = matchObj.group(2).zfill(2)
                        time = hour + ": 00"
                        newroute["pause"]["time"] = time
            flag = True
            if data["routes"] != None:
                for i in data["routes"]:
                    if i["date"] == date:
                        flag = False
                        i["route"].append(newroute)
                        break
            if flag:
                if newroutes["route"] == None:
                    newroutes["route"] = []
                newroutes["route"].append(newroute)
                if data["routes"] == None:
                    data["routes"] = []
                data["routes"].append(newroutes)
    ret = json.dumps(data)
    response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "*"
    return response

@api_view(["POST"])
def initData(request):
    if request.method == "POST":
        with open("contact.json", 'r') as load_f:
            load_dict = json.load(load_f)
            for i in load_dict:
                del i["_id"]
                col_contacts.insert_one(i)
        return HttpResponse("success")

# 返回包含所有患者的地点list 热力图
@api_view(["GET"])
def getAllPlace(request):
    if request.method == "GET":
        mydoc = col.find({}, {"_id": 0})
        mydoc = json_util.dumps(mydoc)
        mydoc = json.loads(mydoc)
        ret = []
        count = 0
        for i in mydoc:
            if "routes" in i:
                routes = i["routes"]
                if routes == None:
                    continue
                for j in routes:
                    if "route" in j:
                        route = j["route"]
                        for k in route:
                            count = count  + 1
                            temp_dict = {}
                            location = k["pause"]["location"]["location"]
                            lng,lat = location.split(",")
                            temp_dict["lng"] = float(lng)
                            temp_dict["lat"] = float(lat)
                            temp_dict["count"] = 10
                            ret.append(temp_dict)
        print(count)
        ret = json.dumps(ret)
        response = HttpResponse(ret, content_type="application/json", status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
        response["Access-Control-Max-Age"] = "1000"
        response["Access-Control-Allow-Headers"] = "*"
        return response
