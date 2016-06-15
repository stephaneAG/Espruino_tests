#!/usr/bin/env bash


# R: the following script aims to allow one to use a device's name 
#    instead of rfcomm number to connect to it
# by STephaneAG - 2016

# get the param passed
echo "Looking for bluetooth device named: $1"
deviceName="$1"

# look for that string in the rfcomm file & get its line if found
#lineNumber=$(grep -n "@""Tefspruino""@" ./rfcomm.conf)
lineNumber=$(grep -n "@""$1""@" /etc/rfcomm.conf)
# R > outputs: 24:#@Tefspruino@

# make sure we actually got something returned from the above call
if [ ${#lineNumber} -eq 0 ]; then
  echo "Error: device tag not found ! ( maybe a typo ? )"
  exit;
else
  echo "Device tag found, getting device id .."
fi

# strip the stuff after the line index
lineNumber="${lineNumber%:*}"
# R > outputs: 24

# get the next line's index
idLine=$(( $lineNumber + 1 ))
# R > outputs: 25

# get the content of the next line in the rfcomm file
defLine=$(sed "${idLine}q;d" rfcomm.conf)
# R > outputs: rfcomm0 {

# chop-chop the id of the rfcomm on that line
rfcommId="${defLine#rfcomm*}"
# R > outputs: 0 {
rfcommId="${rfcommId% {*}"
# R > outputs: 0

# connect usign that id ( R: prefix the outside call with 'sudo' if neede ( .. ) )
# R/wip: for now, just print out the command that'd be called ;p
# rfcomm connect "$rfcommId"
echo "Connecting to bluetooth device $deviceName ( rfcomm$rfcommId ) .."
echo "command to be called: rfcomm connect $rfcommId"
