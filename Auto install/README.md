
===================================================
##                                              ##
##   █████████      ███████         █████████   ##
##         ███      ███    ██       ███         ##
##       ███        ███    ███      ███         ##
##     ███          ███    ███      ███  ████   ##
##   ███            ███    ██       ███    ██   ##
##   █████████      ███████         █████████   ##
##                                              ##
##  ESSE MATERIAL FAZ PARTE DA COMUNIDADE ZDG   ##
##                                              ##
##        PIRATEAR ESSA SOLUÇÃO É CRIME.        ##
##                                              ##
##    © COMUNIDADE ZDG - comunidadezdg.com.br   ##
##                                              ##
===================================================

## CRIAR SUBDOMINIO E APONTAR PARA O IP DA SUA VPS ##

FRONTEND_URL: whaticketapp.comunidadezdg.com.br
BACKEND_URL:  whaticketapi.comunidadezdg.com.br

## CHECAR PROPAGAÇÃO DO DOMÍNIO ##
https://dnschecker.org/


===================================================

## PHPMYADMIN (OPICIONAL)

sudo apt install phpmyadmin php-mbstring
sudo service apache2 restart
sudo systemctl status apache2
sudo ln -s /usr/share/phpmyadmin /var/www/html
