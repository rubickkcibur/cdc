import json

# 节点列表，存放病例信息
list_nodes = []
# 边列表，存放传染关系
list_edges = []
# 输出json文件的字典
outdic = {
    "nodes": list_nodes,
    "edges": list_edges
}


def add_a_node(pid, phone, name, gender, diagnosedTime, level, type):
    tmp_dic = {
        "pid": pid,
        "phone": phone,
        "name": name,
        "gender": gender,
        "diagnosedTime": diagnosedTime,
        "level": level,
        "type": type
    }
    list_nodes.append(tmp_dic)


def add_a_edge(id, source, target, relation, isTruth):
    tmp_dic = {
        "id": id,
        "source": source,
        "target": target,
        "relation": relation,
        "isTruth": isTruth
    }
    list_edges.append(tmp_dic)


if __name__ == '__main__':
    with open("reason_result.json", 'r', encoding='utf-8') as fw:
        reason_result = json.load(fw)

    edge_num = 0
    for i in range(len(reason_result)):
        if reason_result[i].get('recorded') == 0:
            list_nodes.append(reason_result[i])
            continue
        pid = reason_result[i].get('pid')
        phone = "12345678901"                # search_database
        name = reason_result[i].get('name')
        gender = "男"                        # search_database
        diagnosedTime = "2021-11-13"         # search_database
        if reason_result[i].get('father') != -1:
            level = str(int(list_nodes[reason_result[i].get('father')].get('level')) + 1)
        else:
            level = "0"
        typee = "确诊"                        # search_database

        add_a_node(pid, phone, name, gender, diagnosedTime, level, typee)

        if reason_result[i].get('father') != -1:
            id = str(edge_num)
            source = str(reason_result[i].get('father'))
            target = str(i)
            relation = reason_result[i].get('relation')
            isTruth = reason_result[i].get('isTruth')

            edge_num += 1
            add_a_edge(id, source, target, relation, isTruth)

    with open("test.json", 'w', encoding='utf-8') as fw:
        json.dump(outdic, fw, indent=4, ensure_ascii=False)
