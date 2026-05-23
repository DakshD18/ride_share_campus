from django.db import models
from django.utils import timezone
from datetime import timedelta


class RideOTP(models.Model):
    """
    Stores the OTP for a specific ride session.
    - ride_id: a unique string identifier for the ride (from Firestore)
    - passenger_uid: Firebase UID of the passenger
    - driver_uid: Firebase UID of the driver
    - otp: 4-digit code generated for this ride
    - is_verified: becomes True once the driver enters the correct OTP
    - created_at: timestamp of OTP generation
    - expires_at: OTP auto-expires after 15 minutes
    """
    ride_id      = models.CharField(max_length=128, unique=True, db_index=True)
    passenger_uid = models.CharField(max_length=128, blank=True)
    driver_uid    = models.CharField(max_length=128, blank=True)
    otp          = models.CharField(max_length=4)
    is_verified  = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)
    expires_at   = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=15)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP {self.otp} for ride {self.ride_id} | verified={self.is_verified}"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Ride OTP'
        verbose_name_plural = 'Ride OTPs'


class RideLog(models.Model):
    """
    Immutable audit log of every ride event. Used for admin analytics.
    """
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('accepted',  'Accepted'),
        ('otp_sent',  'OTP Sent'),
        ('otp_verified', 'OTP Verified'),
        ('in_progress', 'In Progress'),
        ('completed',  'Completed'),
        ('cancelled',  'Cancelled'),
    ]

    ride_id       = models.CharField(max_length=128, db_index=True)
    passenger_uid = models.CharField(max_length=128, blank=True)
    driver_uid    = models.CharField(max_length=128, blank=True)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES)
    fare          = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    pickup        = models.CharField(max_length=256, blank=True)
    drop          = models.CharField(max_length=256, blank=True)
    timestamp     = models.DateTimeField(auto_now_add=True)
    note          = models.TextField(blank=True)

    def __str__(self):
        return f"[{self.status.upper()}] Ride {self.ride_id} @ {self.timestamp:%Y-%m-%d %H:%M}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Ride Log'
        verbose_name_plural = 'Ride Logs'
