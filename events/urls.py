# events/urls.py

from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.home, name='home'),
    path('search/', views.event_search, name='event_search'),
    path('filter/', views.event_filter, name='event_filter'),
    path('contact/submit/', views.contact_submit, name='contact_submit'),
    path('newsletter/submit/', views.newsletter_submit, name='newsletter_submit'),
]