API_ERROR_BAD_JSON_FORMAT = "malformed_json"
API_ERROR_NO_REQUIRED_FIELD = "no_field"
API_ERROR_BAD_DATE_FORMAT = "bad_date_format"
API_ERROR_BAD_DATE_RANGE = "bad_date_range"
API_ERROR_NON_UNIQUE_NAME = 'name_not_unique'

API_ERROR_OBJECT_NOT_FOUND = 'object_not_found'
API_ERROR_REFERENCED_NOT_FOUND = 'referenced_not_found'

API_ERROR_TO_CODE = {
    API_ERROR_BAD_JSON_FORMAT : 400,
    API_ERROR_NO_REQUIRED_FIELD : 400,
    API_ERROR_BAD_DATE_FORMAT : 400,
    API_ERROR_BAD_DATE_RANGE : 400,
    API_ERROR_OBJECT_NOT_FOUND : 404,
    API_ERROR_REFERENCED_NOT_FOUND : 409,
    API_ERROR_NON_UNIQUE_NAME : 409
}
