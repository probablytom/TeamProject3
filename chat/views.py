import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import F
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from chat.models import Chat, Ticket
from core.forms import TicketDataForm


@login_required()
def chat(request, chat_id):
    chat = Chat.objects.get(id=chat_id)
    return render(request, 'chat.html', {'chat': chat})


# TODO: integrate with permissions when available
def close_chat(request, chat_id):
    chat = Chat.objects.get(id=chat_id)
    chat.closed = datetime.datetime.now()
    chat.save()
    return redirect('chat.views.chat', chat_id)


# TODO: integrate with permissions when available
def reopen_chat(request, chat_id):
    chat = Chat.objects.get(id=chat_id)
    chat.closed = None
    chat.save()
    return redirect('chat.views.chat', chat_id)


# TODO: integrate with permissions when available
def delete_chat(request, chat_id):
    chat = Chat.objects.get(id=chat_id)
    chat.delete()
    return redirect('core.views.dashboard')


# Atomically increments the number of votes on the chat
def upvote_chat(request, chat_id):
    chat = Chat.objects.get(id=chat_id)
    if request.user.is_authenticated():
        if request.user in chat.voted.all():  # Check user hasn't already voted.
            return HttpResponse('')
        chat.votes = F('votes') + 1
        chat.save()
    return HttpResponse('')


