from rest_framework import serializers
from .models import Question, UserAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'options', 'correct_answer', 'allowed_time']

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['id', 'question', 'selected_option', 'is_correct', 'score']
        read_only_fields = ['user']

    def create(self, validated_data):
        # Set the user based on the authenticated user in the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

# api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
   
        password = validated_data.pop('password', None)
        last_name = validated_data.get('last_name', 'DefaultLastName')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            first_name=validated_data.get('first_name', ''),
            last_name=last_name
        )

        return user

