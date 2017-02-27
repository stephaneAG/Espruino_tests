Remote control a DQ MyWall HP23L motorized wall mount using Espruino ! :D

Module ( implementing transmitting & receiving ) coming soon ;)

Current APi to transmit commands:
'''
tvSupportRemote.in        // retract TV to wall              
                out       // expand TV from wall
                left      // swivel the TV fully left
                right     // swivel the TV fully right
                ok        // stop any pending command
                
                fav1      // mem1 saved swivel orientation
                fav2      // mem2 saved swivel orientation
                
                kitchen   // custom saved swivel orientation
                bed       // custom saved swivel orientation
                
                halfLeft  // 
                halfRight //
                
                expandTo(percent)  // expand to passed % of full expansion depth ( negative goes in, positive goes out )         
                swivelTo(percent)  // swivel to passed % of full orientation range ( negative goes left, positive goes right )
'''
