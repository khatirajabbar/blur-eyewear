"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { useTranslation } from "@/hooks/use-translation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "create";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

export function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { configured, ready, user, refreshUser, signOut } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const next = safeNext(searchParams.get("next"));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(t("account.noConfig"));
      return;
    }

    setPending(true);
    try {
      if (mode === "create") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });

        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage(t("account.checkEmail"));
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }

      await refreshUser();
      router.replace(next);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("cart.checkoutError"));
    } finally {
      setPending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/account");
    router.refresh();
  };

  if (!configured) {
    return <main className="account-page page-shell"><p className="eyebrow">{t("account.eyebrow")}</p><h1>{t("account.title")}</h1><p className="account-copy">{t("account.noConfig")}</p></main>;
  }

  if (!ready) {
    return <main className="account-page page-shell"><p className="eyebrow">{t("account.eyebrow")}</p><h1>{t("account.title")}</h1><p className="account-copy">…</p></main>;
  }

  if (user) {
    return (
      <main className="account-page page-shell">
        <p className="eyebrow">{t("account.eyebrow")}</p>
        <h1>{t("account.welcome")}</h1>
        <div className="account-panel glass-panel">
          <p>{user.email}</p>
          <div className="account-actions">
            <button type="button" className="editorial-link" onClick={handleSignOut}>{t("account.signOut")}</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page page-shell">
      <p className="eyebrow">{t("account.eyebrow")}</p>
      <h1>{t("account.title")}</h1>
      <p className="account-copy">{t("account.copy")}</p>
      <div className="auth-switch" role="tablist" aria-label={t("account.eyebrow")}>
        <button type="button" role="tab" aria-selected={mode === "sign-in"} className={mode === "sign-in" ? "is-active" : ""} onClick={() => setMode("sign-in")}>{t("account.signIn")}</button>
        <button type="button" role="tab" aria-selected={mode === "create"} className={mode === "create" ? "is-active" : ""} onClick={() => setMode("create")}>{t("account.create")}</button>
      </div>
      <form className="auth-form glass-panel" onSubmit={submit}>
        {mode === "create" && <label>{t("account.name")}<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} required autoComplete="name" /></label>}
        <label>{t("account.email")}<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" /></label>
        <label>{t("account.password")}<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={8} autoComplete={mode === "create" ? "new-password" : "current-password"} /></label>
        <p className="auth-hint">{t("account.passwordHint")}</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message}</p>}
        <button className="add-button" disabled={pending} type="submit"><TextShuffle text={pending ? "…" : mode === "create" ? t("account.submitCreate") : t("account.submitSignIn")} /></button>
      </form>
    </main>
  );
}
