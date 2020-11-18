// require for R24
#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>

// finish require for R24

int sensor_pin = A0;
int output_value ;
// setting up the Soil sensor

// RF pins
RF24 radio(10, 9);

//RF pips
const uint64_t pipes[2] = { 0xABCDABCD71LL, 0x744d52687ALL };

char dataReceived[32]; // must match dataToSend in master
String token = "0x744d52687A";
String sendData = "hi"; // the two values to be sent to the master
bool newData = false;
bool realTimeData = false;
unsigned long currentMillis;
unsigned long prevMillis;
unsigned long txIntervalMillis = 1000; // send once per second

// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(9600);
  
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
  if(realTimeData){
    // send the data back to Raspberrz
    //DHT.read11(dht_apin);
    //sendData = (String)DHT.humidity + "|" + (String)DHT.temperature;
    //delay(500);
   // for (int i = 0; i <= 100; i++) 
   // { 
      //sensorValue = sensorValue + analogRead(SensorPin); 
     // delay(1); 
    //} 
    //sensorValue = sensorValue/100.0; 
    //sensorValue = analogRead(SensorPin)*100/740;
    //sensorValue = sensorValue/740;
    //Serial.println(sensorValue); 
    //delay(30); 

    output_value= analogRead(sensor_pin);

   output_value = map(output_value,1023, 165, 0, 100);

   Serial.print("Mositure : ");

   Serial.print(output_value);

   Serial.println("%");
   
sendData = (String)output_value  ;
   delay(500);
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
    }else if(message == "realTimeData"){
     realTimeData = true;
    }else if(message == "stopRealTimeData"){
      realTimeData = false;
    }
    Serial.print((String)dataReceived);
    
    newData = false;
  }
}

