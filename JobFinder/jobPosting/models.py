from django.db import models
from core.models import City, Country, Category
from business.models import Business
# Create your models here.

class Job(models.Model):
    CATEGORY_CHOICES = [
        ('Software Development', 'Software Development'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Sales', 'Sales'),
        ('Customer Service', 'Customer Service'),
        ('Finance', 'Finance'),
        ('Human Resources', 'Human Resources'),
        ('Management', 'Management'),
        ('Other', 'Other'),
    ]

    EXPERIENCE_LEVELS = [
        ('Entry Level', 'Entry Level'),
        ('Junior', 'Junior'),
        ('Mid-Level', 'Mid-Level'),
        ('Senior', 'Senior'),
        ('Lead', 'Lead'),
        ('Executive', 'Executive'),
    ]

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    is_remote = models.BooleanField(default=False)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    experience_level = models.CharField(max_length=50, choices=EXPERIENCE_LEVELS)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2)
    working_hours = models.CharField(max_length=100)
    requirements = models.TextField()
    deadline = models.DateField(null=True, blank=True)
    application_url = models.URLField(max_length=500, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

    class Meta:
        ordering = ['-created_at']