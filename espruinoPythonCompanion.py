#!/usr/bin/python
import time
import serial
import sys
import json

def espruino_cmd(command):
 ser = serial.Serial(
  port='/dev/ttyACM0', # or /dev/ttyAMA0 for serial on the Raspberry Pi
  baudrate=9600,
  parity=serial.PARITY_NONE,
  stopbits=serial.STOPBITS_ONE,
  bytesize=serial.EIGHTBITS,
  xonxoff=0, rtscts=0, dsrdtr=0,
 )
 ser.isOpen()
 ser.write(command+"\n")
 endtime = time.time()+0.2 # wait 0.2 sec
 result = ""
 while time.time() < endtime:
  while ser.inWaiting() > 0:
   result=result+ser.read(1)
 ser.close()
 return result

# Read 1 analog
#print espruino_cmd("print(analogRead(A1))").strip()
# Read 3 analogs into an array
#print espruino_cmd("print([analogRead(A1),analogRead(A2),analogRead(A3)])").strip().split(',')

if len(sys.argv)!=2:
 print "USAGE: espruino_command.py "+'"'+"print('hello')"+'"'
 exit(1)

print espruino_cmd(sys.argv[1]).strip()
