import json
from django.http import (
    Http404,
    JsonResponse
)

import django.db.utils

from ..models import series as model
from .. import const
from .. import exceptions

def _list(filters):
    error, series = None, None
    try:
        date_filters = {
            k : model.Series.parse_date(filters.get(k))
            for k in [
                'start_date_min',
                'start_date_max',
                'end_date_min',
                'end_date_max'
            ] if filters.get(k)
        }
        dj_filter = { v : date_filters[k] for k, v in {
            'start_date_min' : 'date_start__gte',
            'start_date_max' : 'date_start__lte',
            'end_date_min' : 'date_end__gte',
            'end_date_max' : 'date_end__lte',
        }.items() if date_filters.get(k) }
        series = [ x.toJson() for x in model.Series.objects.filter(**dj_filter) ]
    except ValueError:
        error = const.API_ERROR_BAD_DATE_FORMAT
    return {
        'series' : series,
        'error' : error
    }
    

def _get(id_):
    try:
        o = model.Series.objects.get(pk=id_)
        return o.toJson()
    except model.Series.DoesNotExist:
        return {
            'error' : const.API_ERROR_OBJECT_NOT_FOUND
        }


def _fetch(id_, data, filters):
    return _get(id_) if id_ is not None else _list(filters)

def _delete(id_, data, *args):
    error = None
    try:
        o = model.Series.objects.get(pk=id_)
        o.delete()
    except model.Series.DoesNotExist:
        error = const.API_ERROR_OBJECT_NOT_FOUND
    return {
        'error' : error
    }


def _modify(id_, data, *args):
    error = None
    try:
        o = model.Series.objects.get(pk=id_)
        o.applyChanges(data)
    except ValueError:
        error = const.API_ERROR_BAD_DATE_FORMAT
    except django.db.utils.IntegrityError:
        error = const.API_ERROR_NON_UNIQUE_NAME
    except exceptions.BadDateRange:
        error = const.API_ERROR_BAD_DATE_RANGE
    except model.Series.DoesNotExist:
        error = const.API_ERROR_OBJECT_NOT_FOUND
    return {
        'error' : error
    }

def _add(id_, data, *args):
    error, error_arg = None, None
    try:
        new = model.Series.fromJson(data)
        new.save()
        id_ = new.id
    except KeyError as e:
        error = const.API_ERROR_NO_REQUIRED_FIELD
        error_arg = e.args[0]
    except ValueError:
        error = const.API_ERROR_BAD_DATE_FORMAT
    except  django.db.utils.IntegrityError:
        error = const.API_ERROR_NON_UNIQUE_NAME
    except exceptions.BadDateRange:
        error = const.API_ERROR_BAD_DATE_RANGE
    return {
        'id' : id_,
        'error' : error,
        'error_arg' : error_arg
    }
        
def handler(request, n=None):
    dispatch_table = {
        'POST' : _add,
        'PUT' : _modify,
        'GET' : _fetch,
        'DELETE' : _delete
    }
    f = dispatch_table.get(request.method)
    if not f:
        raise Http404
    res = None
    try:
        data = json.loads(request.body) if request.body else None
        filters = request.GET.dict()
        if not data or isinstance(data, dict):
            res = f(n, data, filters)
    except json.decoder.JSONDecodeError:
        pass
    res = res or { 'error' : const.API_ERROR_BAD_JSON_FORMAT }
    return JsonResponse(data=res, status=200 if not res.get('error') else const.API_ERROR_TO_CODE.get(res['error']))
    
        
        

    
