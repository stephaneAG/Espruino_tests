##### easily pairing on Ubuntu 14.04

If having troubles with the process of pairing a new device using the OS bluetooth GUI ( cause of the 'PIN KEY Options' bug that prevents selection to be taken in account ), follow the following steps to be runnin' in few minutes:
- 0: fire up a terminal
- 1: get infos on the bluetooth adapter ( if needed ): ```hciconfig```
- 2: list the nearby bluetooth devices: ```hcitool scan```
- 3: pair with a device: ```bluez-simple-agent hci0 <addr>``` ( 'll ask for the pairing key )
- 3bis: to unpair ( if needed ): ```bluez-simple-agent hci0 <addr> remove```
- 4: to handle setup & coordination of serial data transfer, edit the ```/etc/bluetooth/rfcomm.conf``` as follows:  
     ```
     rfcomm0 {    
       bind no;  
       device <addr>;  
       channel 1;  
       comment 'Serial Port';  
     }  
     ```  
- 5: start the connection: ```sudo rfcomm connect 0``` ( 'll create a device at /dev/rfcomm0 - hit 'Ctrl-C' to hangup )
- 6: start the Espruino IDE & connect to /dev/rfcomm0, "et voila" :)
