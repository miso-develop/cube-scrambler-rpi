#!/bin/bash
cd `dirname $0`
CURRENT_DIR=$(pwd)

# Setup check
if [ -f "setup-completed" ]; then
    echo "Setup completed."
    exit 1
fi



# App setup
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get install -y nodejs npm pigpio dhcpcd hostapd dnsmasq



# Cube Scrambler setup

## build
npm i
npm run tailwind:build
npm run typescript:build

## Service setup
sudo chmod 0755 ./index.sh

sudo ln -s $CURRENT_DIR /opt/cube-scrambler-rpi

sudo cp ./setup/cube-scrambler.service /etc/systemd/system/cube-scrambler.service
sudo systemctl enable cube-scrambler



# AP setup

## udev
MAC=$(cat `find /sys/devices/ -name wlan0`/address)
echo MAC: $MAC

sudo iw phy phy0 interface add ap0 type __ap
sudo ip link set ap0 address $MAC

cat << EOF > /etc/udev/rules.d/99-ap0.rules
SUBSYSTEM=="ieee80211", ACTION=="add|change", ATTR{macaddress}=="$MAC", KERNEL=="phy0",
  RUN+="/sbin/iw phy phy0 interface add ap0 type __ap",
  RUN+="/bin/ip link set ap0 address $MAC"
EOF

sudo cp ./setup/unmanaged.conf /etc/NetworkManager/conf.d/unmanaged.conf

## dnsmasq
cat << EOF >> /etc/dnsmasq.conf

interface=ap0
dhcp-range=192.168.10.2,192.168.10.10,255.255.255.0,12h
EOF

## dhcpcd
cat << EOF >> /etc/dhcpcd.conf

interface ap0
static ip_address=192.168.10.1/24
nohook wpa_supplicant
EOF

## hostapd
sudo cp ./setup/hostapd.conf /etc/hostapd/hostapd.conf

sudo systemctl unmask hostapd.service
sudo systemctl enable hostapd.service

## wpa_supplicant
cat << EOF >> /etc/wpa_supplicant/wpa_supplicant.conf
country=JP
EOF



# reboot
echo . > setup-completed
sudo reboot


