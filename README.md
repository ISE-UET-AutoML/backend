# How to run
## Setup .env
create .env:
```
PORT=8000
DATABASE_URL=mongodb://0.0.0.0:27017
GCP_BUCKET_NAME=<bucketname> # you can use fake value for this field
GCP_SERVICE_ACCOUNT=fake_string # you can use fake value for this field
GCP_PROJECT_ID=fake_string # you can use fake value for this field
ACCESS_TOKEN_SECRET=b9ca3961b32507a58fbe5a6975762a40fc17042f7721e0bc91327731ed4b5604dc558eff855dd726319499c4d140b5bbc67338f1913a84687917f121d1105bab
REFRESH_TOKEN_SECRET=fb664b6b7d530fcda166663f6049007cf46a2fb619bef36ee5bf342e8937a8f8f0788083a57efaac9be3dfcc0b110b21cd0acb53f796fc3d03b303fff354f810
WEB_SERVICE_ADDR=http://localhost:3000
ML_SERVICE_ADDR=http://0.0.0.0:8670
```
## Setup google-cloud
add config/service-account.json
## Start mongod
Ubuntu:
```
sudo systemctl start mongod
```
## Finally 
```
yarn dev
```
