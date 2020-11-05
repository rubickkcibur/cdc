from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import os
import pymongo
from py2neo import Graph, Node, Relationship, NodeMatcher
# Create your views here.

neo4j_path = "bolt://39.105.232.15:2002"
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
        path = data["path"].strip()
        
        res = matcher.match("Patient", name=name, gender=gender, phone=phone, age=age, address=address).first()

        tx = graph.begin()
        if res is not None:
            person_node = res
        else:
            person_node = Node("Patient", name=name)
            person_node[gender] = gender
            person_node[phone] = phone
            person_node[age] = age
            person_node[address] = address 

            
            tx.create(person_node)

        last_event_node = None
        last_transportation = ""
        last_trans_detail = ""
        for i, p in enumerate(path):
            # every events
            if 'location' in p:
                
                time = p["time"]
                location = p["location"]
                longtitude = p["longtitude"]
                latitude = p["latitude"]
                contacts = p["contacts"]
                detail = p["detail"]

                event_node = Node("Event", name=location)

                event_node["time"] = time
                event_node["location"] = location
                event_node["longtitude"] = longtitude
                event_node["latitude"] = latitude
                event_node["detail"] = detail

                tx.create(event_node)

                if i > 0:
                    r_trans = Relationship(last_event_node, last_transportation, event_node, {"detail":last_trans_detail})
                    tx.merge(r_trans)

                for contact in contacts:
                    contact_node = Node("Contact", name=contact)
                    r1 = Relationship(person_node, "contact", contact_node)
                    r2 = Relationship(event_node, "related", contact_node)
                    tx.merge(r1)
                    tx.merge(r2)
                last_event_node = event_node

            else:
                
                last_transportation = p["transportation"]
                last_trans_detail = p["detail"]
        

        return Response({"result":"upload successfully!"}, status=status.HTTP_200_OK)
        

                


                





            
            





