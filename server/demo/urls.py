from django.urls import path
from . import views
app_name = "server"
urlpatterns = [
    path("upload", views.upload, name="upload"),
]