import smtplib
from .models import Question, UserAnswer
from .serializers import QuestionSerializer, UserAnswerSerializer,UserSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from django.contrib.auth.models import User

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        first_name = self.request.data.get('firstName')
        last_name = self.request.data.get('lastName')

        print(f'First Name: {first_name}, Last Name: {last_name}')

        user = serializer.save(first_name=first_name, last_name=last_name)

        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'email': user.email,  # Include the user's email in the response
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@authentication_classes([])
@permission_classes([])
class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]  


class UserAnswerListCreateView(generics.ListCreateAPIView):
    queryset = UserAnswer.objects.all()
    serializer_class = UserAnswerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_score_email(request):
    try:
        to_email = request.data.get('to')
        subject = 'Quiz Score Notification'
        body = f'Congratulations! Your quiz score is: {request.data.get("score")}\nThank you for participating in the quiz'

        # Send email using Django Email Backend
        send_mail(subject, body, 'your-email@gmail.com', [to_email], fail_silently=False)

        return Response({'message': 'Email sent successfully'}, status=200)
    except ValidationError as e:
        return Response({'error': 'Invalid email address'}, status=400)
    except smtplib.SMTPException as e:
        print('Error sending email:', str(e))
        return Response({'error': 'Failed to send email'}, status=500)

@api_view(['GET'])
def check_email(request):
    email = request.GET.get('email', '')

    if User.objects.filter(email=email).exists():
        return Response({'isEmailRegistered': True}, status=status.HTTP_200_OK)
    else:
        return Response({'isEmailRegistered': False}, status=status.HTTP_200_OK)