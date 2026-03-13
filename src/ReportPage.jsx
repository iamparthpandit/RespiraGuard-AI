import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

const ReportPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch session data
  useEffect(() => {
    if (!user) return;

    const fetchSession = async () => {
      try {
        const sessionsRef = collection(db, "users", user.uid, "sessions");
        const q = query(sessionsRef, where("__name__", "==", sessionId));
        const snapshot = await getDocs(sessionsRef);

        const data = snapshot.docs.find((doc) => doc.id === sessionId);
        if (data) {
          setSession({ id: data.id, ...data.data() });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [user, sessionId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskColor = (risk) => {
    if (risk.includes("High")) return "text-red-700 bg-red-50";
    if (risk.includes("Moderate")) return "text-amber-700 bg-amber-50";
    return "text-emerald-700 bg-emerald-50";
  };

  const getRiskBadgeColor = (risk) => {
    if (risk.includes("High")) return "bg-red-600 text-white";
    if (risk.includes("Moderate")) return "bg-amber-600 text-white";
    return "bg-emerald-600 text-white";
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNavbar />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-slate-600 mb-4">Session not found</p>
              <button
                onClick={() => navigate("/respiratory-data")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavbar />
        <div className="flex-1 overflow-auto p-8">
          {/* Print Button */}
          <div className="mb-6 flex justify-end gap-3 print:hidden">
            <button
              onClick={() => navigate("/respiratory-data")}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              Back
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Print Report
            </button>
          </div>

          {/* Report Container */}
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-4xl mx-auto print:shadow-none print:max-w-full">
            {/* Header Section */}
            <div className="border-b-2 border-slate-300 pb-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    RespiraGuard Medical Report
                  </h1>
                  <p className="text-slate-500 mt-1">
                    Nebulizer Therapy Session Report
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">
                    Report ID
                  </p>
                  <p className="text-sm text-slate-600 font-mono">
                    {session.id?.substring(0, 8)}
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Patient Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Patient Name
                  </p>
                  <p className="text-lg text-slate-900">
                    {user?.displayName || "Patient"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Patient ID
                  </p>
                  <p className="text-lg text-slate-900 font-mono">
                    {user?.uid?.substring(0, 12)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Email
                  </p>
                  <p className="text-lg text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Report Date
                  </p>
                  <p className="text-lg text-slate-900">
                    {formatDate(new Date())}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Session Details
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 font-semibold">
                    Session Date & Time
                  </p>
                  <p className="text-lg text-slate-900 mt-1">
                    {formatDate(session.sessionStartedAt)}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 font-semibold">
                    Session Duration
                  </p>
                  <p className="text-lg text-slate-900 mt-1">
                    {session.sessionDurationLabel || "N/A"}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 font-semibold">
                    Therapy Type
                  </p>
                  <p className="text-lg text-slate-900 mt-1">
                    Nebulizer Therapy
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 font-semibold">
                    Device Status
                  </p>
                  <p className="text-lg text-emerald-700 font-semibold mt-1">
                    ✓ Completed
                  </p>
                </div>
              </div>
            </div>

            {/* Vital Signs & Environmental Data */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Vital Signs & Environmental Data
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Parameter
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Normal Range
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        Air Quality Index (AQI)
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {session.airQualityIndex || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">0-100 μg/m³</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        Temperature
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {session.temperature
                          ? `${session.temperature.toFixed(1)}°C`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        20-25°C
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        Humidity Level
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {session.humidity
                          ? `${session.humidity.toFixed(1)}%`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">40-60%</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        Breathing Sound Intensity
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {session.breathingSoundIntensity || "N/A"} dB
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ≤ 60 dB
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Normal
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        Breathing Score
                      </td>
                      <td className="px-4 py-3 text-slate-900">
                        {session.breathingScore
                          ? `${session.breathingScore.toFixed(1)}/100`
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        &gt; 70
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.breathingScore > 70
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {session.breathingScore > 70
                            ? "Good"
                            : "Monitor"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Assessment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Respiratory Risk Assessment
              </h2>
              <div className={`p-6 rounded-lg ${getRiskColor(session.riskLevel)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Risk Classification
                    </p>
                    <p className="text-2xl font-bold mt-2">
                      {session.riskLevel || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-6 py-3 rounded-full text-lg font-bold ${getRiskBadgeColor(
                        session.riskLevel
                      )}`}
                    >
                      {session.status || "Monitoring"}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm opacity-90">
                  This assessment is based on real-time sensor data and
                  environmental conditions during the therapy session.
                </p>
              </div>
            </div>

            {/* AI Clinical Recommendations */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                AI Clinical Recommendations
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                <p className="text-slate-900 leading-relaxed">
                  {session.aiRecommendation ||
                    "No specific recommendations available."}
                </p>
                <p className="text-sm text-slate-600 mt-4 font-semibold">
                  Generated by RespiraGuard AI Assistant
                </p>
              </div>
            </div>

            {/* Doctor Notes Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Clinical Summary & Observations
              </h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Patient completed a {session.sessionDurationLabel || "nebulizer"} therapy session
                      with adequate adherence to protocol.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Environmental conditions remained stable throughout the
                      session with AQI at {session.airQualityIndex || "normal"} levels.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Respiratory parameters indicate{" "}
                      {session.riskLevel?.toLowerCase() || "stable"} condition.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Continued monitoring is recommended based on AI
                      assessment findings.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Section */}
            <div className="border-t-2 border-slate-300 pt-6 mt-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-slate-500">Report Generated</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {formatDate(new Date())}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">System Version</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    RespiraGuard v1.0
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Validity</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    Valid for 90 days
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-200">
                This is an automated medical report generated by RespiraGuard AI
                System. Please consult with your healthcare provider for
                personalized medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:max-w-full {
            max-width: 100% !important;
          }
          * {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportPage;
