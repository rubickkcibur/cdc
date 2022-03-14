import json

import spacy
from spacy.matcher import Matcher

nlp = spacy.load("zh_core_web_sm")

pattern1 = [{"POS": "VERB"},{"TEXT": "男"}]
pattern2 = [{"POS": "VERB"},{"TEXT": "女"}]
matcher = Matcher(nlp.vocab)

matcher.add("PATTERN1", None, pattern1)
matcher.add("PATTERN2", None, pattern2)

text = "我的名字是田雨桐,我的性别是男,我54了,在第三小学当老师,我住在北京市海淀区花园路街道,我的身份证号码是493424488112787549,我的电话是723593966,我1米62,我164斤,我14日步行去书店转了转,"
doc = nlp(text)
# 遍历匹配结果
for match_id, start, end in matcher(doc):
    # 打印匹配到的字符串名字及匹配到的span的文本
    print(doc.vocab.strings[match_id], doc[start+1:end].text)