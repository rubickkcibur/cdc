from django.urls import path
from . import views
app_name = "server"
urlpatterns = [
    path("api/upload", views.upload, name="upload"),
    path("api/query", views.query, name="query"),
    path("api/getall", views.getall),
    path("api/testget", views.testget),
    path("api/newupload", views.newupload),
    path("api/queryperson", views.queryperson),
    path("api/insertroute", views.insertRoute),
    path("api/update",views.update),
	path("api/download",views.download_template),
    path("api/delete",views.deleteperson),
    path("api/epidemicUpload",views.epidemicUpload), #上传疫情数据
    path("api/contactUpload",views.contactUpload), #上传密接者数据
    path("api/getAllContacts",views.getAllContacts), #得到所有密接者数据
    path("api/getAllEpidemics",views.getAllEpidemics), #得到所有疫情数据
    path("api/queryEpidemic",views.queryEpidemic), #查询某个疫情数据
    path("api/queryEpidemicPerson",views.queryEpidemicPerson), #查询属于该波疫情的所有人员的资料
    path("api/queryDetailLocation",views.queryDetailLocation), #查询这个范围内的所有detail_location
    path("api/updateNull",views.updateNull),
    path("api/queryRelatedInfo",views.queryRelatedInfo),
    path("api/text2Info",views.text2Info),
    path("api/initData",views.initData),
    path("api/downloadDocx",views.download_docx),
    path("api/getAllPlace",views.getAllPlace),
    path("api/get_clusters",views.getCluster)
]
