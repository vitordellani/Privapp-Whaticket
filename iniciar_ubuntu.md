# Guia de Instalação e Execução - Whaticket (Ubuntu)

Este guia foi adaptado do arquivo `iniciarwindows.md` para o ambiente Linux (Ubuntu).

## 1. Pré-requisitos do Sistema

Antes de iniciar, certifique-se de que o Git, Docker e Node.js estão instalados.

```bash
# Atualizar lista de pacotes
sudo apt update

# Instalar Git e Curl
sudo apt install -y git curl

# Instalar Docker e Docker Compose V2
sudo apt install -y docker.io docker-compose-v2

# Iniciar o serviço do Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar seu usuário ao grupo do Docker (evita usar sudo toda hora)
sudo usermod -aG docker $USER
# NOTA: Após este comando, é necessário fazer logout e login novamente no sistema para surtir efeito.
# Ou execute: newgrp docker
```

### Instalar Node.js (Versão LTS recomendada: 16 ou 18)
O comando abaixo instala o NVM (Node Version Manager) e a versão 16 do Node (geralmente mais estável para essa stack legacy), mas você pode ajustar conforme necessidade.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 16
nvm use 16
```

---

## 2. Configuração do Banco de Dados (MySQL)

Na raiz do projeto (`/home/vitordellani/DEV/Privapp-Whaticket`), suba o container do banco de dados.

```bash
# Iniciar o MySQL via Docker Compose
docker compose up -d mysql

# Verificar se está rodando
docker ps
```
*Se o comando `docker compose` falhar, tente `docker-compose up -d mysql`.*

---

## 3. Configuração do Backend

Abra um novo terminal ou aba e navegue para a pasta `backend`.

```bash
cd backend

# Criar arquivo .env
# Copie o exemplo ou crie um novo com os valores abaixo
cp .env.example .env
```

**Edite o arquivo `.env` para incluir as configurações necessárias:**
```ini
NODE_ENV=development
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
```

**Instalar dependências e rodar migrações:**

```bash
# Instalar dependências (use --force se houver conflitos de versão antigos)
npm install --force

# Compilar o código (Build)
npm run build

# Executar as migrações do banco de dados
npx sequelize db:migrate

# Popular o banco de dados (Seed)
npx sequelize db:seed:all

# Iniciar o Backend em modo desenvolvimento
npm run dev
```

---

## 4. Configuração do Frontend

Abra um **novo terminal** e navegue para a pasta `frontend`.

```bash
cd frontend

# Criar arquivo .env
nano .env
```
_Adicione as variáveis de ambiente necessárias (REACT_APP_BACKEND_URL, etc., verifique o padrão do projeto)._

**Instalar e rodar:**

```bash
# Instalar dependências
npm install --force

# Configurar variável para evitar erro de OpenSSL (comum em Node 17+)
export NODE_OPTIONS=--openssl-legacy-provider

# Compilar (opcional em dev, mas listado no guia original)
npm run build

# Iniciar o Frontend
npm start
```

---

## Resumo dos Terminais

Você precisará de 3 terminais rodando simultaneamente (ou em background):
1. **Terminal 1**: Docker (MySQL)
2. **Terminal 2**: Backend (`npm run dev`)
3. **Terminal 3**: Frontend (`npm start`)

Acesse a aplicação em: http://localhost:3000
