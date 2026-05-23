"""
URL configuration for rideshare_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    """Simple health check endpoint — confirms Django is running."""
    return JsonResponse({'status': 'ok', 'service': 'RideShare Campus Backend'})


urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # Health check
    path('', health_check, name='health_check'),

    # API routes — all prefixed with /api/
    path('api/', include('api.urls')),
]
