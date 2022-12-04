from html import entities
from app01.models import *
import os
from datetime import datetime

from app01.utils.reasoning import mask_name

kb_path = "./kb"
quad_path = os.path.join(kb_path,"quads.txt")
relation_path = os.path.join(kb_path,"relations.txt")
entity_dir = os.path.join(kb_path,"entities")
if not os.path.exists(kb_path):
    os.mkdir(kb_path)
if not os.path.exists(entity_dir):
    os.mkdir(entity_dir)
quads = []
relation2id = {}

pid2peid = {}
pnames = {}
for p in App01Patient.objects.all():
    pid = p.pid
    peid = "patient-{}".format(pid)
    pid2peid[pid]=peid
    pnames[p.name]=peid
    with open(os.path.join(entity_dir,"{}.txt".format(peid)),"w",encoding="utf8") as f:
        f.write("id: {}\n".format(peid))
        f.write("type: patient\n")
        f.write("pid: {}\n".format(pid))
        f.write("name: {}\n".format(mask_name(p.name)))
        f.write("age: {}\n".format(p.age))
        f.write("gender: {}\n".format("male" if p.gender==1 else "female"))
        f.write("vocation: {}\n".format(p.vocation))
        f.write("height: {}\n".format(p.height))
        f.write("weight: {}\n".format(p.weight))
        f.write("smoking: {}\n".format(p.smoking==1))
        f.write("vaccine: {}\n".format(p.vaccine))
        f.write("diagnoseddate: {}\n".format(p.diagnoseddate))
        f.write("hospitaldate: {}\n".format(p.hospitaldate))
        f.write("note: {}\n".format(p.note))

lname2leid = {}
lid = 0
for l in App01Location.objects.all():
    lname = l.name5
    leid = "location-{}".format(lid)
    lid+=1
    lname2leid[lname]=leid
    with open(os.path.join(entity_dir,"{}.txt".format(leid)),"w",encoding="utf8") as f:
        f.write("id: {}\n".format(leid))
        f.write("type: location\n")
        f.write("name1: {}\n".format(l.name1))
        f.write("name2: {}\n".format(l.name2))
        f.write("name3: {}\n".format(l.name3))
        f.write("name4: {}\n".format(l.name4))
        f.write("name5: {}\n".format(l.name5))
        f.write("gps: {}\n".format(l.gps))

dlid2dleid = {}
for dl in App01Dynamiclocation.objects.all():
    dlid = dl.id
    dleid = "Dlocation-{}".format(dlid)
    dlid2dleid[dlid]=dleid
    with open(os.path.join(entity_dir,"{}.txt".format(dleid)),"w",encoding="utf8") as f:
        f.write("id: {}\n".format(dleid))
        f.write("type: Dlocation\n")
        f.write("name: {}\n".format(dl.name))
        f.write("note: {}\n".format(dl.note))

iid2ieid = {}
for i in App01Item.objects.all():
    iid = i.id
    ieid = "item-{}".format(iid)
    iid2ieid[iid]=ieid
    with open(os.path.join(entity_dir,"{}.txt".format(ieid)),"w",encoding="utf8") as f:
        f.write("id: {}\n".format(ieid))
        f.write("type: item\n")
        f.write("name: {}\n".format(i.name))
        f.write("note: {}\n".format(i.note))

contact_types = ['同居','同事','同学','同车','共餐','同行','短暂接触','开会']

relation2id["发生密接"] = len(relation2id)
for t in contact_types:
        relation2id[t] = len(relation2id)
for c in App01Contact.objects.all():
    name = c.pid2
    if name in pnames:
        eid = pnames[name]
    else:
        eid = "contact-{}".format(c.id)
        with open(os.path.join(entity_dir,"{}.txt".format(eid)),"w",encoding="utf8") as f:
            f.write("id: {}\n".format(eid))
            f.write("type: contact\n")
            f.write("name: {}\n".format(mask_name(name)))
            f.write("phone: {}\n".format(c.phone))
    if c.contacttravel_id is None:
        leid = lname2leid[c.contactaddressname_id]
    else:
        leid = dlid2dleid[c.contacttravel_id]
    quads.append((eid,relation2id["发生密接"],leid,None,None))
    quads.append((pid2peid[c.pid1_id],relation2id["发生密接"],leid,None,None))
    quads.append((eid,relation2id[contact_types[c.type]],pid2peid[c.pid1_id],None,None))

for s in App01Stay.objects.all():
    peid = pid2peid[s.pid_id]
    start = datetime.strptime("--".join([str(s.startdate),str(s.starttime)]),"%Y-%m-%d--%H:%M:%S")
    if s.enddate is None or s.endtime is None:
        end = None
    else:
        end = datetime.strptime("--".join([str(s.enddate),str(s.endtime)]),"%Y-%m-%d--%H:%M:%S")
    action = s.action
    if action not in relation2id:
        relation2id[action] = len(relation2id)
    leid = lname2leid[s.lname_id]
    quads.append((peid,relation2id[action],leid,start,end))

relation2id["乘坐"] = len(relation2id)
for d in App01Ride.objects.all():
    peid = pid2peid[d.pid_id]
    start = datetime.strptime("--".join([str(d.startdate),str(d.starttime)]),"%Y-%m-%d--%H:%M:%S")
    if d.enddate is None or d.endtime is None:
        end = None
    else:
        end = datetime.strptime("--".join([str(d.enddate),str(d.endtime)]),"%Y-%m-%d--%H:%M:%S")
    dleid = dlid2dleid[d.did_id]
    quads.append((peid,relation2id["乘坐"],dleid,start,end))

relation2id["接触"] = len(relation2id)
relation2id["位于"] = len(relation2id)
for t in App01Touch.objects.all():
    peid = pid2peid[t.pid1_id]
    start = datetime.strptime("--".join([str(t.touchdate),str(t.touchtime)]),"%Y-%m-%d--%H:%M:%S")
    end = None
    ieid = iid2ieid[t.iid]
    quads.append((peid,relation2id["接触"],ieid,start,end))
    leid = lname2leid[t.touchaddressname_id]
    quads.append((ieid,relation2id["位于"],leid,None,None))

for p in App01Patient.objects.all():
    peid = pid2peid[p.pid]
    heid = lname2leid[p.homeaddressname_id]
    quads.append((peid,relation2id["居住"],heid,None,None))
    if p.workingaddressname_id is not None:
        weid = lname2leid[p.workingaddressname_id]
        quads.append((peid,relation2id["工作"],weid,None,None))

with open(relation_path,"w",encoding="utf8") as f:
    for name,id in relation2id.items():
        f.write("{}\t{}\n".format(name,id))

quads = ["{}\t{}\t{}\t{}\t{}\n".format(q[0],q[1],q[2],"--".join(str(q[3]).split()),"--".join(str(q[4]).split())) for q in quads]
quads = set(quads)

with open(quad_path,"w",encoding="utf8") as f:
    for q in quads:
        f.write(q)






