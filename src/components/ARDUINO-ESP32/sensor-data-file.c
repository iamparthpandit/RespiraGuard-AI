#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <DHT.h>

// WiFi credentials
#define WIFI_SSID "ALDEL_BUNGLOW"
#define WIFI_PASSWORD "87654321"

// Firebase configuration
#define API_KEY "AIzaSyDYnwn8Hjks6fru4I88WwrrXD57K12qJCE"
#define DATABASE_URL "https://respiraguard-ai-default-rtdb.firebaseio.com"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// DHT sensor
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Sensor pins
int gasSensor = 34;
int micPin = 35;

void setup()
{
  Serial.begin(115200);
  dht.begin();

  // Connect WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi Connected!");

  // Firebase config
  config.api_key = "AIzaSyDYnwn8Hjks6fru4I88WwrrXD57K12qJCE";
  config.database_url = "https://respiraguard-ai-default-rtdb.firebaseio.com";

  // Firebase anonymous sign-in
  if (Firebase.signUp(&config, &auth, "", ""))
  {
    Serial.println("Firebase signup successful");
  }
  else
  {
    Serial.printf("Signup error: %s\n", config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop()
{
  // Read sensors
  int air = analogRead(gasSensor);
  int sound = analogRead(micPin);

  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  Serial.println("Sending data to Firebase...");

  // Send Air Quality
  if (Firebase.RTDB.setInt(&fbdo, "RespiraGuard/sensors/air_quality", air))
  {
    Serial.println("Air Quality sent");
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }

  // Send Temperature
  if (Firebase.RTDB.setFloat(&fbdo, "RespiraGuard/sensors/temperature", temp))
  {
    Serial.println("Temperature sent");
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }

  // Send Humidity
  if (Firebase.RTDB.setFloat(&fbdo, "RespiraGuard/sensors/humidity", hum))
  {
    Serial.println("Humidity sent");
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }

  // Send Sound Level
  if (Firebase.RTDB.setInt(&fbdo, "RespiraGuard/sensors/sound", sound))
  {
    Serial.println("Sound sent");
  }
  else
  {
    Serial.println(fbdo.errorReason());
  }

  Serial.println("----------------------------");

  delay(1000);
}