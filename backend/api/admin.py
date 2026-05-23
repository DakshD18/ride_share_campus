from django.contrib import admin
from .models import RideOTP, RideLog


@admin.register(RideOTP)
class RideOTPAdmin(admin.ModelAdmin):
    list_display  = ('ride_id', 'otp', 'is_verified', 'is_expired_display', 'created_at', 'expires_at')
    list_filter   = ('is_verified',)
    search_fields = ('ride_id', 'passenger_uid', 'driver_uid')
    readonly_fields = ('created_at', 'expires_at')
    ordering      = ('-created_at',)

    def is_expired_display(self, obj):
        return obj.is_expired
    is_expired_display.boolean = True
    is_expired_display.short_description = 'Expired?'


@admin.register(RideLog)
class RideLogAdmin(admin.ModelAdmin):
    list_display  = ('ride_id', 'status', 'fare', 'pickup', 'drop', 'timestamp')
    list_filter   = ('status',)
    search_fields = ('ride_id', 'passenger_uid', 'driver_uid', 'pickup', 'drop')
    readonly_fields = ('timestamp',)
    ordering      = ('-timestamp',)

    # Summary stats on the changelist page
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['total_rides']    = RideLog.objects.values('ride_id').distinct().count()
        extra_context['completed']      = RideLog.objects.filter(status='completed').count()
        extra_context['cancelled']      = RideLog.objects.filter(status='cancelled').count()
        return super().changelist_view(request, extra_context=extra_context)


# Customize the admin site appearance
admin.site.site_header  = '🚗 RideShare Campus — Admin'
admin.site.site_title   = 'RideShare Admin'
admin.site.index_title  = 'Backend Dashboard'
