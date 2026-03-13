# RespiraGuard-AI

RespiraGuard-AI transforms a traditional nebulizer into an intelligent respiratory monitoring system using IoT sensors, real-time cloud analytics, and AI-driven insights. The system monitors environmental conditions and breathing signals during therapy to estimate respiratory risk and provide meaningful health insights.

---

## Problem

Millions of people suffering from respiratory diseases such as asthma and COPD rely on nebulizers for therapy. However, traditional nebulizers are passive devices that only deliver medication and provide no monitoring of breathing conditions or environmental triggers.

This lack of monitoring makes it difficult for patients and doctors to understand how environmental factors and breathing patterns affect respiratory health during therapy.

---

## Solution

RespiraGuard-AI enhances traditional nebulizers by integrating IoT sensors, real-time cloud connectivity, and intelligent analytics.

The system collects environmental and respiratory signals during nebulizer therapy and provides real-time insights through a dashboard. By analyzing these signals, the platform estimates respiratory risk levels and helps users better understand their breathing conditions.

---

## Key Features

- Real-time respiratory monitoring
- Environmental trigger detection
- Live sensor data visualization
- AI-based respiratory risk prediction
- Cloud-based data storage
- Session history and insights dashboard

---

## System Architecture
# RespiraGuard-AI

RespiraGuard-AI transforms a traditional nebulizer into an intelligent respiratory monitoring system using IoT sensors, real-time cloud analytics, and AI-driven insights. The system monitors environmental conditions and breathing signals during therapy to estimate respiratory risk and provide meaningful health insights.

---

## Problem

Millions of people suffering from respiratory diseases such as asthma and COPD rely on nebulizers for therapy. However, traditional nebulizers are passive devices that only deliver medication and provide no monitoring of breathing conditions or environmental triggers.

This lack of monitoring makes it difficult for patients and doctors to understand how environmental factors and breathing patterns affect respiratory health during therapy.

---

## Solution

RespiraGuard-AI enhances traditional nebulizers by integrating IoT sensors, real-time cloud connectivity, and intelligent analytics.

The system collects environmental and respiratory signals during nebulizer therapy and provides real-time insights through a dashboard. By analyzing these signals, the platform estimates respiratory risk levels and helps users better understand their breathing conditions.

---

## Key Features

- Real-time respiratory monitoring
- Environmental trigger detection
- Live sensor data visualization
- AI-based respiratory risk prediction
- Cloud-based data storage
- Session history and insights dashboard

---

## System Architecture
Sensors (MQ135, DHT11, KY038)
↓
ESP32 Microcontroller
↓
Firebase Realtime Database
↓
Web Dashboard (React)
↓
AI Detection Model
↓
Respiratory Risk Insights



---

## Hardware Components

- **ESP32** – Microcontroller for sensor integration and cloud communication
- **MQ135 Gas Sensor** – Detects air quality and environmental pollutants
- **DHT11 Sensor** – Measures temperature and humidity
- **KY038 Microphone Sensor** – Captures respiratory sound patterns
- **OLED Display** – Displays real-time sensor data locally
- **Nebulizer Device** – Respiratory therapy equipment

---

## Software Stack

- **Frontend:** React.js, TailwindCSS
- **Backend / Cloud:** Firebase Realtime Database
- **Microcontroller:** ESP32
- **Machine Learning:** Python (Respiratory Risk Detection Model)
- **Data Visualization:** Recharts

---

## How It Works

1. Sensors collect environmental and respiratory signals during nebulizer therapy.
2. The ESP32 sends this data to Firebase in real time.
3. The web dashboard visualizes the sensor data with live charts.
4. A detection model analyzes environmental conditions and breathing signals.
5. The system estimates respiratory risk levels and generates health insights.

---

## Demo Flow

1. Start nebulizer session
2. Sensors begin collecting data
3. Data streams to Firebase
4. Dashboard displays real-time charts
5. AI model analyzes signals and predicts respiratory risk

---

## Impact

RespiraGuard-AI converts a passive respiratory therapy device into an intelligent monitoring system. By combining IoT sensing, real-time analytics, and AI insights, the platform helps patients and doctors better understand breathing conditions and environmental triggers during therapy.

---

## Future Improvements

- Integration with wearable respiratory sensors
- More advanced AI models for breathing pattern detection
- Doctor dashboard for remote monitoring
- Mobile app integration
- Predictive alerts for respiratory attacks

---

## Team

Built for Hackathon Project – **RespiraGuard-AI**

Team Members:
- Parth Pandit
- Sara Raut
- Digvijay Mali
---

## License

This project is developed for educational and research purposes during a hackathon.
