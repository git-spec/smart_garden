
#include <RF24.h>

// finish require for R24// require for R24
#include <SPI.h>
#include <nRF24L01.h>
// setting up the Soil sensor

// RF pins
RF24 radio(10, 9);
int pumpPin = 8;

//RF pips
const uint64_t pipes[2] = { 0xABCDABCD71LL, 0x744d52687BLL };

char dataReceived[32]; // must match dataToSend in master
String token = "0x744d52687B";
String sendData = "hi"; // the two values to be sent to the master
bool newData = false;
bool pumpOn = false;
unsigned long currentMillis;
unsigned long prevMillis;
unsigned long txIntervalMillis = 1000; // send once per second
int onTime = 5;

// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(9600);
  pinMode(pumpPin, OUTPUT);
  radio.begin();
  radio.setPALevel(RF24_PA_HIGH);
  radio.setChannel(76);
  //radio.setDataRate( RF24_250KBPS );

  radio.openWritingPipe(pipes[0]); // NB these are swapped compared to the master
  radio.openReadingPipe(1, pipes[1]);

  radio.setRetries(3, 5); // delay, count
  radio.startListening();
}

void loop() {
  getData();
  showData();
  send();
  if(pumpOn){
    currentMillis = millis();
    
    if((currentMillis - prevMillis) / 1000 < onTime){
      digitalWrite(pumpPin, HIGH);
    } else {
      pumpOn = false;
    }
    
} else {
  digitalWrite(pumpPin, LOW);
  prevMillis = millis();
}
   
  //DHTReading();
}

void send() {
  if (sendData.length() > 0) {
    radio.stopListening();
    bool rslt;
    String message = token + "-" + sendData;
    char c[message.length() + 1];
    message.toCharArray(c, message.length() + 1);
    rslt = radio.write( &c, sizeof(c) );
    radio.startListening();

    if (rslt) {
      Serial.println("Acknowledge Received");
      sendData = "";
    }
    else {
      Serial.println("Tx failed");
    }
    Serial.println();
    //newData = false;
  }
}

//================

void getData() {
  if ( radio.available() ) {
    radio.read( &dataReceived, sizeof(dataReceived) );
    newData = true;
  }
}

//================

void showData() {
  if (newData == true) {
    Serial.print("Data received ");
    Serial.println(dataReceived);
    String message = (String)dataReceived;
    if(message == "hi"){
      sendData = "yup";
    }else if(message == "on"){
     pumpOn = true;
    }else if(message == "off"){
      pumpOn = false;
    } else {
      if(message.indexOf("conf") == 0) {
        String onTimeString = message.substring(message.indexOf('-') + 1, message.length());
        onTime = onTimeString.toInt();
      }
    }
    Serial.print((String)dataReceived);
    
    newData = false;
  }
}


