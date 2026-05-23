import random
import string
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import RideOTP, RideLog


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def generate_otp_code(length=4):
    """Generate a random 4-digit numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))


# ─────────────────────────────────────────────────────────────────────────────
# POST /generate-otp
# ─────────────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def generate_otp(request):
    """
    Generate a new OTP for a ride.

    Request body (JSON):
        {
            "ride_id":       "firestore-ride-document-id",
            "passenger_uid": "firebase-uid-of-passenger",
            "driver_uid":    "firebase-uid-of-driver"
        }

    Response (JSON):
        {
            "success": true,
            "otp":     "4721",
            "ride_id": "firestore-ride-document-id",
            "expires_in_minutes": 15
        }
    """
    ride_id       = request.data.get('ride_id')
    passenger_uid = request.data.get('passenger_uid', '')
    driver_uid    = request.data.get('driver_uid', '')

    if not ride_id:
        return Response(
            {'success': False, 'error': 'ride_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # If an OTP already exists for this ride and is NOT expired/verified, return it
    existing = RideOTP.objects.filter(ride_id=ride_id, is_verified=False).first()
    if existing and not existing.is_expired:
        remaining_seconds = int((existing.expires_at - timezone.now()).total_seconds())
        return Response({
            'success': True,
            'otp': existing.otp,
            'ride_id': ride_id,
            'expires_in_minutes': round(remaining_seconds / 60, 1),
            'note': 'Existing valid OTP returned',
        })

    # Create a fresh OTP
    otp_code = generate_otp_code()
    ride_otp = RideOTP.objects.create(
        ride_id=ride_id,
        passenger_uid=passenger_uid,
        driver_uid=driver_uid,
        otp=otp_code,
    )

    # Log the event
    RideLog.objects.create(
        ride_id=ride_id,
        passenger_uid=passenger_uid,
        driver_uid=driver_uid,
        status='otp_sent',
        note=f'OTP generated: {otp_code}',
    )

    return Response({
        'success': True,
        'otp': otp_code,
        'ride_id': ride_id,
        'expires_in_minutes': 15,
    }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────────────────────────────────────
# POST /verify-otp
# ─────────────────────────────────────────────────────────────────────────────

@api_view(['POST'])
def verify_otp(request):
    """
    Verify the OTP entered by the driver.

    Request body (JSON):
        {
            "ride_id": "firestore-ride-document-id",
            "otp":     "4721"
        }

    Response (JSON) on success:
        { "success": true, "message": "OTP verified. Ride started!" }

    Response on failure:
        { "success": false, "error": "<reason>" }
    """
    ride_id = request.data.get('ride_id')
    entered_otp = request.data.get('otp')

    if not ride_id or not entered_otp:
        return Response(
            {'success': False, 'error': 'ride_id and otp are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        ride_otp = RideOTP.objects.get(ride_id=ride_id, is_verified=False)
    except RideOTP.DoesNotExist:
        return Response(
            {'success': False, 'error': 'No active OTP found for this ride. Was it already verified?'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Check expiry
    if ride_otp.is_expired:
        return Response(
            {'success': False, 'error': 'OTP has expired. Please ask the passenger to generate a new one.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Check OTP value
    if ride_otp.otp != entered_otp.strip():
        # Log failed attempt
        RideLog.objects.create(
            ride_id=ride_id,
            passenger_uid=ride_otp.passenger_uid,
            driver_uid=ride_otp.driver_uid,
            status='otp_sent',
            note=f'Failed OTP attempt: entered {entered_otp}',
        )
        return Response(
            {'success': False, 'error': 'Incorrect OTP. Please check and try again.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ OTP correct — mark as verified
    ride_otp.is_verified = True
    ride_otp.save()

    # Log success
    RideLog.objects.create(
        ride_id=ride_id,
        passenger_uid=ride_otp.passenger_uid,
        driver_uid=ride_otp.driver_uid,
        status='otp_verified',
        note='OTP verified successfully. Ride started.',
    )

    return Response({
        'success': True,
        'message': 'OTP verified. Ride started!',
        'ride_id': ride_id,
    })


# ─────────────────────────────────────────────────────────────────────────────
# GET /ride-history
# ─────────────────────────────────────────────────────────────────────────────

@api_view(['GET'])
def ride_history(request):
    """
    Returns paginated ride history for a user (passenger or driver).

    Query params:
        uid  — Firebase UID of the user (required)
        role — 'passenger' or 'driver' (required)
        page — page number (default 1)

    Response:
        { "success": true, "count": 10, "rides": [...] }
    """
    uid  = request.query_params.get('uid')
    role = request.query_params.get('role', 'passenger')
    page = int(request.query_params.get('page', 1))

    if not uid:
        return Response(
            {'success': False, 'error': 'uid is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if role == 'driver':
        logs = RideLog.objects.filter(driver_uid=uid)
    else:
        logs = RideLog.objects.filter(passenger_uid=uid)

    # Simple pagination — 20 records per page
    per_page = 20
    start = (page - 1) * per_page
    end = start + per_page
    sliced = logs[start:end]

    data = [
        {
            'ride_id':   log.ride_id,
            'status':    log.status,
            'fare':      str(log.fare) if log.fare else None,
            'pickup':    log.pickup,
            'drop':      log.drop,
            'timestamp': log.timestamp.isoformat(),
        }
        for log in sliced
    ]

    return Response({
        'success': True,
        'count': logs.count(),
        'page': page,
        'rides': data,
    })


# ─────────────────────────────────────────────────────────────────────────────
# GET /admin/stats  (summary stats for admin panel)
# ─────────────────────────────────────────────────────────────────────────────

@api_view(['GET'])
def admin_stats(request):
    """
    Returns summary stats for the Django admin dashboard.

    Response:
        {
          "total_rides": 120,
          "completed_rides": 95,
          "cancelled_rides": 10,
          "total_otps_generated": 130,
          "otps_verified": 95,
          "otps_expired": 10
        }
    """
    from django.utils.timezone import now
    from datetime import timedelta

    today = now().date()

    total_rides      = RideLog.objects.values('ride_id').distinct().count()
    completed        = RideLog.objects.filter(status='completed').count()
    cancelled        = RideLog.objects.filter(status='cancelled').count()
    total_otps       = RideOTP.objects.count()
    verified_otps    = RideOTP.objects.filter(is_verified=True).count()
    expired_otps     = sum(1 for o in RideOTP.objects.filter(is_verified=False) if o.is_expired)
    rides_today      = RideLog.objects.filter(timestamp__date=today).values('ride_id').distinct().count()

    return Response({
        'success': True,
        'total_rides':          total_rides,
        'rides_today':          rides_today,
        'completed_rides':      completed,
        'cancelled_rides':      cancelled,
        'total_otps_generated': total_otps,
        'otps_verified':        verified_otps,
        'otps_expired':         expired_otps,
    })
