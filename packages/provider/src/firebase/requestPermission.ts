"use client";

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return "granted";
    } else {
      console.log("Notification permission not granted.");
      return "denied";
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "error";
  }
};

export default requestPermission;
