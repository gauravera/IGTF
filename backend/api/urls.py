# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check,
    LoginView,               # unified JWT login
    create_admin_user,
    create_team_user,
    list_team_users,
    delete_team_user,
    send_otp,
    verify_otp,
    create_password,
    ExhibitorRegistrationViewSet,
    VisitorRegistrationViewSet,
    CategoryViewSet,
    EventViewSet,
    GalleryImageViewSet
)

router = DefaultRouter()
router.register(r'exhibitor-registrations', ExhibitorRegistrationViewSet, basename='exhibitor')
router.register(r'visitor-registrations', VisitorRegistrationViewSet, basename='visitor')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'events', EventViewSet, basename='events')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')

urlpatterns = [

    path('api/health/', health_check, name='health'),
    # ---------------------------------
    # SINGLE LOGIN ENDPOINT
    # ---------------------------------
    path('api/login/', LoginView.as_view(), name='login'),

    # ---------------------------------
    # Admin creation (first time only)
    # ---------------------------------
    path('api/create-admin/', create_admin_user),

    # ---------------------------------
    # Team management
    # ---------------------------------
    path('api/team/create/', create_team_user),
    path('api/team/list/', list_team_users),
    path('api/team/delete/<int:user_id>/', delete_team_user),

    # ---------------------------------
    # OTP + password setup
    # ---------------------------------
    path('api/password/send-otp/', send_otp),
    path('api/password/verify-otp/', verify_otp),
    path('api/password/create/', create_password),

    # ---------------------------------
    # CRUD router
    # ---------------------------------
    path('api/', include(router.urls)),
]
