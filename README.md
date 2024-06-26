# fortsott med Banksajt men sql coh docker

##

[docker-desktop] https://docs.docker.com/desktop/install/windows-install/

## att göra först

related connecion object page

```sh
 ssh -i "/c/Users/Erik Jonsson/OneDrive/Documents/chas/workshop/ArbUt/AWS_3.pem" ubuntu@ec2-51-20-189-83.eu-north-1.compute.amazonaws.com
```

## instruktioner

Ni ska använda docker för att publicera er banksajt på AWS.

Gå igenom de två föreläsningarna om docker för att förbereda er.

Övergripande steg:

1. Skapa Dockerfiles till backend och frontend projekten.

- to be wrapped in docker-compose

```Dockerfile
FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

```Dockerfile
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

[mysql] https://hub.docker.com/_/mysql (database)
[docker-docs] https://docs.docker.com/engine/install/ubuntu/ (instance dependence)

```yml
version: '3'
services:
  nextjs:
    build: ./frontend
    ports:
      - '3000:3000'
  express:
    build: ./backend
    ports:
      - '3001:3001'
  mysql:
    image: mysql:5.7
    platform: linux/amd64
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: root
    ports:
      - '3307:3306'
```

server.js

```js
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'bank',
  port: 3306, //8889,
})
```

- note error need fix mysql

```sh
Docker-compose up --build
```

2. Skapa docker-compose.yml fil i roten av projektet som inkluderar mysql-databas.

[mysql] https://www.mysql.com/downloads/

- port och namn
  migrera data från sql mamp till mysql

3. Lägg till en volume för databasen så att inte datat raderas när ni startar om containern.

```yml
volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

4. Se till att url-erna i fetch i er frontend pekar på urlen till er ec2 instans.

[express-samples] https://docs.docker.com/samples/express/ (dependencies)

```sh
ssh -i "C:\Users\Erik Jonsson\OneDrive\Documents\chas\workshop\ArbUt\AWS2.pem" ubuntu@ec2-13-49-241-173.eu-north-1.compute.amazonaws.com
```

```sh
ssh -i "C:\Users\Erik Jonsson\OneDrive\Documents\chas\workshop\ArbUt\AWS_3.pem" ubuntu@ec2-51-20-189-83.eu-north-1.compute.amazonaws.com
```

docker-compose.yml

- rearange belive more logical order

```yml
services:
  mysql: //ops bad indentation
  image: mysql:5.7
  platform: linux/amd64
  environment:
    MYSQL_ROOT_PASSWORD: root
    MYSQL_DATABASE: root
  ports:
    - '3307:3306'
  volumes:
    - mysql_data:/var/lib/mysql

volumes:
  mysql_data:

  nextjs:
    build: ./frontend
    ports:
      - '3000:3000'
  express:
    build: ./backend
   ...
    volumes:
      - ./backend:/app
      - /app/node_modules
...
    depends_on:
      - mysql

```

fix

```yml
version: '3'
services:
  mysql:
    image: mysql:5.7
    platform: linux/amd64
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: root
    ports:
      - '3307:3306'
    volumes:
      - mysql_data:/var/lib/mysql

  express:
    build: ./backend
    ports:
      - '3001:3001'
    volumes:
      - ./backend:/app
      - /app/node_modules
    env_file:
      - ./env/backend.env
    depends_on:
      - mysql

  nextjs:
    build: ./frontend
    ports:
      - '3000:3000'

volumes:
  mysql_data:
```

5. Skicka filerna till er instans med scp

```sh
scp -i "C:\Users\Erik Jonsson\OneDrive\Documents\chas\workshop\ArbUt\AWS_3.pem" -r ./docker-compose.yml ./backend ./frontend ./env ubuntu@ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:/home/ubuntu/bank
```

- did only manage to send 2 so i tried again

```sh
scp -i "C:\Users\Erik Jonsson\OneDrive\Documents\chas\workshop\ArbUt\AWS_3.pem" -r ./frontend ./env ubuntu@ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:/home/ubuntu/bank
```

6. Installera docker på er ec2 instans

```sh

sudo apt-get update
sudo apt-get install docker.io
sudo apt-get install docker-compose
```

7. Kör docker på er ec2 instans

```sh
sudo docker-compose up --build -d
```

- i used vim to create server.js and package.json bc they where ignored
- after copy :wq

8. Exportera tabellerna från er lokala databas och importera dom till databasen på aws.
   Använd Sequel Ace (Mac) eller mySQLWorkbench (Windows) för detta.

- server.js

```
   pool = mysql.createPool({
      host: 'mysql',
      user: 'root',
      password: 'root',
      database: 'bank',
      port: 3306,
    })
```

backend.env

```env
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=root
```

pages

```js
      const isProduction = true
      const url =  isProduction?'http://ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:3001/accounts': 'http://localhost:3001/me/accounts/transactions'
      const response = await fetch(
        url,
      url,
      ...
      )
```

9. Lämna in länken till er banksajt på canvas.
   #   c h a s * b a n k s a j t * d o c k e r 
    
    
   login, accounts

- not correct endpoints and the form element should not refresh the page. we want to navigate await by pushing the router history forward (i believe)

```js
 const handleDeposit = async (event) => {
    event.preventDefault()
    try {
      const isProduction = true
      const url = isProduction
        ? 'http://ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:3001/me/accounts/transactions'
        : 'http://localhost:3001/me/accounts/transactions'
      const response = await fetch(url, {
        method: 'POST',
        ....
      }}}
```

- the server need to send back the otp || token or cookie for sessions to be possible

```json
{
  "accountInsertResult": {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 21,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 0
  }
```

session endpoint in server.js

```js
res.status(200).json({ accountInsertResult, otp })
```

- unique users before insert signin

```js
const [existingUser] = await query('SELECT id FROM users WHERE username = ?', [
  username,
])

// If a user with the same username already exists, return an error
if (existingUser) {
  userIds--
  return res.status(400).send('Username already exists')
}
```
