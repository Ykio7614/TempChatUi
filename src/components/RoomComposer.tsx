import { FormEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "../hooks/useI18n";
import { Button } from "./ui/Button";
import { TextArea } from "./ui/TextArea";

type RoomComposerProps = {
  disabled?: boolean;
  onSend: (text: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
};

export function RoomComposer({ disabled = false, onSend, onTypingStart, onTypingStop }: RoomComposerProps) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const typingRef = useRef(false);
  const stopTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (stopTimer.current) {
        window.clearTimeout(stopTimer.current);
      }
    };
  }, []);

  const scheduleTypingStop = () => {
    if (stopTimer.current) {
      window.clearTimeout(stopTimer.current);
    }

    stopTimer.current = window.setTimeout(() => {
      typingRef.current = false;
      onTypingStop();
    }, 1200);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || disabled) {
      return;
    }

    onSend(text);
    setMessage("");

    if (typingRef.current) {
      typingRef.current = false;
      onTypingStop();
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <TextArea
        rows={3}
        value={message}
        disabled={disabled}
        placeholder={t("composer.placeholder")}
        onChange={(event) => {
          setMessage(event.target.value);

          if (!typingRef.current) {
            typingRef.current = true;
            onTypingStart();
          }

          scheduleTypingStop();
        }}
      />
      <div className="composer__actions">
        <span className="muted-text">{t("composer.helper")}</span>
        <Button type="submit" disabled={disabled || !message.trim()}>
          {t("composer.send")}
        </Button>
      </div>
    </form>
  );
}
