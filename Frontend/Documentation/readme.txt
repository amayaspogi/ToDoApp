<<<<<<<<<<<<<<<<<<<<<<<<<<<< DOCKER + HEROKU COMMANDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>
--  open terminal, then go to Portal

-- dev instance
docker build -t amayaspogi/dev-webportal . --file Docker/LINUX
docker login
docker push amayaspogi/dev-webportal
docker run -d -p 4000:80 --rm --name dev-webportal amayaspogi/dev-webportal

heroku login
heroku container:login
docker login --username=_ --password=$(heroku auth:token) registry.heroku.com
docker tag amayaspogi/dev-webportal registry.heroku.com/dev-content-webportal/web
docker push registry.heroku.com/dev-content-webportal/web
heroku container:release web -a dev-content-webportal

<<<<<<<<<<<<<<<<<<<<<<<<<<<< ! ! H A C K ! ! DOCKER + HEROKU COMMANDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>
--  open terminal, then go to Portal
-- Dockerfile is temporary as we still need to figure out how to perform build properly using docker
-- change fetchAPI.js to use GatewayAPI: "https://dev-content-gatewayservice.herokuapp.com"
rm -r publish
dotnet build -c Release
dotnet publish -c Release -o publish

cd ClientApp
npm install
npm run build
cp -r ./dist ../publish/ClientApp

cd ..
docker build -t amayaspogi/dev-webportal .
docker login
docker push amayaspogi/dev-webportal

heroku login
heroku container:login
docker login --username=_ --password=$(heroku auth:token) registry.heroku.com
docker tag amayaspogi/dev-webportal registry.heroku.com/dev-content-webportal/web
docker push registry.heroku.com/dev-content-webportal/web
heroku container:release web -a dev-content-webportal
