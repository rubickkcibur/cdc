from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import os
import pymongo
from py2neo import Node
# Create your views here.

neo4j_path = "bolt://39.105.232.15:2002"
mongo_path = pymongo.MongoClient("mongodb://%s:%s@39.105.232.15:2005"%("admin", "123456"))
db = mongo_path["surveys"]
col = db["production"]
graph = Graph(database, user="neo4j", password="123456")

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
                seq_id:0,
                time: "YYYY-MM-DD HH:MM"
                location: "str",
                contacts:["person A", "person B"],
                detail:""
            },
            {
                seq_id:1,
                transportation: "",
                detail:"".
            },
            {
                seq_id: 2
            }
        ]
    ]
    '''
    if request.method == "POST":
        data = request.data
        col.insert_one(data)
        name = data["name"].strip()
        gender = data["gender"].strip()
        phone = data["phone"]
        age = data["age"]
        address = data["address"]
        path = data["path"]
        for p in path:
            # every events
            





