from django.shortcuts import render

# Create your views here.
from django.http import FileResponse

def send_file(response):

    img = open('home/fonts/helvetiker_bold.typeface.json', 'rb')

    response = FileResponse(img)

    return response
