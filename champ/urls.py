from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect
from django.views.generic.base import TemplateView # new

from .views import series, tournaments

def login_redirect(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/accounts/login/')
    return TemplateView.as_view(template_name='home.html')(request)
    

urlpatterns = [
    path('', login_redirect),
    path('accounts/', include('django.contrib.auth.urls')),
    path(r'series/', series.handler, name='series'),
    path(r'series/<int:n>/', series.handler, name='series'),
    path(r'tournaments/', tournaments.handler, name='tournaments'),
    path(r'tournaments/<int:n>/', tournaments.handler, name='tournaments'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

