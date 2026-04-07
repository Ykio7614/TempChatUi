import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useI18n } from "../hooks/useI18n";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { useRoomsStore } from "../store/roomsStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function AuthPage() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const { t } = useI18n();
  const signInGuest = useAuthStore((state) => state.signInGuest);
  const authStatus = useAuthStore((state) => state.status);
  const joinRoom = useRoomsStore((state) => state.joinRoom);
  const pushToast = useUiStore((state) => state.pushToast);
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signInGuest(nickname);
    } catch (error) {
      pushToast(getErrorMessage(error, "errors.createGuestSession"));
      return;
    }

    if (roomCode) {
      try {
        const room = await joinRoom(roomCode.toUpperCase());
        navigate(`/rooms/${room.id}`, { replace: true });
      } catch (error) {
        pushToast(getErrorMessage(error, "errors.joinRoom"));
        navigate("/", { replace: true });
      }
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="page page--centered">
      <Card className="hero-card">
        <BrandLogo className="hero-card__brand" />
        <p className="eyebrow">{roomCode ? t("auth.inviteEyebrow") : t("auth.eyebrow")}</p>
        <h1>{roomCode ? t("auth.inviteTitle", { code: roomCode.toUpperCase() }) : t("auth.title")}</h1>
        <p className="hero-text">{roomCode ? t("auth.inviteDescription") : t("auth.description")}</p>

        <form className="stack-lg" onSubmit={handleSubmit}>
          <label className="field">
            <span>{t("auth.nickname")}</span>
            <Input
              value={nickname}
              maxLength={50}
              placeholder={t("auth.nicknamePlaceholder")}
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
          <Button type="submit" disabled={authStatus === "checking" || nickname.trim().length === 0}>
            {t("auth.continue")}
          </Button>
        </form>
      </Card>
    </main>
  );
}
