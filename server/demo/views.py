from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
import os
import pymongo
from py2neo import Graph, Node, Relationship, NodeMatcher, RelationshipMatcher
# Create your views here.

neo4j_path = "bolt://123.57.0.181:7687"
mongo_path = pymongo.MongoClient("mongodb://%s:%s@39.105.232.15:2005"%("admin", "123456"))
db = mongo_path["surveys"]
col = db["production"]
graph = Graph(neo4j_path, user="neo4j", password="123456")
node_matcher = NodeMatcher(graph)
rel_matcher = RelationshipMatcher(graph)

@api_view(["POST"])
def upload(request):
    if request.method == "POST":
        data = request.data
        
        col.insert_one(data)
        name = data["basic"]["name"].strip()
        gender = "男" if data["basic"]["gender"].strip() == "male" else "女"
        phone = data["basic"]["phone"].strip()
        age = data["basic"]["age"].strip()
        address = "".join(data["basic"]["addr1"]) + data["basic"]["addr2"]

        path = data["path"]
        tx = graph.begin()
        res = node_matcher.match("Patient", name=name).first()
        if res is not None:
            person_node = res
            person_node["count"] += 1
            tx.push(person_node)
        else:
            person_node = Node("Patient", name=name)
            person_node["count"] = 1
            person_node["gender"] = gender
            person_node["phone"] = phone
            person_node["age"] = age
            person_node["address"] = address
            tx.create(person_node)

       
        # create loc nodes
        nodes = path["nodes"]
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
                contacts = node["contacts"].replace("，", ",").split(",")
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
                    res = rel_matcher.match(nodes=[person_node, c_node]).first()
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
        edges = path["edges"]
        edges = edges[:-1] if len(edges) == len(loc_nodes) else edges
        for i, e in enumerate(edges):
            traffic = e["traffic"]
            if "description" in e:
                description = e["description"]
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
        return Response({"result":"upload successfully!"}, status=status.HTTP_200_OK)




         


            

        
        
               





                


                





            
            






                


                





            
            





