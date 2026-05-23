from django.urls import path
from . import views

urlpatterns = [
    # OTP endpoints
    path('generate-otp', views.generate_otp,  name='generate_otp'),
    path('verify-otp',   views.verify_otp,    name='verify_otp'),

    # History
    path('ride-history', views.ride_history,  name='ride_history'),

    # Admin analytics
    path('admin/stats',  views.admin_stats,   name='admin_stats'),
]
