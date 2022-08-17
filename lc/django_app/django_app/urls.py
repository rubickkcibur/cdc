"""django_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app01 import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_chain',views.get_chain),
    path('get_all_patients',views.get_all_patients),
    path('get_clusters',views.get_clusters),
    path('get_clusters2',views.get_clusters2),
    path('get_patient_route',views.get_patient_route),
    path('get_person',views.get_person),
    path('get_patientmap_d_t',views.get_patientmap_d_t),
    path('get_patientmap_d_t_sel',views.get_patientmap_d_t_sel),
    path('get_patientmap_d_t_all',views.get_patientmap_d_t_all),
    path('test_contact',views.test_contact),
    path('save_chain',views.save_chain),
    path('get_all_versions',views.get_all_versions),
    path('get_statistics',views.get_statistcs),
    path('download_cluster_csv',views.download_cluster_csv),
    path('upload_files',views.upload_files),
    path('get_contacts_table',views.get_contacts_table)
]
