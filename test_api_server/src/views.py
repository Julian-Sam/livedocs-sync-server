import json

from django.http import Http404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

f = open("stripe_data.json")
stripe_data = json.load(f)

f = open("hubspot_data.json")
hubspot_data = json.load(f)


class CustomPermission(AllowAny):
    def has_permission(self, request, view):
        return request.headers.get('Authorization') is not None


class BaseView(APIView):
    permission_classes = [CustomPermission]
    throttle_scope = None
    data = None

    def get_auth_token(self):
        return self.request.headers.get('Authorization').split(' ')[1]

    def get_data(self):
        data = self.data.get(self.get_auth_token())
        return data

    def get(self, request, *args, **kwargs):
        data = self.get_data()
        if not data:
            raise Http404
        return Response(self.get_data())


class StripeView(BaseView):
    throttle_scope = 'stripe'
    data = stripe_data


class HubspotView(BaseView):
    throttle_scope = 'hubspot'
    data = hubspot_data
