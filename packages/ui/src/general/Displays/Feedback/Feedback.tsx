"use client";

import React, { useMemo } from "react";
import styles from "./Feedback.module.scss";
import useFeedbackStore from "./store";
import { BsCheck2All } from "react-icons/bs";
import { VscError } from "react-icons/vsc";
import { TbLineDotted } from "react-icons/tb";
import { UserDisplay } from "../UserDisplay";

const Feedback = () => {
  const { feedback, type } = useFeedbackStore();

  // useEffect(() => {
  // 	if (showFeedback === false) {
  // 		setShowFeedback(true);
  // 		setTimeout(() => {
  // 			setShowFeedback(false);
  // 		}, 2800);
  // 	}

  // }, [feedback, date]);

  const IconRender = useMemo(() => {
    if (type === "success") {
      return <BsCheck2All />;
    }
    if (type === "error") {
      return <VscError />;
    }
    if (type === "loading") {
      return <TbLineDotted />;
    }
    return null;
  }, [type]);

  const TextRender = useMemo(() => {
    if (type === "success") {
      if (feedback) {
        return <h6>{feedback}</h6>;
      }
      return <h6>Erfolgreich geladen</h6>;
    }
    if (type === "error") {
      if (feedback) {
        return <h6>{feedback}</h6>;
      }
      return <h6>Fehler</h6>;
    }
    if (type === "loading") {
      if (feedback) {
        return <h6>{feedback}</h6>;
      }
      return <h6>Lädt</h6>;
    }
    return null;
  }, [type, feedback]);

  return (
    <div data-type={type} className={styles.feedback_container}>
      {IconRender}
      {TextRender}
      <UserDisplay />
    </div>
  );
};

export default Feedback;
