from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Keep claims INSIDE JWT (still useful)
        token["user_id"] = user.id
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = "admin" if user.is_superuser else getattr(user, "role", None)

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Only return tokens — no extra fields
        return {
            "refresh": data["refresh"],
            "access": data["access"],
        }


def create_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }