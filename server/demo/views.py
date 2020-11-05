from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import os
import pymongo
from py2neo import Graph, Node, Relationship, NodeMatcher
# Create your views here.

neo4j_path = "bolt://123.57.0.181:7687"
mongo_path = pymongo.MongoClient("mongodb://%s:%s@39.105.232.15:2005"%("admin", "123456"))
db = mongo_path["surveys"]
col = db["production"]
graph = Graph(neo4j_path, user="neo4j", password="123456")
matcher = NodeMatcher(graph)

@api_view(["POST"])
def upload(request):
    '''
    params:
    data:[
        name: "",
        gender:"",
        phone:"",
        age:"",
        address:"",
        path:[
            {
                time: "YYYY-MM-DD HH:MM"
                location: "str",
                longtitude:127.022
                latitude:98.022
                contacts:["person A", "person B"],
                detail:""
            },
            {
                transportation: "",
                detail:"".
            },
            {
                ...
            }
        ]
    ]
    '''
    if request.method == "POST":
        data = request.data
        col.insert_one(data)
        name = data["name"].strip()
        gender = data["gender"].strip()
        phone = data["phone"].strip()
        age = data["age"].strip()
        address = data["address"].strip()
        path = data["path"]
        
        res = matcher.match("Patient", name=name, gender=gender, phone=phone, age=age, address=address).first()

        tx = graph.begin()
        if res is not None:
            person_node = res
        else:
            person_node = Node("Patient", name=name)
            if len(gender)> 0:
                person_node[gender] = gender
            if len(phone) > 0:
                person_node[phone] = phone
            if len(age) > 0:
                person_node[age] = age
            if len(address) > 0:
                person_node[address] = address  
            
            tx.create(person_node)
            tx.commit()
        last_event_node = None
        last_transportation = ""
        last_trans_detail = ""
        for i, p in enumerate(path):
            # every events
            
            if 'location' in p:
                tx = graph.begin()
                time = p["time"]
                location = p["location"]
                longtitude = p["longtitude"]
                latitude = p["latitude"]
                contacts = p["contacts"]
                detail = p["detail"]

                event_node = Node("Event", name=location)
                if len(time) > 0:
                    event_node["time"] = time
                if len(location) > 0:
                    event_node["location"] = location
                if len(longtitude) > 0:
                    event_node["longtitude"] = longtitude
                if len(latitude) > 0:
                    event_node["latitude"] = latitude
                if len(detail) > 0:
                    event_node["detail"] = detail
                r0 = Relationship(person_node, "travelTo", event_node)
                tx.create(event_node)
                tx.create(r0)
   
                if i > 0:
                    # print(last_event_node)
                    # print(last_transportation)
                    # print(event_node)
                    # r_type = Relationship.type(last_transportation)
                    r_trans = Relationship(last_event_node, last_transportation, event_node)

                    tx.create(r_trans)
                tx.commit()
                for contact in contacts:
                    tx = graph.begin()
                    res = matcher.match("Contact", name=contact).first()
                    print(contact)
                    print(res)
                    if res is not None:
                        contact_node = res
                    else:
                        contact_node = Node("Contact", name=contact)
                        tx.create(contact_node)
                    r1 = Relationship(person_node, "contact", contact_node)
                    r2 = Relationship(event_node, "related", contact_node)
                    
                    tx.create(r1)
                    tx.create(r2)
                    tx.commit()
                    # tx.merge(r1)
                    # tx.merge(r2)
                last_event_node = event_node

            else:
                
                last_transportation = p["transportation"]
                last_trans_detail = p["detail"]
        
        
        return Response({"result":"upload successfully!"}, status=status.HTTP_200_OK)


                


                





            
            





