from django.db import models
from django.conf import settings
from datetime import datetime

from .. import exceptions

class Series(models.Model):
    name = models.CharField(max_length=255, unique=True)
    date_start = models.DateField(db_index=True)
    date_end = models.DateField(db_index=True)

    @staticmethod
    def parse_date(datestr):
        return datetime.strptime(datestr, settings.DATE_INPUT_FORMAT)

    @staticmethod
    def format_date(dateobj):
        return dateobj.strftime(settings.DATE_INPUT_FORMAT)

    def assert_correct_date_range(self):
        if self.date_start >= self.date_end:
            raise exceptions.BadDateRange
        
    @classmethod
    def fromJson(cls, data):
        n = cls(
            name=data['name'],
            date_start=cls.parse_date(data['date_start']),
            date_end=cls.parse_date(data['date_end'])
        )
        n.assert_correct_date_range()
        return n

    def applyChanges(self, data):
        self.name = data['name']
        self.date_start = self.parse_date(data['date_start'])
        self.date_end = self.parse_date(data['date_end'])
        self.assert_correct_date_range()
        self.save()

    def toJson(self):
        return {
            'id'   : self.id,
            'name' : self.name,
            'date_start' : self.format_date(self.date_start),
            'date_end' : self.format_date(self.date_end)
        }
