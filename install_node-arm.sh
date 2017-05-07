#! /bin/bash
#Created by Reno McKenzie (darkenvy)

wget https://nodejs.org/dist/v6.9.5/node-v6.9.5-linux-armv6l.tar.xz
tar xf node-v6.9.5-linux-armv6l.tar.xz
cd node-v6.9.5-linux-armv6l

sudo cp -R * /usr/local/
ln -s /usr/local/bin/node /usr/sbin/node
ln -s /usr/local/bin/npm /usr/sbin/npm

cd ..
rm -r node-v6.9.5-linux-armv6l
rm node-v6.9.5-linux-armv6l.tar.xz

node -v && npm -v