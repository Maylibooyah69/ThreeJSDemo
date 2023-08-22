from django.urls import path, include
from . import views
from django.views.generic.base import TemplateView

urlpatterns = [
    path("scene1/",TemplateView.as_view(template_name='home/hello_webpack.html'),name='home'),
    path("",TemplateView.as_view(template_name='home/home.html'),name='home'),
    path("scene2",TemplateView.as_view(template_name='home/simple_animations.html'),name='home'),
    path("scene3",TemplateView.as_view(template_name='home/textGeometry.html'),name='home'),
    path("font",views.send_file,name='font'),
]
