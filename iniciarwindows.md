### WHATICKET

# DOWNLOAD DOCKER, GIT E NODE

# RAIZ
git clone https://github.com/canove/whaticket-community
cd whaticket-community
docker compose up -d mysql

# BACKEND
.env
npm i -f
npm run build
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev

# FRONTEND
.env
npm i -f
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm run build

$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start (POWERSHELL)

export NODE_OPTIONS=--openssl-legacy-provider && npm start (BASH)

# ENV BACK
NODE_ENV=
BACKEND_URL=http://localhost
FRONTEND_URL=http://localhost:3000
PROXY_PORT=8080
PORT=8080

DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=root
DB_PASS=strongpassword
DB_NAME=whaticket

JWT_SECRET=123456
JWT_REFRESH_SECRET=123456