to use, just 'Send to Espruino' & then save()
then, watch the Espruino flash itself & auto-reboot while logging stuff until it completes its goals ;p

```javascript
/* -- test run logs --

>save()                                 ==> initial reboot of the device, to debug it's onInit() behavior

Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7220
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots with fake pending update & apply it before rebooting
aParam: tef
anotherParam: 1500
pending update !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7274
Checking...
Done!
Running onInit()...

-- current config --                    ==> device reboots with update applied, & we fake a pending restore before rebooting it
aParam: loulou
anotherParam: 500
device updated !
no pending update !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7275
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots with fake pending restore, which it applies before rebooting again
aParam: loulou
anotherParam: 500
pending restore !


>Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7272
Checking...
Done!
Running onInit()...

-- current config --                    ==> device boots, restored with factory settings
aParam: factoryName
anotherParam: 0
device restored !
no pending update !


Calling 'save()' again ( manually, here, not to hardcode to much junk ) 'd result in the following being logged
>save()
=undefined
Erasing Flash.....
Writing..........
Compressed 81600 bytes to 7276
Checking...
Done!

Running onInit()...
-- current config --
aParam: factoryName
anotherParam: 0
no pending update !


*/
```
