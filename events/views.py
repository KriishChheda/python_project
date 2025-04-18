# events/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.contrib import messages
from .models import Event, Committee, Category, ContactMessage, NewsletterSubscription
from .forms import ContactForm, NewsletterForm

def home(request):
    # Get all upcoming events
    events = Event.objects.filter(date__gte=timezone.now().date()).order_by('date', 'time')
    committees = Committee.objects.all().order_by('name')
    categories = Category.objects.all().order_by('name')
    
    context = {
        'events': events,
        'committees': committees,
        'categories': categories,
        'now': timezone.now(),
    }
    
    return render(request, 'events/home.html', context)

def event_search(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')
        
        if query:
            events = Event.objects.filter(
                date__gte=timezone.now().date(),
                name__icontains=query
            ) | Event.objects.filter(
                date__gte=timezone.now().date(),
                description__icontains=query
            ) | Event.objects.filter(
                date__gte=timezone.now().date(),
                committee__name__icontains=query
            ).distinct()
        else:
            events = Event.objects.filter(date__gte=timezone.now().date())
            
        return render(request, 'events/search_results.html', {'events': events, 'query': query})

def event_filter(request):
    committee_id = request.GET.get('committee', '')
    date = request.GET.get('date', '')
    
    # Base queryset
    events = Event.objects.filter(date__gte=timezone.now().date())
    
    # Apply filters
    if committee_id:
        events = events.filter(committee_id=committee_id)
    
    if date:
        events = events.filter(date=date)
    
    # Return events as JSON
    event_list = []
    for event in events:
        event_data = {
            'id': event.id,
            'name': event.name,
            'date': event.date.strftime('%Y-%m-%d'),
            'time': event.time.strftime('%H:%M'),
            'venue': event.venue,
            'committee': event.committee.name,
            'faculty_coordinator': event.faculty_coordinator,
            'description': event.description,
            'image_url': event.image.url if event.image else None,
        }
        event_list.append(event_data)
    
    return JsonResponse({'events': event_list})

def contact_submit(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact = form.save()
            return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def newsletter_submit(request):
    if request.method == 'POST':
        form = NewsletterForm(request.POST)
        if form.is_valid():
            # Check if email already exists
            email = form.cleaned_data['email']
            subscription, created = NewsletterSubscription.objects.get_or_create(email=email)
            
            if created:
                return JsonResponse({'success': True, 'message': 'Subscribed successfully!'})
            else:
                return JsonResponse({'success': True, 'message': 'You are already subscribed!'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})