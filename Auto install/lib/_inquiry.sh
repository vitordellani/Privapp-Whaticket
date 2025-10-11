#!/bin/bash

get_frontend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o domínio da interface web (Frontend):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " frontend_url
}

get_backend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o domínio da sua API (Backend):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " backend_url
}

get_deploy_email() {
  
  print_banner
  printf "${WHITE} 💻 Digite o email para configurar o certbot:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " deploy_email

  # Atualiza o arquivo de configuração
  sudo su - root <<EOF
  sed -i "s/deploy_email=.*/deploy_email=$deploy_email/" /home/deployzdg/whaticket/config
EOF
}

get_urls() {
  
  get_frontend_url
  get_backend_url
  get_deploy_email
}

software_update() {
  
  # frontend_update
  backend_update
}

inquiry_options() {
  
  print_banner
  printf "${WHITE} 💻 O que você precisa fazer?${GRAY_LIGHT}"
  printf "\n\n"
  printf "   [1] Instalar\n"
  printf "   [2] Atualizar do conector WWeb.JS\n"
  printf "\n"
  read -p "> " option

  case "${option}" in
    1) get_urls ;;

    *) exit ;;
  esac
}

