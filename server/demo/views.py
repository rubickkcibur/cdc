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
            person_node = Node("Patient", name=name, gender=gender, phone=phone, age=age, address=address)
            
            tx.create(person_node)

        for p in path:
            # every events
            if 'location' in p:
                time = p["time"]
                location = p["location"]
                longtitude = p["longtitude"]
                latitude = p["latitude"]
                contacts = p["contacts"]
                detail = p["detail"]

                for contact in contacts:
                    contact_node = Node("Contact", name=contact)
                    r1 = Relationship()

                loc_node = Node("Event", time=time, location=location, longtitude=longtitude, latitude=latitude,detail=detail)





            
            





