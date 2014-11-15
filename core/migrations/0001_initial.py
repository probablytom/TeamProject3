# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField()),
                ('closed', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('desc', models.CharField(max_length=500)),
                ('logo', models.ImageField(upload_to=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sent', models.DateTimeField()),
                ('project', models.ForeignKey(to='core.Chat')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Permission',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('permissionName', models.CharField(max_length=50)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Priority',
            fields=[
                ('name', models.CharField(max_length=20)),
                ('colour', models.CharField(max_length=20, serialize=False, primary_key=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('manager', models.CharField(max_length=50)),
                ('desc', models.CharField(max_length=500)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('notes', models.CharField(max_length=500)),
                ('created', models.DateTimeField()),
                ('closed', models.DateTimeField()),
                ('priority', models.ForeignKey(to='core.Priority')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('chat', models.ManyToManyField(to='core.Chat')),
                ('company', models.ForeignKey(to='core.Company')),
                ('permission', models.ManyToManyField(to='core.Permission')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('role', models.CharField(max_length=50)),
                ('linkedinURL', models.CharField(max_length=50)),
                ('image', models.ImageField(upload_to=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='user',
            name='profile',
            field=models.OneToOneField(to='core.UserProfile'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='message',
            name='user',
            field=models.ForeignKey(to='core.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='company',
            name='project',
            field=models.ManyToManyField(to='core.Project'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='chat',
            name='project',
            field=models.ForeignKey(to='core.Project'),
            preserve_default=True,
        ),
    ]
