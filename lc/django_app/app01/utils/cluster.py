class Cluster():
    def __init__(self,name,gps,note):
        self.name = name
        self.gps = [float(s) for s in gps.strip().split(",")] if len(gps) > 0 else []
        self.note = note
        self.edges = []
    def add_edge(self,pid,contact_name,contact_type):
        self.edges.append([pid,contact_name,contact_type])
    def generate_nodes_set(self):
        s = set()
        for edge in self.edges:
            s.add(edge[0])
            s.add(edge[1])
        return s
    def change_type(self):
        for edge in self.edges:
            ctype = edge[2]
            if ctype == 0:
                edge[2] = "同居"
            elif ctype == 1:
                edge[2] = "同事"
            elif ctype == 2:
                edge[2] = "同学"
            elif ctype == 3:
                edge[2] = "同车"
            elif ctype == 4:
                edge[2] = "共餐"
            elif ctype == 5:
                edge[2] = "同行"
            elif ctype == 6:
                edge[2] = "短暂接触"
            elif ctype == 7:
                edge[2] = "开会"