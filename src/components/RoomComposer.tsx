import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useI18n } from "../hooks/useI18n";
import { Button } from "./ui/Button";
import { TextArea } from "./ui/TextArea";

type RoomComposerProps = {
  inputDisabled?: boolean;
  sendDisabled?: boolean;
  onSend: (text: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
};

export function RoomComposer({
  inputDisabled = false,
  sendDisabled = false,
  onSend,
  onTypingStart,
  onTypingStop,
}: RoomComposerProps) {
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

  const submitMessage = () => {
    const text = message.trim();
    if (!text || inputDisabled || sendDisabled) {
      return;
    }

    onSend(text);
    setMessage("");

    if (typingRef.current) {
      typingRef.current = false;
      onTypingStop();
    }
  };

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
    submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    submitMessage();
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <TextArea
        rows={3}
        value={message}
        disabled={inputDisabled}
        placeholder={t("composer.placeholder")}
        enterKeyHint="send"
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck
        onKeyDown={handleKeyDown}
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
        <Button type="submit" disabled={inputDisabled || sendDisabled || !message.trim()}>
          {t("composer.send")}
        </Button>
      </div>
    </form>
  );
}
