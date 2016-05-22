##### setup
```
                          ___ 
Espruino Vbat o-----●----|___|-----o pin 1
                    |     10K
                   .-.
                   | |
                   | |100k
                   '-' 
                    |
Espruino A0 o-------●--------------o pin 2
                          ___
Espruino Gnd o-----------|___|-----o pin 3
                          10K

how to draw NPN's ^^
  _ |/
  	|↘

  _|↗
   |\

```

![Softpot](https://raw.githubusercontent.com/stephaneAG/Espruino_tests/master/SoftPotTest/usingSoftpot.png)

-------

| info                                    | VOLTAGE       |
| ------------                            | ---:          |
| **22.5° area variation range**          | 0,028915847 V |
| **variation between 1° steps**          | 0,001285149 V |
| **untouched - area 1 max**              | 0,000488289 V |

-------

| TOUCH STATE            | VOLTAGE               | AREA             |
| ------------           | ---:                  | :---:            |
| **untouched**          | 0.99977111467 V       | N/A              |
| **area 1 max**         | 0.99928282597 V       | 0° ->  22.5°     |
| **area 2 max**         | 0.98634317540 V       | 22.5° ->    45°  |
| **area 3 max**         | 0.95851071946 V       | 45° ->  67.5°    |
| **area 4 max**         | 0.91969176775 V       | 67.5° ->    90°  |
| **area 5 max**         | 0.90821698329 V       | 90° -> 112.5°    |
| **area 6 max**         | 0.86524757763 V       | 112.5° ->   135° |
| **area 7 max**         | 0.84425116350 V       | 135° -> 157.5°   |
| **area 8 max**         | 0.82203402761 V       | 157.5° ->   180° |
| **area 9 max**         | 0.77882047760 V       | 180° -> 202.5°   |
| **area 10 max**        | 0.74634927901 V       | 202.5° ->   225° |
| **area 11 max**        | 0.72120241092 V       | 225° -> 247.5°   |
| **area 12 max**        | 0.68018616006 V       | 247.5° ->   270° |
| **area 13 max**        | 0.65577172503 V       | 270° -> 292.5°   |
| **area 14 max**        | 0.63233386739 V       | 292.5° ->   315° |
| **area 15 max**        | 0.60132753490 V       | 315° -> 337.5°   |
| **area 16 max**        | 0.56519417105 V       | 337.5° ->   360° |
| **area 16 min**        | 0.53662928206 V       |                  |
