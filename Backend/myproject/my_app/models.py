from django.db import models
from django.contrib.auth.models import User


class Question(models.Model):
    text = models.TextField()
    options = models.JSONField()  
    correct_answer = models.CharField(max_length=255)
    allowed_time = models.PositiveIntegerField(default=60)  

    def __str__(self):
        return self.text

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    score = models.IntegerField(default=0)  

    def __str__(self):
        return f"{self.user}-{self.selected_option}'s answer to {self.question.text}"

    def check_correctness(self):
        self.is_correct = self.selected_option == self.question.correct_answer

        self.score = 1 if self.is_correct else 0

        self.save()
