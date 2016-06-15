##### easily pairing on Ubuntu 14.04

If having troubles with the process of pairing a new device using the OS bluetooth GUI ( cause of the 'PIN KEY Options' bug that prevents selection to be taken in account ), follow the following steps to be runnin' in few minutes:
- 0: fire up a terminal
- 1: get infos on the bluetooth adapter ( if needed ): ```hciconfig```
- 2: list the nearby bluetooth devices: ```hcitool scan```
- 3: pair with a device: ```bluez-simple-agent hci0 <addr>``` ( 'll ask for the pairing key )
- 3bis: to unpair ( if needed ): ```bluez-simple-agent hci0 <addr> remove```  
- 4: to handle setup & coordination of serial data transfer, edit the ```/etc/bluetooth/rfcomm.conf``` as follows:  

     ```bash
     rfcomm0 {    
       bind no;  
       device <addr>;  
       channel 1;  
       comment 'Serial Port';  
     }  
     ```  
- 5: start the connection: ```sudo rfcomm connect 0``` ( 'll create a device at /dev/rfcomm0 - hit 'Ctrl-C' to hangup )
- 6: start the Espruino IDE & connect to /dev/rfcomm0, "et voila" :)




##### easily connecting on Ubuntu 14.04
Instead of using ```sudo rfcomm connect <index>```, we can tweak a little the ```/etc/bluetooth/rfcomm.conf``` as follows:  

    ```
    #@Tefspruino@
     rfcomm0 {    
       bind no;  
       device <addr>;  
       channel 1;  
       comment 'Serial Port';  
     }  
     ```  
Once the above is done, we can make use of the ```connectByName``` script present in this repo
Just pass a device name, and it'll look for that name in the ```/etc/bluetooth/rfcomm.conf``` & get the related device index
Examples:  

```
$ ./connectByName.sh Tefspruino
Looking for bluetooth device named: Tefspruino
Device tag found, getting device id ..
Connecting to bluetooth device Tefspruino ( rfcomm0 ) ..
command to be called: rfcomm connect 0

$ ./connectByName.sh HC-05
Looking for bluetooth device named: HC-05
Device tag found, getting device id ..
Connecting to bluetooth device HC-05 ( rfcomm1 ) ..
command to be called: rfcomm connect 1
```
