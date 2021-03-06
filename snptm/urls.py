from django.conf.urls import patterns, url, include
from django.contrib import admin
from tastypie.api import Api
from chat.api.resources import ChatResource, MetadataResource, MetadataNameResource, TicketResource
from core.api.resources import ProjectResource, UserProfileResource, UserResource

# Enable the admin interface
admin.autodiscover()

# Register the API
v1_api = Api(api_name='v1')
v1_api.register(ProjectResource())
v1_api.register(ChatResource())
v1_api.register(MetadataResource())
v1_api.register(MetadataNameResource())
v1_api.register(TicketResource())
v1_api.register(UserProfileResource())
v1_api.register(UserResource())


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'core.views.home', name='home'),
    url(r'^accounts/login/', 'core.views.user_login', name='user_login'),
    url(r'^accounts/logout/', 'core.views.user_logout', name='user_logout'),
    url(r'^accounts/register/$', 'core.views.user_register', name='user_register'),
    url(r'^dashboard/$', 'core.views.dashboard', name='dashboard'),
    url(r'^newproject/$', 'core.views.new_project', name='new_project'),
    url(r'^projects/([0-9]+)/newchat/$', 'core.views.new_chat', name='new_chat'),
    url(r'^projects/([0-9]+)/info/$', 'core.views.project_description', name='project_description'),
    url(r'^chats/([0-9]+)$', 'chat.views.chat', name='chat'),
    url(r'^chats/([0-9]+)/close/$', 'chat.views.close_chat', name='close_chat'),
    url(r'^chats/([0-9]+)/reopen/$', 'chat.views.reopen_chat', name='reopen_chat'),
    url(r'^chats/([0-9]+)/delete/$', 'chat.views.delete_chat', name='delete_chat'),
    url(r'^profiles/(?P<username>[a-zA-Z0-9]+)/$', 'core.views.user_profile', name="user_profile"),
    url(r'^profiles/(?P<username>[a-zA-Z0-9]+)/permissions/$', 'core.views.user_permission_change', name="user_permission_change"),

    # Add the URLs for the API
    (r'^api/', include(v1_api.urls)),

)
