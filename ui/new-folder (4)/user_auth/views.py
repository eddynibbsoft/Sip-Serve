from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserLoginSerializer
from .permissions import IsAdmin, IsManager, IsCashier
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.utils.encoding import force_str, force_bytes
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator




#Create Custom User from user model
CustomUser = get_user_model()

# Signup API
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = self.request.build_absolute_uri(
            reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
        )
        mail_subject = 'Activate your account'
        message = f'Hi {user.username},\n\nPlease use the following link to verify your email address:\n{verification_link}\n\nThank you!'
        send_mail(mail_subject, message, settings.EMAIL_HOST_USER, [user.email])
        return Response({'detail': 'Verification email sent'}, status=status.HTTP_201_CREATED)

# Verify Email
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_email_verified = True
            user.save()
            return Response({'detail': 'Email verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)

# Account Activation via Email - Resend Email
class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = CustomUser.objects.filter(email=email).first()

        if user is None:
            return Response({'detail': 'No user associated with this email'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({'detail': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = request.build_absolute_uri(
            reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
        )

        mail_subject = 'Activate your account'
        message = f'Hi {user.first_name},\n\nPlease use the following link to verify your email address:\n{verification_link}\n\nThank you!'
        send_mail(mail_subject, message, settings.EMAIL_HOST_USER, [user.email])
        return Response({'detail': 'Verification email resent'}, status=status.HTTP_200_OK)


# Login API
class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user is not None:
            if not user.is_email_verified:
                return Response({'detail': 'Email not verified'}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role
            })
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            # Add more fields if needed
        })

        
#Logout 
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                raise ValidationError("Refresh token is required")
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


#Request Manager View
class ManagerOnlyView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsManager]

#Request Cashier View
class CashierOnlyView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsCashier]


# Password Reset Request API
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        user = CustomUser.objects.filter(email=email).first()
        if user is None:
            return Response({'detail': 'No user associated with this email'}, status=status.HTTP_404_NOT_FOUND)

        # Generate password reset token and UID
        uid = urlsafe_base64_encode(force_str(user.pk).encode())
        token = PasswordResetTokenGenerator().make_token(user)

        # Create reset link
        reset_link = f"{request.build_absolute_uri(reverse('password-reset-confirm'))}?uid={uid}&token={token}"

        # Send email
        send_mail(
            'Password Reset Request',
            f'Please use the following link to reset your password: {reset_link}',
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response({'detail': 'Password reset link has been sent to your email'}, status=status.HTTP_200_OK)

# Password Reset Confirm API
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({'detail': 'Password has been reset successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid token or UID'}, status=status.HTTP_400_BAD_REQUEST)
