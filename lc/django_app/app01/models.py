# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
import re
from django.db import models


class App01Contact(models.Model):
    pid2 = models.CharField(max_length=30)
    phone = models.CharField(max_length=30, blank=True, null=True)
    type = models.IntegerField(blank=True, null=True)
    protection = models.IntegerField(blank=True, null=True)
    contactaddress = models.ForeignKey('App01Location', models.DO_NOTHING, db_column='contactAddress_id', blank=True, null=True,related_name="gps2contact")  # Field name made lowercase.
    contactaddressname = models.ForeignKey('App01Location', models.DO_NOTHING, db_column='contactAddressName_id', blank=True, null=True,related_name="name2contact")  # Field name made lowercase.
    contacttravel = models.ForeignKey('App01Dynamiclocation', models.DO_NOTHING, db_column='contactTravel_id', blank=True, null=True,related_name="did2contact")  # Field name made lowercase.
    pid1 = models.ForeignKey('App01Patient', models.DO_NOTHING,related_name="pid2contact")

    class Meta:
        managed = False
        db_table = 'app01_contact'


class App01Dynamiclocation(models.Model):
    name = models.CharField(max_length=30)
    note = models.CharField(max_length=1024)
    id = models.IntegerField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'app01_dynamiclocation'


class App01Item(models.Model):
    name = models.CharField(max_length=30)
    id = models.IntegerField(primary_key=True)
    type = models.IntegerField(blank=True, null=True)
    note = models.CharField(max_length=1024)

    class Meta:
        managed = False
        db_table = 'app01_item'


class App01Location(models.Model):
    name1 = models.CharField(max_length=30)
    name2 = models.CharField(max_length=30)
    name3 = models.CharField(max_length=30, blank=True, null=True)
    name4 = models.CharField(max_length=255)
    name5 = models.CharField(max_length=255)
    gps = models.CharField(primary_key=True, max_length=30)

    class Meta:
        managed = False
        db_table = 'app01_location'
        unique_together = (('gps', 'name5'),)


class App01Patient(models.Model):
    name = models.CharField(max_length=30)
    pid = models.CharField(unique=True, max_length=30)
    age = models.SmallIntegerField(blank=True, null=True)
    gender = models.SmallIntegerField(blank=True, null=True)
    phone = models.CharField(primary_key=True, max_length=30)
    vocation = models.CharField(max_length=255)
    height = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    smoking = models.SmallIntegerField(blank=True, null=True)
    vaccine = models.SmallIntegerField(blank=True, null=True)
    diagnoseddate = models.DateField(db_column='diagnosedDate', blank=True, null=True)  # Field name made lowercase.
    hospitaldate = models.DateField(db_column='hospitalDate', blank=True, null=True)  # Field name made lowercase.
    note = models.CharField(max_length=1024)
    homeaddress = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='homeAddress_id',related_name="hgps2patient")  # Field name made lowercase.
    homeaddressname = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='homeAddressName_id',related_name="hname2patient")  # Field name made lowercase.
    workingaddress = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='workingAddress_id', blank=True, null=True,related_name="wgps2patient")  # Field name made lowercase.
    workingaddressname = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='workingAddressName_id', blank=True, null=True,related_name="wname2patient")  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app01_patient'


class App01Ride(models.Model):
    startdate = models.DateField(db_column='startDate', blank=True, null=True)  # Field name made lowercase.
    starttime = models.TimeField(db_column='startTime', blank=True, null=True)  # Field name made lowercase.
    enddate = models.DateField(db_column='endDate', blank=True, null=True)  # Field name made lowercase.
    endtime = models.TimeField(db_column='endTime', blank=True, null=True)  # Field name made lowercase.
    protection = models.IntegerField(blank=True, null=True)
    action = models.CharField(max_length=1024, blank=True, null=True)
    rid = models.IntegerField(db_column='Rid', primary_key=True)  # Field name made lowercase.
    did = models.ForeignKey(App01Dynamiclocation, models.DO_NOTHING, db_column='Did_id',related_name="did2ride")  # Field name made lowercase.
    pid = models.ForeignKey(App01Patient, models.DO_NOTHING,related_name="pid2ride")

    class Meta:
        managed = False
        db_table = 'app01_ride'


class App01Stay(models.Model):
    startdate = models.DateField(db_column='startDate', blank=True, null=True)  # Field name made lowercase.
    starttime = models.TimeField(db_column='startTime', blank=True, null=True)  # Field name made lowercase.
    enddate = models.DateField(db_column='endDate', blank=True, null=True)  # Field name made lowercase.
    endtime = models.TimeField(db_column='endTime', blank=True, null=True)  # Field name made lowercase.
    action = models.CharField(max_length=1024)
    protection = models.IntegerField(blank=True, null=True)
    sid = models.IntegerField(db_column='Sid', primary_key=True)  # Field name made lowercase.
    lname = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='Lname_id',related_name="name2stay")  # Field name made lowercase.
    gps = models.ForeignKey(App01Location, models.DO_NOTHING,related_name="gps2stay")
    pid = models.ForeignKey(App01Patient, models.DO_NOTHING,related_name="pid2stay")

    class Meta:
        managed = False
        db_table = 'app01_stay'


class App01Touch(models.Model):
    touchdate = models.DateField(db_column='touchDate', blank=True, null=True)  # Field name made lowercase.
    touchtime = models.TimeField(db_column='touchTime', blank=True, null=True)  # Field name made lowercase.
    iid = models.IntegerField(blank=True, null=True)
    type = models.IntegerField(blank=True, null=True)
    protection = models.IntegerField(blank=True, null=True)
    tid = models.IntegerField(db_column='tid', primary_key=True)
    pid1 = models.ForeignKey(App01Patient, models.DO_NOTHING,related_name="pid2touch")
    touchaddress = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='touchAddress_id',related_name="name2touch")  # Field name made lowercase.
    touchaddressname = models.ForeignKey(App01Location, models.DO_NOTHING, db_column='touchAddressName_id',related_name="gps2touch")  # Field name made lowercase.
    touchtravel = models.ForeignKey(App01Dynamiclocation, models.DO_NOTHING, db_column='touchTravel_id', blank=True, null=True,related_name="did2touch")  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'app01_touch'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
