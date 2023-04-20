import os

ALLOWED_HOSTS = [ "*" ]
DEBUG = True
SECRET_KEY = ''
ROOT_URLCONF = 'champ.urls'
STATIC_URL = "/static/"

DATE_INPUT_FORMAT = "%Y-%m-%d"
DATE_TIME_INPUT_FORMAT = "%Y-%m-%d %H:%M:%SZ0000"

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
STATIC_ROOT = os.path.join(BASE_DIR, "static")
DATABASES = {
    'default' : {
         'ENGINE' : 'django.db.backends.sqlite3',
         'NAME'   : os.path.join(BASE_DIR, 'champ.db')
     }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
    }
]

LOGIN_REDIRECT_URL = '/'

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'champ.app.ChampConfig'
]

MIDDLEWARE = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
