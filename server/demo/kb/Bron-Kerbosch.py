import os
import json
from math import *
import numpy as np
from numpy.core.numeric import zeros_like
import time

def distance(str1,str2):
    lng1,lat1 = [radians(float(s)) for s in str1.split(",")]
    lng2,lat2 = [radians(float(s)) for s in str2.split(",")]
    a = lat1 - lat2
    b = lng1 - lng2
    return 2 * asin(sqrt(sin(a/2)**2+cos(lat1)*cos(lat2)*sin(b/2)**2))*6378.137

def build_graph(d_max):
    n = len(no2name)
    g = np.zeros(shape=[n,n],dtype=int)
    for i in range(n):
        for j in range(i,n):
            if i == j:
                g[i,j] = 1
            elif distance(no2name[i][1],no2name[j][1]) < d_max:
                g[i,j] = 1
                g[j,i] = 1
            else:
                g[i,j] = 0
    return g

def set2label(s):
    label = 0
    for i in s:
        label |= 1 << i
    return label

def label2set(l):
    cnt = 0
    s = set()
    while l:
        if l & 1 != 0:
            s.add(cnt)
        cnt += 1
        l >>= 1
    return s

def report(R):
    all_max_cliques.append(list(R))

def Bron_Kerbosch(R,P,X):
    if len(P)==0 and len(X)==0:
        report(R)
    while P:
        v = P.pop()
        Nv = set()
        for j in range(location_size):
            if g[v,j] != 0 and v != j:
                Nv.add(j)
        Bron_Kerbosch(R | {v},P & Nv,X & Nv)
        X |= {v}

def choose_pivot(P):
    max = 0
    u = -1
    for v in P:
        m = np.sum(g[v])
        if m >= max:
            max = m
            u = v
    return u

def get_neighbors(v):
    Nv = set()
    for j in range(location_size):
        if g[v,j] != 0 and v != j:
            Nv.add(j)
    return Nv

def Bron_Kerbosch2(R,P,X):
    if len(P)==0 and len(X)==0:
        report(R)
    u = choose_pivot(P)
    Nu = set()
    if u >= 0:
        Nu = get_neighbors(u)
    for v in (P - Nu):
        Nv = get_neighbors(v)
        Bron_Kerbosch(R | {v},P & Nv,X & Nv)
        P -= {v}
        X |= {v}

def Dynamic(set_n2): 
    global g
    n_label_sets = set_n2
    n_cnt = 2
    while len(n_label_sets)>0:
        n_sets = [label2set(i) for i in n_label_sets]
        size = len(n_sets)
        markers = [0] * size
        next_label_sets = set()
        for i in range(size):
            for j in range(i+1,size):
                intersection = n_sets[i] & n_sets[j]
                if len(intersection) == n_cnt - 1:
                    a = (n_sets[i]-intersection).pop()
                    b = (n_sets[j]-intersection).pop()
                    if (g[a,b] != 0):
                        markers[i] = 1
                        markers[j] = 1
                        next_label_sets.add(set2label(n_sets[i] | n_sets[j]))
        for i in range(size):
            if markers[i] == 0:
                report(n_sets[i])
        n_cnt += 1
        print("done,n=",n_cnt,"size=",len(next_label_sets))
        n_label_sets = next_label_sets

def minimize_patient_cliques(patc):
    patc = [set(l) for l in patc]
    removes = []
    result = []
    clique_no = []
    for i in range(len(patc)):
        if len(patc[i]) <= 1:
            removes.append(i)
            continue
        # clique_no.append(i) #true
        for j in range(i+1,len(patc)):
            if patc[i] == patc[j]:
                removes.append(i)
            elif len(patc[i]) < len(patc[j]):
                if patc[i] & patc[j] == patc[i]:
                    removes.append(i)
            else:
                if patc[j] & patc[i] == patc[j]:
                    removes.append(j)

    for i in range(len(patc)):
        if i not in removes:
            result.append(list(patc[i]))
            clique_no.append(i) #false
    return result,clique_no


def start(build=False,traverse=False,dmax=5,version=2):
    global g,all_max_cliques,location_size
    if build:
        g = build_graph(dmax)
        time_start = time.time() 
        if version == 1:
            Bron_Kerbosch(set(),set(range(location_size)),set())
        elif version == 2:
            Bron_Kerbosch2(set(),set(range(location_size)),set())
        elif version == 3:
            label_sets = set()
            for i in range(location_size):
                for j in range(i+1,location_size):
                    if g[i,j] != 0:
                        label_sets.add((1 << i) | (1 << j))
            Dynamic(label_sets)
        print("search done,time:",time_start-time.time())
        with open("all_max_cliques_v{}_{}.json".format(version,dmax),"w",encoding="utf-8") as f:
            json.dump(all_max_cliques,f,ensure_ascii=False)
    else:
        all_max_cliques = json.load(open("./all_max_cliques_v{}_{}.json".format(version,dmax),"r",encoding="utf-8"))

    if traverse:
        time_start = time.time()
        patient_cliques = [set() for i in range(len(all_max_cliques))]
        for p,locas in patient2locas.items():
            for l in locas:
                for i in range(len(all_max_cliques)):
                    if l in all_max_cliques[i]:
                        patient_cliques[i].add(p)
        patient_cliques = [list(s) for s in patient_cliques]
        print("traverse done,time:",time_start-time.time())
        with open("patient_cliques_v{}_{}.json".format(version,dmax),"w",encoding="utf-8") as f:
            json.dump(patient_cliques,f,ensure_ascii=False)
    else:
        patient_cliques = json.load(open("./patient_cliques_v{}_{}.json".format(version,dmax),"r",encoding="utf8"))
    return all_max_cliques,patient_cliques


BK_VERSION = 2
DMAX = 0.5
all_max_cliques = []
name2no = json.load(open("./name2no.json","r",encoding="utf-8"))
no2name = json.load(open("./no2name.json","r",encoding="utf-8"))
location_size = len(no2name)
patient2locas = json.load(open("./patient2locas.json","r",encoding="utf-8"))
_,patc = start(build=True,traverse=True,version=BK_VERSION,dmax=DMAX)
result,clique_no = minimize_patient_cliques(patc)
with open("./result_v{}_{}.json".format(BK_VERSION,DMAX),"w",encoding="utf8") as fr,\
    open("./clique_no_v{}_{}.json".format(BK_VERSION,DMAX),"w",encoding="utf8") as fc:
    json.dump(result,fr,ensure_ascii=False)
    json.dump(clique_no,fc,ensure_ascii=False)
