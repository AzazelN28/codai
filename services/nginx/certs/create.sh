#!/bin/bash
# Create Key And Csr
openssl req -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.csr

# Create Cert
openssl x509 -signkey localhost.key -in localhost.csr -req -days 365 -out localhost.crt

# Create Cert Authority
openssl req -x509 -sha256 -days 1825 -newkey rsa:2048 -keyout rootCA.key -out rootCA.crt
cat <<EOT >> localhost.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost 
EOT

# Sign Cert with Cert Authority
openssl x509 -req -CA rootCA.crt -CAkey rootCA.key -in localhost.csr -out localhost.crt -days 365 -CAcreateserial -extfile localhost.ext

