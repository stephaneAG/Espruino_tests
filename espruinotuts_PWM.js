var interval;
function pwm(brightness, Hz) {
  if ((typeof interval) !== "undefined") {
    clearInterval(interval);
    LED1.reset();
  }
  interval = setInterval(function() {
    digitalPulse(LED1, 1, brightness * (1000/Hz));
  }, 1000/Hz);
}
//pwm(0.1, 50); // turn on the led with 10% brightness & 50 Hz freqeuncy
pwm(0.5, 36); // after that I personnally start to see the blinking
//clearInterval(interval); LED1.reset(); // stop
