from django.contrib import admin
from .models import Question,UserAnswer

# Register your models here.

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text','correct_answer', 'allowed_time']
    search_fields = ['text']
admin.site.register(Question, QuestionAdmin)

class AnswerAdmin(admin.ModelAdmin):
    list_display = ['user','question','selected_option','score']
    search_fields = ['user__username']
   
admin.site.register(UserAnswer, AnswerAdmin)




