const int pin_lo_minus = 2;
const int pin_lo_plus = 15;
const int sdn = 18;
const int analog_pin = 34;

void setup() {
 // initialize the serial communication:
 Serial.begin(9600);
 pinMode(pin_lo_plus, INPUT); // Setup for leads off detection LO +
 pinMode(pin_lo_minus, INPUT); // Setup for leads off detection LO -
 pinMode(sdn ,OUTPUT);
 digitalWrite(sdn, HIGH);

}
void loop() {
 if((digitalRead(pin_lo_plus) == 1)||(digitalRead(pin_lo_minus) == 1)){
 Serial.println('!');
 }
 else{
 // send the value of analog input 0:
 Serial.println(analogRead(analog_pin));
 }
 //Wait for a bit to keep serial data from saturating
 delay(1);
}