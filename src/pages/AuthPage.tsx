import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useI18n } from "../hooks/useI18n";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function AuthPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const signInGuest = useAuthStore((state) => state.signInGuest);
  const authStatus = useAuthStore((state) => state.status);
  const pushToast = useUiStore((state) => state.pushToast);
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signInGuest(nickname);
      navigate("/", { replace: true });
    } catch (error) {
      pushToast(getErrorMessage(error, "errors.createGuestSession"));
    }
  };

  return (
    <main className="page page--centered">
      <Card className="hero-card">
        <p className="eyebrow">{t("auth.eyebrow")}</p>
        <h1>{t("auth.title")}</h1>
        <p className="hero-text">{t("auth.description")}</p>

        <form className="stack-lg" onSubmit={handleSubmit}>
          <label className="field">
            <span>{t("auth.nickname")}</span>
            <Input
              value={nickname}
              maxLength={50}
              placeholder="alice"
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
