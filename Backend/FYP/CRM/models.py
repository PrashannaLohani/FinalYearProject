from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, confirm_password=None):
        user = self.model(username=username)
        email = self.normalize_email(email)
        user.set_password(password)
        user.confirm_password = confirm_password
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, password=None):
        return self.create_user(username, password)

class CustomUser(AbstractUser):
    username = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Add related_name to avoid clashes with auth.User groups
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_groups'
    )

    # Add related_name to avoid clashes with auth.User user_permissions
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_permissions'
    )

    def __str__(self):
        return self.email
