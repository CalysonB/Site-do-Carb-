#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}       CONFIGURADOR AUTOMÁTICO - SITE DO CARB    ${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Verifica Docker
hash docker 2>/dev/null
HAS_DOCKER=$?

# Verifica Node
hash node 2>/dev/null
HAS_NODE=$?

echo -e "${YELLOW}>> Verificando ambiente...${NC}"

if [ $HAS_DOCKER -eq 0 ]; then
    echo -e "${GREEN}✓ Docker detectado!${NC}"
    echo -e "${BLUE}>> Iniciando configuração via Docker (Recomendado)...${NC}"
    
    # Derruba containers antigos
    docker-compose down 2>/dev/null
    
    # Sobe novos containers
    echo -e "${YELLOW}>> Construindo e iniciando containers...${NC}"
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}=================================================${NC}"
        echo -e "${GREEN}       AMBIENTE DOCKER PRONTO! 🚀                ${NC}"
        echo -e "${GREEN}=================================================${NC}"
        echo -e "Frontend:  http://localhost"
        echo -e "Backend:   http://localhost:3000 (interno)"
        echo -e "Adminer:   http://localhost:8080"
        echo ""
        echo -e "${RED}⚠️  IMPORTANTE: LEIA AS REGRAS EM 'AI_RULES.md'${NC}"
    else
        echo -e "${RED}Erro ao iniciar Docker. Verifique os logs.${NC}"
        exit 1
    fi

elif [ $HAS_NODE -eq 0 ]; then
    echo -e "${YELLOW}! Docker não encontrado.${NC}"
    echo -e "${GREEN}✓ Node.js detectado!${NC}"
    echo -e "${BLUE}>> Iniciando configuração via Node (Modo Standalone)...${NC}"
    
    # Entra na pasta da API
    cd back-end || exit
    
    # Instala dependências
    echo -e "${YELLOW}>> Instalando dependências do backend...${NC}"
    npm install
    
    # Configura .env se não existir
    if [ ! -f .env ]; then
        echo -e "${YELLOW}>> Criando .env padrão...${NC}"
        echo "DB_HOST=localhost" > .env
        echo "DB_USER=root" >> .env
        echo "DB_PASS=" >> .env # Senha vazia padrão local, usuário deve ajustar
        echo "DB_NAME=centro_academico" >> .env
        echo "DB_DIALECT=mariadb" >> .env
        echo "PORT=3000" >> .env
        echo -e "${RED}>> ATENÇÃO: Ajuste o arquivo back-end/.env com a senha do seu banco local!${NC}"
        read -p "Pressione ENTER após configurar o banco de dados..."
    fi
    
    # Inicia o servidor com a flag para servir estáticos
    echo -e "${GREEN}=================================================${NC}"
    echo -e "${GREEN}       AMBIENTE NODE PRONTO! 🚀                  ${NC}"
    echo -e "${GREEN}=================================================${NC}"
    echo -e "Acesse o site em: http://localhost:3000"
    echo -e "${RED}⚠️  IMPORTANTE: LEIA AS REGRAS EM 'AI_RULES.md'${NC}"
    echo ""
    
    export SERVE_STATIC=true
    npm start

else
    echo -e "${RED}ERRO CRÍTICO: Nem Docker nem Node.js foram encontrados.${NC}"
    echo "Instale um dos dois para prosseguir."
    exit 1
fi
