from django.urls import path, include
from . import views
from django.views.generic.base import TemplateView

urlpatterns = [
    path("scene1/",TemplateView.as_view(template_name='home/hello_webpack.html'),name='home'),
    path("",TemplateView.as_view(template_name='home/home.html')),
    path("scene2",TemplateView.as_view(template_name='home/simple_animations.html')),
    path("scene3",TemplateView.as_view(template_name='home/textGeometry.html')),
    path("scene4",TemplateView.as_view(template_name='home/lights.html')),
    path("scene5",TemplateView.as_view(template_name='home/hauntedHouse.html')),
    path("scene6",TemplateView.as_view(template_name='home/particles.html')),
    path("scene7",TemplateView.as_view(template_name='home/galaxy.html')),
    path("scene8",TemplateView.as_view(template_name='home/scroll.html')),
    path("scene9",TemplateView.as_view(template_name='home/physics.html')),
    path("scene10",TemplateView.as_view(template_name='home/imported_models.html')),
    path("scene11",TemplateView.as_view(template_name='home/raycaster.html')),
    path("font",views.send_file,name='font'),
]
