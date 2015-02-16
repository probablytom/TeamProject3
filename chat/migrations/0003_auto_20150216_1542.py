# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0002_fix_notes_null_and_blank'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='voted',
            field=models.ManyToManyField(related_name='chat_votes', null=True, to=settings.AUTH_USER_MODEL, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='chat',
            name='votes',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='ticket',
            name='created_by',
            field=models.ForeignKey(related_name='ticket_created_by', blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='ticket',
            name='assignee',
            field=models.ForeignKey(related_name='ticket_assignee', blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
    ]
