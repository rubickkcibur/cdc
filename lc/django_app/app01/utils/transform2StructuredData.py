

from datetime import datetime
import os,re,pymysql,functools

import requests,json


def getOccupation(text):
    symbolsRe = "[\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3011)\uff09\n\uff08(]"
    job = re.findall('职业[:：]\s*?(.*?)\s*?%s'%(symbolsRe),text)
    if len(job)==0:
        if text.find('学生')!=-1 or text.find('学校')!=-1 or text.find('在读')!=-1:
            job='学生'
        else: 
            job = re.findall('%s\s*?(.*?保安)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?业)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(个体.*?户.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('职业为(.*?)\s*?%s'%(symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(物业.*?人员)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?保洁.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(农民.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?退休.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?销售.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?摄影师.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?医务人员.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?医生.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?家庭主妇.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?店主.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?工程师.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?司机.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?批发商.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?创业.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?配送员.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?职员.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            if len(job) == 0:
                job = re.findall('%s\s*?(.*?网络剪辑.*?)\s*?%s'%(symbolsRe,symbolsRe),text)
            job = job[0]
    else:
        job = job[0]
    return job

def getWorkPlace(text):
    symbolsRe = "[\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3011)\uff09\n]"
    workPlace = re.findall('工作[地单][位址点][:：为](.*?)%s'%(symbolsRe),text)
    if len(workPlace)==0:
        workPlace = re.findall('[商店单公][铺司位].*?[:：为](.*?)%s'%(symbolsRe),text)
    if len(workPlace)==0:
        workPlace = re.findall('学校.*?[:：为](.*?)%s'%(symbolsRe),text)
    workPlace = workPlace[0]
    return workPlace

def getHomeAddress(text):
    ChinaRe = "[\u4e00-\u9fa5]"
    notSymbolsRe = "[^\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3000\uff08\u0028]"
    SymbolRe="[\uff0c\u3002\uff1b%3b\u3010]"
    # 现住址及户籍地
    addressType1 = re.findall("(%s*?住址%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    # addressType1 += re.findall("(%s*?宿舍%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?家庭地址%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?住地%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?现居住%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?现地址%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?居地%s*)[:：]"%(notSymbolsRe,notSymbolsRe),text)
    addressType1 += re.findall("(%s*?居住%s*?地址%s*)[:：]"%(notSymbolsRe,ChinaRe,notSymbolsRe),text)
    len1 = len(addressType1)
    nowAddr = []
    if len1 > 0:
        nowAddr = re.findall("%s[:：](.*?)%s"%(addressType1[0],SymbolRe),text)
        # # print(nowAddr)
    if len1 == 0:
        nowAddr += re.findall(".*?居住在(.*?)%s"%(SymbolRe),text)
        nowAddr += re.findall(".*?现住址为(.*?)%s"%(SymbolRe),text)
        nowAddr += re.findall(".*?现住址（*?%s*?）*?[:：](.*?)%s"%(ChinaRe,SymbolRe),text)
        nowAddr += re.findall(".*?家庭[地|住]址（*?%s*?）*?[:：](.*?)%s"%(ChinaRe,SymbolRe),text)
    nowAddress = nowAddr[0]
    return nowAddress

def getHeightAndWeight(text):
    SymbolRe="[\uff0c\u3002\uff1b\u3010,;.\n]"
    height = re.findall('身[高长][:：]*?\s*?([0-9.]*?)\s*?[cC厘]*?[mM米]*?左*?右*?\s*?%s'%(SymbolRe),text)

    height = height[0]
    weight = re.findall('体重[:：]*?\s*?([0-9.]*?)\s*?[kK千公]*?[gG克斤]*?左*?右*?\s*?%s'%(SymbolRe),text)
    weight = weight[0]
    return height,weight

def getSmokeInfo(text):
    ChinaRe = "[\u4e00-\u9fa5]"
    isSmoke = re.findall('(%s*?)[吸抽]烟史*?'%(ChinaRe),text)
    if len(isSmoke) > 0:
        isSmoke = isSmoke[0]
    else:
        isSmoke = re.findall('(%s*?)特*?殊*?不良嗜好'%(ChinaRe),text)
    if len(isSmoke) > 0:
        isSmoke = isSmoke[0]
    else:
        isSmoke = re.findall('(%s*?)[吸|烟]'%(ChinaRe),text)[0] 
    return isSmoke

def getAdmissDate(id,year,month,text):
    hospitalDate = ''
    symbolsRe = "[。，;；：]"
    notSymbolsRe = "[^\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3000\uff08\u0028]"
    ChinaRe = "[0-9\u4e00-\u9fa5、，,:（）()]"
    texts = text.split('\n')
    flag = 0
    admissDate = ""
    for info in texts:
        if info.find('医院')!=-1 and info.find('隔离')!=-1:
            if info.rfind('月')==-1 and  info.rfind('日')==-1:
                break
            info = info[0 if info.rfind('日')-10<0 else info.rfind('日')-10 ::]
            admissDate = re.findall('\s*?(\d*?年*?\d*?月\d*?日)%s*?医院%s*?隔离.*?'%(ChinaRe,ChinaRe),info)
            if len(admissDate) == 0:
                admissDate = re.findall('%s*?(\d*?年?\d*?月\d*?日)%s*?医院%s*?隔离.*?'%(symbolsRe,ChinaRe,ChinaRe),info)
                if len(admissDate) > 0:
                    flag = 1
                    break
            else:
                flag = 1
                break
    if flag == 0:
        # print("无法自动获取编号为{}的住院日期，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # hospitalDate = input()
        return hospitalDate
    admissDate = admissDate[0]
    if admissDate.find('年')==-1:
        month2 = admissDate[0:admissDate.find('月')]
        if month2>=month:
            hospitalDate += year+'-'+month2+'-'
        else:
            hospitalDate += str(int(year)+1)+'-'+month2+'-'
    else:
        hospitalDate += admissDate[0:admissDate.find('年')]+ '-'+admissDate[admissDate.find('年')+1:admissDate.find('月')]+'-'
    hospitalDate += admissDate[admissDate.find('月')+1:admissDate.find('日')]
    return hospitalDate
    
def getDiagnosedDate(id,year,month,text):
    ChinaRe = "[0-9\u4e00-\u9fa5、，,:（）()]"
    diagnosedDate = ''
    try:
        text = text[0:text.index('阳性')+2]
        if text.find('月')!=-1 and text.find('日')!=-1:
            text = text[0 if text.rfind('日')-10<0 else text.rfind('日')-10 ::]
            
            try:
                dDate = re.findall('\s*?(\d*?年*?\d*?月\d*?日)%s*?阳性'%(ChinaRe),text)[0]
                if dDate.find('年')==-1:
                    month2 = dDate[0:dDate.find('月')]
                    if month2>=month:
                        diagnosedDate += year+'-'+month2+'-'
                    else:
                        diagnosedDate += str(int(year)+1)+'-'+month2+'-'
                else:
                    diagnosedDate += dDate[0:dDate.find('年')]+ '-'+dDate[dDate.find('年')+1:dDate.find('月')]+'-'
                diagnosedDate += dDate[dDate.find('月')+1:dDate.find('日')]
            except:
                # print("无法自动获取编号为{}的确诊日期，请手动输入：".format(id))
                # os.system(r'notepad {}'.format(f.name))
                # diagnosedDate = input()
                pass
        else:
            # print("无法自动获取编号为{}的确诊日期，请手动输入：".format(id))
            # os.system(r'notepad {}'.format(f.name))
            # diagnosedDate = input()
            pass
    except:
        # print("无法自动获取编号为{}的确诊日期，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # diagnosedDate = input()
        pass
    
    return diagnosedDate

def getNote(text):
    ChinaRe = "[0-9\u4e00-\u9fa5、，,:（）()]"
    note = re.findall('疾病情况[：:]\s*?(%s+?)[。\s]'%(ChinaRe),text)
    if len(note)==0:
        return ''
    return note[0]

# 病例信息：在基本情况（一）和发现经过（二）部分寻找信息
def getPatientInfo(id,year,month,text):
    pid = ''
    try:
        pid = re.findall('(【id_\d+?】)',text)[0]
    except:
        # print("无法自动获取编号为{}的身份证号，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # pid = input()
        pass
    age = ''
    try:
        age = re.findall('(\d{1,2})岁',text)[0]
    except:
        # print("无法自动获取编号为{}的年龄，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # age = input()
        pass
    gender = ''
    try:
        gender = re.findall('(男|女)',text)[0]
    except:
        # print("无法自动获取编号为{}的性别，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # gender = input()
        pass
    homeAddressName,workingAddressName = '',''
    try:
        homeAddressName = getHomeAddress(text)
    except:
        # print("无法自动获取编号为{}的家庭住址，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # homeAddressName = input()
        pass
    try:
        workingAddressName = getWorkPlace(text)
    except:
        # print("无法自动获取编号为{}的工作地址，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # workingAddressName = input()
        pass
    phone = ''
    try:
        phone = re.findall('【phone_\d+?】',text)[0]
    except:
        # print("无法自动获取编号为{}的手机号，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # phone = input()
        pass
    vocation = ''
    try:
        vocation = getOccupation(text)
    except:
        # print("无法自动获取编号为{}的职业，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # vocation = input()
        pass
    height,weight = '',''
    try:
        height,weight = getHeightAndWeight(text)
    except:
        # print("无法自动获取编号为{}的身高和体重，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name)) 
        # heightAndWeight = input()
        # height,weight = '','' if heightAndWeight=='' else heightAndWeight.split(',')
        pass
    smoking = ''
    try:
        smoking = getSmokeInfo(text)
    except:
        # print("无法自动获取编号为{}的吸烟史，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # smoking = input()
        pass
    vaccine = 0
    symbolsRe = "[\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3011)\uff09\n\uff08(]"
    # # print(text.find('第二剂'))
    try:
        if text.find('三剂次')!=-1 or text.find('三针次')!=-1 or text.find('3剂次')!=-1 or text.find('3针次')!=-1:
            vaccine = 3
        elif text.find('两剂次')!=-1 or text.find('两针次')!=-1 or text.find('2剂次')!=-1 or text.find('2针次')!=-1:
            vaccine = 2
        elif text.find('一剂次')!=-1 or text.find('一针次')!=-1 or text.find('1剂次')!=-1 or text.find('1针次')!=-1:
            vaccine = 1
        elif text.find('第三剂')!=-1 or text.find('第三针')!=-1 or text.find('第3针')!=-1 or text.find('第3剂')!=-1:
            vaccine = 3
        elif text.find('第二剂')!=-1 or text.find('第二针')!=-1 or text.find('第2针')!=-1 or text.find('第2剂')!=-1:
            vaccine = 2
        elif text.find('第一剂')!=-1 or text.find('第一针')!=-1 or text.find('第1针')!=-1 or text.find('第1剂')!=-1:
            vaccine =1
        else:
            vaccine = re.findall('{0}.*?([未无]).*?接种.*?{0}'.format(symbolsRe),text)[0]
            if vaccine == '无' or vaccine == '未':
                vaccine = 0
    except:
        # print("无法自动获取编号为{}的疫苗接种史，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # vaccine = input()
        pass
    hospitalDate = getAdmissDate(id,year,month,text)
    diagnosedDate = getDiagnosedDate(id,year,month,text)
    note = getNote(text)
    return pid,age,0 if gender=='女' else 1,homeAddressName,workingAddressName,phone,vocation,height,weight,0 if smoking.find('无')!=-1 else 1,vaccine,diagnosedDate,hospitalDate,note

 # 此处假设行程的年份和报告年份相同，是否完全相同有待检查
def getTripDatetime(id,year,lastdate,trip):
    datetimestr = ''
    yearstr = re.findall(r'(\d+)年', trip)
    year = year if len(yearstr)==0 else yearstr[0]
    datestr = re.findall(r'(\d+月\d+日)',trip)
    try:
        datestr = datestr[-1]
        pos = datestr.index('月')
        datetimestr = year + '-'+datestr[0:pos]+'-'+datestr[pos+1:-1]
    except:
        if lastdate!='':
            datetimestr = lastdate
        else:
            # print("无法自动获取编号为{}的行程日期，请手动输入：".format(id))
            # datetimestr = input()
            pass
    timestr = ''
    try:
        timestr = re.findall(r'(\d+:\d+)',trip)
        timestr = timestr[-1]
    except:
        try:
            timestr = re.findall(r'(\d+)时',trip)
            timestr = timestr[-1]
            timestr = timestr+':00'
        except:
            timestr = re.findall(r'(\d+时\d+分)',trip)
            if len(timestr) > 0:
                timestr = timestr[-1]
                timestr = timestr[0:timestr.find('时')]+':'+timestr[timestr.find('时')+1:timestr.find('分')]
        # # print("无法自动获取编号为{}的行程时间，请手动输入：".format(id))
        # timestr = input()
    if isinstance(timestr,str):
        datetimestr += ' '+timestr
    
    return datetimestr

def getStaticAddr(trip):
    isAppear = []
    staticAddrs = []
    ChinaRe = "[\u4e00-\u9fa5""\u201C\u201D0-9a-zA-Z]"
    symbolsRe = "[\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3011\n\uff08(]"
    staticAddrs = re.findall(r'[去从在到下](%s+)买'%(ChinaRe),trip)
    staticAddrs += re.findall(r'至(%s+)下车'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去从在到至-](%s+)[下上]车'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至回](%s+)[取送]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至回](%s+)吃'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至](%s+)面试'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至](%s+)参观'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至回](%s+)[等休][候息]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去在到至](%s+)上班'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去在到](%s+)和同事'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[在到去] (%s+)约见'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[在到去至] (%s+)开会'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至](%s+)购[物买]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去到在至回](%s+)[就吃][餐饭]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'前往(%s+)[就进][诊行]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'前往(%s+)送'%(ChinaRe),trip)
    staticAddrs += re.findall(r'前往(%s+)买'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[从在](%s+)[出步][发行]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去在](%s+)[锻处][炼理]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去至](%s+)[缴采][费集]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[去至](%s+)[核交][酸费]'%(ChinaRe),trip)
    staticAddrs += re.findall(r'[在到至回-](%s+)%s'%(ChinaRe,symbolsRe),trip)
    staticAddrs += re.findall(r'[前到][往达](%s+)%s'%(ChinaRe,symbolsRe),trip)
    staticAddrs += re.findall(r'[从](%s+)[-至]'%(ChinaRe),trip)
    staticAddrs = sorted(staticAddrs,key=len)
    SLs = []
    for SL in staticAddrs:
        if SL.isdigit() or SL == '达':
            continue
        if SL.find('和同事') != -1  or SL.find('工作') != -1  or SL.find('取') != -1  or SL.find('接') != -1 or SL.find('上班') != -1 or SL.find('面试') != -1 \
        or SL.find('确诊') != -1 or SL.find('指定') != -1 or SL.find('外出') != -1 or SL.find('买') != -1 or SL.find('坐') != -1 \
            or SL.find('吃面') != -1 or SL.find('吃饭') != -1 or  SL.find('就餐') != -1:
            continue
        isRepeated = 0
        for L in isAppear:
            if L == '办公室' or L == '家':
                continue
            if SL.find(L) != -1:
                isRepeated = 1
                break
        if  isRepeated == 0:
            SLs.append(SL)
            isAppear.append(SL)
    def cmp(x,y):
        if trip.index(x)>trip.index(y):
            return 1
        return -1
    SLs = sorted(SLs,key=functools.cmp_to_key(cmp))
    return SLs

with open('app01/utils/verbs.txt','r',encoding='utf-8') as f:
    fverbs = f.readlines()
    verbs = []
    for verb in fverbs:
        verb = verb.strip()
        verbs.append(verb)
    # # print(verbs)

def getStaticAddr2(trip):
    ChinaRe = "[\u4e00-\u9fa5""\u201C\u201D0-9a-zA-Z]"
    symbolsRe = "[\u3002\uff1b\uff0c\uff1a\u3001\uff1f\u002c\u003b\u003f\u000d\u00A0\u0020\u3011\n\uff08(]"
    SLs = []
    for verb in verbs:
        staticAddrs = re.findall(r'[去从在到至回往达-](%s+)%s'%(ChinaRe,verb),trip)
        for staticAddr in staticAddrs:
            SLs.append({'addr':staticAddr,'event':verb})
    staticAddrs = re.findall(r'[去从在到至回往达-](%s+)%s'%(ChinaRe,symbolsRe),trip)
    for staticAddr in staticAddrs:
        SLs.append({'addr':staticAddr,'event':''})
    staticAddrs = re.findall(r'[去从在到至回往达](%s+)%s'%(ChinaRe,symbolsRe),trip)
    for staticAddr in staticAddrs:
        SLs.append({'addr':staticAddr,'event':''})
    def cmp(x,y):
        if trip.index(x['addr'])>trip.index(y['addr']):
            return 1
        return -1
    SLs = sorted(SLs,key=functools.cmp_to_key(cmp))
    return SLs

def transToLocation(address):
    # 百度地图API
    # ak = "OUvctBtvvIPYN5RdWrAC7uW8qRKjxS7x"
    # url = "https://api.map.baidu.com/geocoding/v3/?address={}&output=json&ak={}".format(address,ak)
    # 高德地图API
    key = "689f364763e7ce09fe7c7df9589144b3"
    url = "https://restapi.amap.com/v3/geocode/geo?key={}&address={}&output=json".format(key,address)
    response = requests.get(url).text
    response = json.loads(response)
    # print(response)
    try:
        formatted_address = response['geocodes'][0]['formatted_address']
        province = response['geocodes'][0]['province']
        city = response['geocodes'][0]['city']
        district = response['geocodes'][0]['district']
        location = response['geocodes'][0]['location']
        location = location.split(',')
        lng = location[0]
        lat = location[1]
    except:
        return {'province':'','city':'','district':'','formatted_address':'','address':address,'lng':0,'lat':0}
    # lng = response['result']['location']['lng']
    # lat = response['result']['location']['lat']
    # # print(response)
    return {'province':province,'city':city,'district':district,'formatted_address':formatted_address,'address':address,'lng':lng,'lat':lat}

def getContacts(trip,addrs):
    names = []
    ChinaRe = "[\u4e00-\u9fa5]"
    for verb in verbs:
        temps = re.findall(r'[和与](%s+)%s'.format(ChinaRe,verb),trip)
        type = 6
        if verb.find('居')!=-1 or verb.find('住')!=-1:
            type = 0
        elif verb.find('共餐'):
            type = 4
        for temp in temps:
            temp = temp.split('、')
            for name in temp:
                if name.find('同事')!=-1:
                    type = 1
                elif name.find('同学')!=-1:
                    type = 2
                pos = trip.find(name)
                for addr in addrs:
                    if trip.find(addr) > pos:
                        if addr.find('号线')!=-1 or addr.find('公交')!=-1 or str(addr[1::]).isalnum():
                            type = 3
                        names.append({'name':name,'addr':addr,'event':verb,'type':type})
                        break
    return names

def transform2StructuredData(filename,allText):
    print(filename,allText)
    def cmp(x,y):
        if trip.index(x)>trip.index(y):
            return 1
        return -1
     # 连接本地数据库
    conn = pymysql.connect(host='django_app_db_1',port=3306,user='root',password='mypassword',database='django_app')
    # conn = pymysql.connect(host='localhost',port=3306,user='root',password='slm',database='me')
    # conn = pymysql.connect(host='localhost',port=3308,user='root',password='slm',database='cdc')
    cur = conn.cursor()
    cur.execute("select Sid from app01_stay order by Sid desc")
    res =  cur.fetchall()
    id = 0 if len(res)==0 else res[0][0]
    Sid = id + 1
    cur.execute("select Rid from app01_ride order by Rid desc")
    res =  cur.fetchall()
    id = 0 if len(res)==0 else res[0][0]
    Rid = id + 1
    cur.execute("select id from app01_contact order by id desc")
    res =  cur.fetchall()
    id = 0 if len(res)==0 else res[0][0]
    Cid = id + 1
    cur.execute("select id from app01_dynamiclocation order by id desc")
    res =  cur.fetchall()
    id = 0 if len(res)==0 else res[0][0]
    dynamicAddrNum = id + 1
    year = ''
    month = ''
    name = ''
    dynamicAddrs = {}
    basicinfoAndDiscoveryProcess = ''
    id2address = {}
    address2id = {}
    id = filename[0:filename.find('-')]
    # ===========================1、病例信息===========================
    try:
        name = filename[filename.rindex('-')+1:filename.index('（')]
    except:
        # print("无法自动获取编号为{}的确诊者姓名，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # name = input()
        pass
   
    basicInfoStartPos = ''
    try:
        basicInfoStartPos = allText.index('基本情况')
    except:
        # print("无法自动获取编号为{}的基本情况起始下标，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # basicInfoStartPos = input()
        pass
    titlePart = allText[0:basicInfoStartPos]
    try:
        year = re.findall('(\d{4})年',titlePart)[0]
    except:
        # print("无法自动获取编号为{}的报告年份，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # year = input()
        pass
    try:
        month = re.findall('年(\d+?)月',titlePart)[0]
    except:
        # print("无法自动获取编号为{}的报告月份，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # month = input()
        pass   
    # # print(year,month)
    allText = allText[basicInfoStartPos::]
    try:
        basicinfoAndDiscoveryProcess = allText[0:allText.index('流行病学调查')]
    except:
        # print("无法自动获取编号为{}的基本情况和发现经过部分，请手动输入：".format(id))
        # os.system(r'notepad {}'.format(f.name))
        # pstr = input()
        # while(pstr!='end'):
        #     basicinfoAndDiscoveryProcess += pstr + '\n'
        #     pstr = input()   
        pass
    # # print(basicinfoAndDiscoveryProcess)
    pid,age,gender,homeAddressName,workingAddressName,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,patient_note = getPatientInfo(id,year,month,basicinfoAndDiscoveryProcess)
    if height == '':
        height = 0
    if weight == '':
        weight = 0
    # print(pid,age,gender,homeAddressName,workingAddressName,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,patient_note)
    homeAddress,workingAddress = {},{}
    if address2id.get(homeAddressName) is  None:
        homeAddress = transToLocation(homeAddressName) 
        if homeAddress['lng']!=0:
            address2id[homeAddressName] = homeAddress['lng']+','+homeAddress['lat']
            id2address[homeAddress['lng']+','+homeAddress['lat']] = homeAddressName
            sql = "insert ignore into app01_location(name1,name2,name3,name4,name5,gps) values('{}','{}','{}','{}','{}','{}')".format(homeAddress['province'],homeAddress['city'],homeAddress['district'],homeAddress['formatted_address'],homeAddressName,homeAddress['lng']+','+homeAddress['lat'])
            # 往数据库插入静态地址数据
            cur.execute(sql)
            conn.commit()
    if address2id.get(workingAddressName) is None:
        workingAddress = transToLocation(workingAddressName) 
        if workingAddress['lng']!=0:
            address2id[workingAddressName] = workingAddress['lng']+','+workingAddress['lat']
            id2address[workingAddress['lng']+','+workingAddress['lat']] = workingAddressName
            sql = "insert ignore into app01_location(name1,name2,name3,name4,name5,gps) values('{}','{}','{}','{}','{}','{}')".format(workingAddress['province'],workingAddress['city'],workingAddress['district'],workingAddress['formatted_address'],workingAddressName,workingAddress['lng']+','+workingAddress['lat'])
            # 往数据库插入静态地址数据
            cur.execute(sql)
            conn.commit() 
    # 往patient表插入数据
    if hospitalDate=='':
        # print(homeAddress['lng'],homeAddress['lat'],workingAddress['lng'],workingAddress['lat'])
        if homeAddress['lng']!=0 and workingAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},"{}",{},"{}","{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,homeAddressName,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else '',workingAddressName,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),pymysql.NULL,patient_note)  
        elif homeAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},"{}",{},{},"{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,homeAddressName,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),pymysql.NULL,patient_note)
        elif workingAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},{},{},"{}","{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,workingAddressName,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),pymysql.NULL,patient_note)
        else:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},{},{},{},"{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),pymysql.NULL,patient_note)
    else:
        if homeAddress['lng']!=0 and workingAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},"{}",{},"{}","{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,homeAddressName,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,workingAddressName,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),datetime.strftime(datetime.strptime(hospitalDate,'%Y-%m-%d')),patient_note)  
        elif homeAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},"{}",{},{},"{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,homeAddressName,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),datetime.strftime(datetime.strptime(hospitalDate,'%Y-%m-%d')),patient_note)
        elif workingAddress['lng']!=0:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},{},{},"{}","{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,workingAddressName,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),datetime.strftime(datetime.strptime(hospitalDate,'%Y-%m-%d')),patient_note)
        else:
            sql_patient = 'insert into app01_patient(pid,name,age,gender,homeAddress_id,homeAddressName_id,workingAddress_id,workingAddressName_id,phone,vocation,height,weight,smoking,vaccine,diagnosedDate,hospitalDate,note) values("{}","{}","{}","{}",{},{},{},{},"{}","{}","{}","{}","{}","{}","{}",{},"{}")'.format(pid,name,age,gender,'"'+homeAddress['lng']+','+homeAddress['lat'] + '"' if homeAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,'"'+workingAddress['lng']+','+workingAddress['lat']+'"' if workingAddress['lng']!=0 else pymysql.NULL,pymysql.NULL,phone,vocation,height,weight,smoking,vaccine,datetime.strftime(datetime.strptime(diagnosedDate,'%Y-%m-%d'),'%Y-%m-%d'),datetime.strftime(datetime.strptime(hospitalDate,'%Y-%m-%d')),patient_note)
        
    # print(sql_patient)
    cur.execute(sql_patient)
    conn.commit()
    # ===================   2、流行病学部分查找地点（用高德地图）和动态地点  ==================
    # homeAddressName,workingAddressName 家庭住址和工作地点也算是一个静态的地点
    epidemiologicalInvestigationInfo = ''
    try:
        epidemiologicalInvestigationInfo = allText[allText.index('三、流行病学调查'):allText.index('四、')]
    except:
        # print("无法自动获取编号为{}的流行病学调查部分，请手动输入：".format(id))
        # pstr = input()
        # while(pstr!='end'):
        #     epidemiologicalInvestigationInfo += pstr + '\n'
        #     pstr = input()
        pass   
    # # print(epidemiologicalInvestigationInfo)
    trips = re.split(r'[。\n]', epidemiologicalInvestigationInfo)
    # # print(trips)
    lastDate = ''
    wearMask = 1
    event = '地铁'
    for trip in trips: 
        allAddrs = []
        if trip.find('未佩戴')!=-1:
            wearMask = 0
        elif trip.find('N95口罩')!=-1:
            wearMask = 2
        elif trip.find('防护服')!=-1:
            wearMask = 3
        # 静态地址
        tempStr = ''
        pos = 0
        SLs = getStaticAddr2(trip)
        # if len(SLs) != 0:
        #     # print(SLs) 
        for SL in SLs:
            tempStr = trip[pos:trip.index(SL['addr'])]+trip[trip.index(SL['addr']):trip.find('，')]
            lastDate = getTripDatetime(id, year, lastDate,tempStr)
            event = SL['event']
            # if tempStr.find('买')!=-1 or tempStr.find('购物')!=-1:
            #     event = '购物'
            # elif tempStr.find('吃')!=-1 or tempStr.find('就餐')!=-1:
            #     event = '就餐'
            # elif tempStr.find('工作')!=-1:
            #     event = '工作'
            # elif tempStr.find('核酸')!=-1:
            #     event = '核酸检测'
            # elif tempStr.find('站')!=-1:
            #     event = '坐车'
            # elif tempStr.find('家')!=-1:
            #     event = '回家'
            # elif tempStr.find('公司')!=-1:
            #     event = '办公室'
            # else:
            #     event = '其他'
            
            # # print(lastDate)
            lastDate = lastDate[0:10]
            pos = trip.index(SL['addr'])
            stay_gps = ''
            if address2id.get(SL['addr']) is  None:
                staticAddr = transToLocation(SL['addr'])
                stay_gps = str(staticAddr['lng'])+','+str(staticAddr['lat'])
                if staticAddr['lng']!=0 and id2address.get(stay_gps) is None:
                    sql = "insert ignore into app01_location(name1,name2,name3,name4,name5,gps) values('{}','{}','{}','{}','{}','{}')".format(staticAddr['province'],staticAddr['city'],staticAddr['district'],staticAddr['formatted_address'],SL['addr'],stay_gps)
                    allAddrs.append(SL['addr'])
                    address2id[SL['addr']] = stay_gps
                    id2address[stay_gps] = SL['addr']
                    # 往数据库插入静态地址数据
                    cur.execute(sql)
                    conn.commit()
                elif staticAddr['lng']==0:
                    stay_gps = ''
            # print(pid,SL['addr'],lastDate,wearMask,event)
            if SL['addr']=='家' or SL['addr']=='中':
                stay_gps = homeAddress['lng']+','+homeAddress['lat'] if homeAddress['lng']!=0 else ''
            elif SL['addr']=='公司' or SL['addr']=='单位':
                stay_gps = workingAddress['lng']+','+workingAddress['lat'] if workingAddress['lng']!=0 else ''
            if stay_gps!='':  
                sql = 'insert into app01_stay(Sid,pid_id,Lname_id,gps_id,startDate,startTime,action,protection) values("{}","{}","{}","{}","{}","{}","{}","{}")'.format(Sid,pid,id2address[stay_gps],stay_gps,lastDate[0:10],lastDate[11:16],event,wearMask)
                cur.execute(sql)
                conn.commit()
                Sid += 1

        sites = []
        for i,v in enumerate(SLs):
            if v['addr'].find('站')!=-1:
                sites.append(v)
        # 动态地址

        DLs = re.findall(r'(\d+号线)', trip)
        # for i,v in enumerate(DLs):
        #     DLs[i] = '地铁'+v
        if len(DLs) > 0:
            event = '地铁'
            tempStr = ''
            pos = 0
            if len(sites) == 0:
                note = '' 
            else:
                note = sites[0]+'-'
                sites.pop(0)
            for DL in DLs:
                # # print(DL)
                if len(sites) == 0:
                    note = ''
                else:
                    note += sites[0]
                tempStr = trip[pos:trip.index(DL)]+trip[trip.index(DL):trip.index('，')]
                lastDate = getTripDatetime(id, year, lastDate,tempStr)
                if dynamicAddrs.get(DL+'_'+note) is  None:
                    dynamicAddrs[DL+'_'+note]=dynamicAddrNum
                    # print(dynamicAddrNum,DL,note)
                    allAddrs.append(DL)
                    # 往数据库插数据
                    sql = "insert into app01_dynamiclocation(id,name,note) values('{}','{}','{}')".format(dynamicAddrNum,DL,note)
                    cur.execute(sql)
                    conn.commit()
                    dynamicAddrNum += 1

                # print(pid,DL,lastDate,wearMask,event)
                sql = 'insert into app01_ride(Rid,pid_id,Did_id,startDate,startTime,action,protection) values("{}","{}","{}","{}","{}","{}","{}")'.format(Rid,pid, dynamicAddrs[DL+'_'+note],lastDate[0:10],lastDate[11:16],event,wearMask)
                cur.execute(sql)
                conn.commit()
                Rid += 1
                # # print(lastDate)
                lastDate = lastDate[0:10]
                pos = trip.index(DL)
                    
                if len(sites) == 0:
                    note = ''
                else:
                    note = sites[0] + '-'
                    sites.pop(0)
        DLs = re.findall(r'(\d+路*公交)', trip)
        if len(DLs) > 0:
            event = '公交'
            tempStr = ''
            pos = 0
            if len(sites)==len(DLs):
                note = ''
            elif len(sites) == 0:
                note = ''
            else:
                note = sites[0]+'-'
                sites.pop(0)
            
            for DL in DLs:
                # # print(DL)
                if len(sites) == 0:
                    note = ''
                else:
                    note += sites[0]
                tempStr = trip[pos:trip.index(DL)]+trip[trip.index(DL):trip.index('，')]
                lastDate = getTripDatetime(id, year, lastDate,tempStr)

                # 插入数据
                if dynamicAddrs.get(DL+'_'+note) is None:
                    dynamicAddrs[DL+'_'+note]=dynamicAddrNum
                    allAddrs.append(DL+'_'+note)
                    # print(dynamicAddrNum,DL,note)
                    # 往数据库插数据
                    sql = "insert into app01_dynamiclocation(id,name,note) values('{}','{}','{}')".format(dynamicAddrNum,DL,note)
                    cur.execute(sql)
                    conn.commit()
                    dynamicAddrNum += 1

                # print(pid,DL,lastDate,wearMask,event)
                sql = 'insert into app01_ride(Rid,pid_id,Did_id,startDate,startTime,action,protection) values("{}","{}","{}","{}","{}","{}","{}")'.format(Rid,pid,dynamicAddrs[DL+'_'+note],lastDate[0:10],lastDate[11:16],event,wearMask)
                cur.execute(sql)
                conn.commit()
                Rid += 1
                # # print(lastDate)
                lastDate = lastDate[0:10]
                pos = trip.index(DL)
                
                    
                if len(sites) == 0:
                    note = ''
                else:
                    note = sites[0]+ '-'
                    sites.pop(0)
        # 忽略车牌不详
        DLs = re.findall(r'([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})',trip)
        
        if len(DLs) > 0:
            pos = 0
        
            for DL in DLs[0]:
                if DL=='':
                    continue
                tempStr = trip[pos:trip.index(DL)]+trip[trip.index(DL):trip.index('，')]
                pos = trip.index(DL)
                if tempStr.find('打车')!=-1:
                    event = '打车'
                elif tempStr.find('私家车')!=-1:
                    event = '私家车'
                elif tempStr.find('出租车')!=-1:
                    event = '出租车'
                elif tempStr.find('商务车')!=-1:
                    event = '商务车'
                lastDate = getTripDatetime(id, year, lastDate,tempStr)

                if dynamicAddrs.get(DL) is  None:
                    dynamicAddrs[DL]=dynamicAddrNum
                    # print(dynamicAddrNum,DL,'')
                    allAddrs.append(DL)
                    # 往数据库插数据
                    sql = "insert into app01_dynamiclocation(id,name,note) values('{}','{}','')".format(dynamicAddrNum,DL)
                    cur.execute(sql)
                    conn.commit()
                    dynamicAddrNum += 1

                # print(pid,DL,lastDate,wearMask,event)
                sql = 'insert into app01_ride(Rid,pid_id,Did_id,startDate,startTime,action,protection) values("{}","{}","{}","{}","{}","{}","{}")'.format(Rid,pid,dynamicAddrs[DL],lastDate[0:10],lastDate[11:16],event,wearMask)
                cur.execute(sql)
                conn.commit()
                Rid += 1
                lastDate = lastDate[0:10]
            allAddrs = sorted(allAddrs,key=functools.cmp_to_key(cmp))
            contacts = getContacts(trip,allAddrs)
            for contact in contacts:
                if contact['type']!=3:
                    sql = 'insert into app01_contact(id,pid2,phone,type,protection,contactAddress_id,contactAddressName_id,contactTravel_id,pid1_id) values("{}","{}","{}","{}","{}","{}","{}","{}","{}")'.format(Cid,contact['name'],'',contact['type'],wearMask,address2id[contact['addr']],contact['addr'],pymysql.NULL,pid)
                else:
                    sql = 'insert into app01_contact(id,pid2,phone,type,protection,contactAddress_id,contactAddressName_id,contactTravel_id,pid1_id) values("{}","{}","{}","{}","{}","{}","{}","{}","{}")'.format(Cid,contact['name'],'',contact['type'],wearMask,pymysql.NULL,pymysql.NULL,dynamicAddrs[contact['addr']],pid)
                Cid += 1
                cur.execute(sql)
                conn.commit()
        wearMask = 1
    
    cur.close()
    conn.close()
def transform2StructuredDataMain():
    # 5-1215-刘莲菜（确诊 机场 长安大学）.txt
    with open(r'截止1月15日12时流调报告txt-脱敏(id+phone)-v4\6-1215-张建林（确诊 长安大学 ）.txt','r',encoding='utf-8') as f:
        filename = os.path.basename(f.name)
        allText = ''.join(f.readlines())
        transform2StructuredData(filename,allText)
        
    return


# if __name__=='__main__':
#      transform2StructuredDataMain()
#     # transToLocation("西安市雁塔区长安中路33号长安大学本部家属院2区11号楼3单元602室")
    # print('insert into %s'%("tets"))
    # conn = pymysql.connect(host='django_app_db_1',port=3306,user='root',password='mypassword',database='django_app')
    # cur = conn.cursor()
    # sql = "desc app01_patient"
    # cur.execute(sql)
    # res = cur.fetchall()
    # print(res)
    # cur.close()
    # conn.close()
#     pass
    
#

# import zipfile

# with zipfile.ZipFile("cdc2.zip", 'r') as zfile:
#     for file in zfile.namelist():
#         cont = zfile.read(file).decode('utf-8')
#         # # print(cont)
#         # print(file.encode('cp437').decode('gbk'))

# try:
#   with zipfile.ZipFile("",mode="a") as f:
#      f.extractall("D://code//datas/",pwd=b'20220409') ##将文件解压到指定目录，解压密码为root
# except Exception as e:
#      # print("异常对象的类型是:%s"%type(e))
#      # print("异常对象的内容是:%s"%e)
# finally:
#      f.close()
# import glob
# import jieba.posseg as pseg

# def next_doc():
#     for d in glob.glob('截止1月15日12时流调报告txt-脱敏(id+phone)-v4/*.txt'):
#         yield d
# isappear = {}
# for doc in next_doc():
#     name, ext = os.path.splitext(doc)
#     txtfile = name+'.txt'
#     # # print(txtfile)
#     with open(txtfile,'r',encoding='utf-8') as fp:
#         with open('verbs.txt','a',encoding='utf-8') as wf:
#             allText = '\n'.join(fp.readlines())
#             epidemiologicalInvestigationInfo = ''
#             try:
#                 allText = allText[allText.index('基本情况')::]
#                 epidemiologicalInvestigationInfo = allText[allText.index('流行病学调查'):allText.index('四、')]
#             except:
#                 # print("无法自动获取编号为({})的流行病学调查部分，请手动输入：".format(txtfile))
#                 # os.system(r'notepad {}'.format(f.name))
#                 pstr = input()
#                 while(pstr!='end'):
#                     epidemiologicalInvestigationInfo += pstr + '\n'
#                     pstr = input()   
#             # # print(epidemiologicalInvestigationInfo)
#             trips = re.split(r'[。\n]', epidemiologicalInvestigationInfo)
#             for trip in trips:
#                 words = pseg.cut(trip)
#                 for w in words:
#                     if isappear.get(w.word) is None and  w.flag == 'v':
#                         # print(w.word)
#                         isappear[w.word]=1
#                         wf.write(w.word+'\n')
                # # print(w.word,w.flag)