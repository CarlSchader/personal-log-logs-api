build-start:
	npm run build-start

install:
	npm i

build:
	npm run build

start:
	npm start

run-db:
	docker-compose up

kill-db:
	docker-compose down

push-image:
	gcloud auth configure-docker us-west1-docker.pkg.dev
	docker build -t logs-api --platform linux/amd64 .
	docker tag logs-api us-west1-docker.pkg.dev/personal-log-403105/logs-api/image
	docker push us-west1-docker.pkg.dev/personal-log-403105/logs-api/image
