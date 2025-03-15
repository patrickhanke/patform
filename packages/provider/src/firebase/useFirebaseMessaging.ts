"use client";

import { useCallback, useEffect, useState } from "react";
import { MessagePayload, onMessage } from "firebase/messaging";

import { requestPermissionAndGetToken, messaging } from "./initializeFirebase";
import { saveNotification } from "../functions";

const useFirebaseMessaging = ({
  initialize = true,
  changeHandler,
}: {
  initialize?: boolean;
  changeHandler?: (n: MessagePayload) => void;
}) => {
  const [permission, setPermission] = useState<
    "granted" | "denied" | "error" | undefined
  >();
  const [token, setToken] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    const token = await requestPermissionAndGetToken();
    setToken(token);
  }, []);

  // useEffect(() => {
  // 	const db = initDB();
  // 	console.log(db);

  // }, []);

  useEffect(() => {
    if (!token) {
      getToken();
    }
    if (!initialize) return;
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration("/firebase-messaging-sw.js")
        .then((registration) => {
          if (registration) {
            customLog(
              "Service Worker already registered with scope:",
              registration.scope,
            );
          } else {
            navigator.serviceWorker
              .register("/firebase-messaging-sw.js")
              .then((registration) => {
                customLog(
                  "Service Worker registered with scope:",
                  registration.scope,
                );
              })
              .catch((error) => {
                customLog("Service Worker registration failed:", error);
              });
          }
        })
        .catch((error) => {
          customLog("Service Worker registration check failed:", error);
        });
    }

    const customLog = (...args: any[]) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(...args);
      }
    };

    if (token) {
      const unsubscribe = onMessage(messaging, (payload) => {
        if (payload.notification) {
          saveNotification({
            title: payload.notification.title as string,
            body: payload.notification.body as string,
            timestamp: new Date().toISOString(),
            read: false,
            id: payload.messageId,
            image: payload.notification.image as string,
            data: payload.data,
          });
        }
        if (changeHandler) {
          changeHandler(payload);
        }
      });

      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event on cleanup
      };
    }
  }, [token]);

  return { permission, token, getFcmToken: getToken };
};

export default useFirebaseMessaging;
