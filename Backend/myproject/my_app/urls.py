from django.urls import path
from .views import QuestionListCreateView, UserAnswerListCreateView,RegisterAPIView,LoginAPIView,LogoutAPIView,send_score_email,check_email

urlpatterns = [
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('user-answers/', UserAnswerListCreateView.as_view(), name='user-answer-list-create'),
    path('send-score-email/', send_score_email, name='send_score_email'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('check-email/', check_email, name='check_email'),
]
