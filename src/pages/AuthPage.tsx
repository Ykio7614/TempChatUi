import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { getErrorMessage } from "../utils/errors";

export function AuthPage() {
  const navigate = useNavigate();
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
      pushToast(getErrorMessage(error, "Could not create guest session."));
    }
  };

  return (
    <main className="page page--centered">
      <Card className="hero-card">
        <p className="eyebrow">Temporary chat</p>
        <h1>Join as a guest and spin up short-lived rooms in seconds.</h1>
        <p className="hero-text">
          TempChat keeps the flow small on purpose: guest access, lobby, room, and realtime chat over your existing API.
        </p>

        <form className="stack-lg" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nickname</span>
            <Input
              value={nickname}
              maxLength={50}
              placeholder="alice"
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
          <Button type="submit" disabled={authStatus === "checking" || nickname.trim().length === 0}>
            Continue as guest
          </Button>
        </form>
      </Card>
    </main>
  );
}
