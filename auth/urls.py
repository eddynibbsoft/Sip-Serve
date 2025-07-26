# user_auth/urls.py
from django.urls import path
from .views import UserDetailView, UserRegistrationView, UserLoginView, ManagerOnlyView, CashierOnlyView, LogoutView, PasswordResetRequestView, PasswordResetConfirmView, VerifyEmailView, ResendVerificationEmailView

urlpatterns = [
    path('signup/', UserRegistrationView.as_view(), name='signup'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('manager-only/', ManagerOnlyView.as_view(), name='manager-only'),
    path('cashier-only/', CashierOnlyView.as_view(), name='cashier-only'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]


