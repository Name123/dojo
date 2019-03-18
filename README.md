Backend and frontend for tournaments CRUD.

# ----- Prepare and run the container: ------

docker-compose run web django-admin makemigrations --settings=settings --pythonpath=. champ


docker-compose run web django-admin migrate --settings=settings --pythonpath=.


docker-compose run web django-admin createsuperuser --settings=settings --pythonpath=.

docker-compose up

# ----- Access the frontend: ------

Visit the page http://localhost:8888 from your webbrowser.

# ----- Tech stack : ------

Backend: django for quick web backend development batteries included.


Frontend: reactjs, a great way to structure your javascript code in functional style.


RDBMS: sqlite3 is enough for this task.
