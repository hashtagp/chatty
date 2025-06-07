// Configuration checker utility for environment variables
// This file helps verify that the correct API URLs are being used

export const checkConfiguration = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "https://api.talksy.tech";
  const nodeEnv = import.meta.env.VITE_NODE_ENV || "production";
  const mode = import.meta.env.MODE;
  
  console.log("🔍 Frontend Configuration Check:");
  console.log(`📍 API URL: ${apiUrl}`);
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`⚙️ Vite Mode: ${mode}`);
  console.log(`🔗 Auth Endpoints: ${apiUrl}/api/auth/*`);
  console.log(`💬 Message Endpoints: ${apiUrl}/api/messages/*`);
  console.log(`🔌 Socket.IO URL: ${apiUrl}`);
  
  return {
    apiUrl,
    nodeEnv,
    mode,
    authUrl: `${apiUrl}/api/auth`,
    messageUrl: `${apiUrl}/api/messages`,
    socketUrl: apiUrl
  };
};

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.checkConfig = checkConfiguration;
}
