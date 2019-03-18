from django.db import models
from django.conf import settings
from datetime import datetime, time

from .. import exceptions
from . import series

class Tournament(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    date_start = models.DateTimeField(db_index=True)
    date_end = models.DateTimeField(db_index=True)
    series = models.ForeignKey(series.Series, on_delete=models.CASCADE, db_index=True)

    class Meta:
        unique_together = ('name', 'series',)    

    @staticmethod
    def parse_date(datestr):
        return datetime.strptime(datestr, settings.DATE_TIME_INPUT_FORMAT)

    @staticmethod
    def format_date(dateobj):
        return dateobj.strftime(settings.DATE_TIME_INPUT_FORMAT)

    def assert_correct_date_range(self):
        to_dt  = lambda d: datetime.combine(d, time.min)
        if self.date_start >= self.date_end or self.date_start < to_dt(self.series.date_start) or self.date_end > to_dt(self.series.date_end):
            raise exceptions.BadDateRange
        
    @classmethod
    def fromJson(cls, data):
        n = cls(
            name=data['name'],
            city=data['city'],
            country=data['country'],
            date_start=cls.parse_date(data['date_start']),
            date_end=cls.parse_date(data['date_end'])
        )
        n.series = series.Series.objects.get(pk=data['series'])
        n.assert_correct_date_range()
        return n

    def applyChanges(self, data):
        self.name = data['name']
        self.date_start = self.parse_date(data['date_start'])
        self.date_end = self.parse_date(data['date_end'])
        self.series = series.Series.objects.get(pk=data['series'])
        self.city = data['city']
        self.country = data['country']
        
        self.assert_correct_date_range()
        self.save()

    def toJson(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'date_start' : self.format_date(self.date_start),
            'date_end' : self.format_date(self.date_end),
            'city' : self.city,
            'country' : self.country,
            'series' : self.series.toJson()
        }

    def toJsonShort(self):
        return {
            'id' : self.id,
            'name' : self.name,
            'date_start' : self.format_date(self.date_start),
            'date_end' : self.format_date(self.date_end),
        }
