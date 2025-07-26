from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('cashier', 'Cashier'),
        ('manager', 'Manager'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True, db_index=True)
    is_email_verified = models.BooleanField(default=False)
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='cashier')

    username = None  # Remove username field
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set', blank=True)

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
