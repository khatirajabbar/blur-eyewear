"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { TextShuffle } from "@/components/ui/text-shuffle";
import { useTranslation } from "@/hooks/use-translation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "sign-in" | "create";
type PendingAction = "profile" | "email" | "password" | "delete" | null;
type Notice = { tone: "error" | "success"; text: string } | null;
type AccountOrder = {
  id: string;
  amount_total: number | null;
  created_at: string;
  currency: string;
  paid_at: string | null;
  status: string;
};
type AccountData = {
  isAdmin: boolean;
  orders: AccountOrder[];
  ordersUnavailable: boolean;
  ownerId: string;
};

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/account";
}

function AccountNotice({ notice }: { notice: Notice }) {
  if (!notice) return null;

  return <p className={notice.tone === "error" ? "form-error" : "form-message"} role={notice.tone === "error" ? "alert" : "status"}>{notice.text}</p>;
}

function formatOrderTotal(amount: number | null, currency: string, locale: string) {
  if (amount === null) return "—";

  try {
    return new Intl.NumberFormat(locale, {
      currency: currency.toUpperCase(),
      style: "currency",
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatOrderDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { configured, ready, user, refreshUser, signOut } = useAuth();
  const { locale, t } = useTranslation();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ ownerId: "", value: "" });
  const [emailDraft, setEmailDraft] = useState({ ownerId: "", value: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [profileNotice, setProfileNotice] = useState<Notice>(null);
  const [emailNotice, setEmailNotice] = useState<Notice>(null);
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [deleteNotice, setDeleteNotice] = useState<Notice>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const next = safeNext(searchParams.get("next"));
  const userId = user?.id ?? null;
  const currentDisplayName = typeof user?.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "";
  const profileName = profileDraft.ownerId === userId ? profileDraft.value : currentDisplayName;
  const newEmail = emailDraft.ownerId === userId ? emailDraft.value : "";
  const dataMatchesUser = Boolean(userId && accountData?.ownerId === userId);
  const orders = dataMatchesUser ? accountData?.orders ?? [] : [];
  const ordersLoading = Boolean(userId && !dataMatchesUser);
  const ordersUnavailable = dataMatchesUser && Boolean(accountData?.ordersUnavailable);
  const isAdmin = dataMatchesUser && Boolean(accountData?.isAdmin);

  useEffect(() => {
    if (!userId) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let active = true;

    void Promise.all([
      supabase
        .from("orders")
        .select("id, amount_total, created_at, currency, paid_at, status")
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle(),
    ]).then(([ordersResult, profileResult]) => {
      if (!active) return;
      setAccountData({
        isAdmin: profileResult.data?.role === "admin",
        orders: ordersResult.error ? [] : (ordersResult.data ?? []) as AccountOrder[],
        ordersUnavailable: Boolean(ordersResult.error),
        ownerId: userId,
      });
    }).catch(() => {
      if (!active) return;
      setAccountData({ isAdmin: false, orders: [], ordersUnavailable: true, ownerId: userId });
    });

    return () => {
      active = false;
    };
  }, [userId]);

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

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = profileName.trim();
    setProfileNotice(null);

    if (trimmedName.length < 2) {
      setProfileNotice({ tone: "error", text: t("account.nameRequired") });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user) return;

    setPendingAction("profile");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { ...user.user_metadata, display_name: trimmedName },
      });
      if (updateError) throw updateError;
      await refreshUser();
      setProfileDraft({ ownerId: user.id, value: trimmedName });
      setProfileNotice({ tone: "success", text: t("account.profileSaved") });
    } catch {
      setProfileNotice({ tone: "error", text: t("account.updateFailed") });
    } finally {
      setPendingAction(null);
    }
  };

  const updateEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestedEmail = newEmail.trim().toLowerCase();
    setEmailNotice(null);

    if (!user?.email || !requestedEmail || requestedEmail === user.email.toLowerCase()) {
      setEmailNotice({ tone: "error", text: t("account.emailSame") });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setPendingAction("email");
    try {
      const { error: updateError } = await supabase.auth.updateUser(
        { email: requestedEmail },
        { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/account")}` },
      );
      if (updateError) throw updateError;
      await refreshUser();
      setEmailDraft({ ownerId: user.id, value: "" });
      setEmailNotice({ tone: "success", text: t("account.emailPending") });
    } catch {
      setEmailNotice({ tone: "error", text: t("account.updateFailed") });
    } finally {
      setPendingAction(null);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordNotice(null);

    if (newPassword.length < 8) {
      setPasswordNotice({ tone: "error", text: t("account.passwordHint") });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ tone: "error", text: t("account.passwordMismatch") });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setPendingAction("password");
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        current_password: currentPassword,
        password: newPassword,
      });
      if (updateError) throw updateError;
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordNotice({ tone: "success", text: t("account.passwordUpdated") });
    } catch {
      setPasswordNotice({ tone: "error", text: t("account.passwordFailed") });
    } finally {
      setPendingAction(null);
    }
  };

  const deleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteNotice(null);

    if (deleteConfirmation.trim() !== "DELETE" || !deletePassword || !user?.email) {
      setDeleteNotice({ tone: "error", text: t("account.deleteConfirmError") });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setPendingAction("delete");
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      });
      if (reauthError) {
        setDeleteNotice({ tone: "error", text: t("account.deletePasswordError") });
        return;
      }

      const response = await fetch("/api/account", {
        body: JSON.stringify({ confirmation: "DELETE" }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (!response.ok) {
        setDeleteNotice({
          tone: "error",
          text: response.status === 403 ? t("account.deleteAdmin") : t("account.deleteFailed"),
        });
        return;
      }

      await signOut();
      router.replace("/");
      router.refresh();
    } catch {
      setDeleteNotice({ tone: "error", text: t("account.deleteFailed") });
    } finally {
      setDeletePassword("");
      setPendingAction(null);
    }
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

        <section className="account-settings" aria-labelledby="account-settings-heading">
          <div className="account-settings-intro">
            <div>
              <p className="eyebrow">{t("account.settings")}</p>
              <h2 id="account-settings-heading">{t("account.settingsTitle")}</h2>
            </div>
            <p>{t("account.settingsCopy")}</p>
          </div>

          <div className="account-settings-grid">
            <form className="account-setting-card glass-panel" onSubmit={updateProfile}>
              <div>
                <p className="eyebrow">01 / {t("account.profile")}</p>
                <h3>{t("account.profileTitle")}</h3>
                <p>{t("account.profileCopy")}</p>
              </div>
              <label>{t("account.name")}<input value={profileName} onChange={(event) => setProfileDraft({ ownerId: userId ?? "", value: event.target.value })} minLength={2} maxLength={80} required autoComplete="name" /></label>
              <AccountNotice notice={profileNotice} />
              <button className="add-button" disabled={pendingAction === "profile"} type="submit"><TextShuffle text={pendingAction === "profile" ? "…" : t("account.saveProfile")} /></button>
            </form>

            <form className="account-setting-card glass-panel" onSubmit={updateEmail}>
              <div>
                <p className="eyebrow">02 / {t("account.emailChange")}</p>
                <h3>{t("account.emailTitle")}</h3>
                <p>{t("account.emailCopy")}</p>
              </div>
              <label>{t("account.newEmail")}<input value={newEmail} onChange={(event) => setEmailDraft({ ownerId: userId ?? "", value: event.target.value })} type="email" required autoComplete="email" /></label>
              <AccountNotice notice={emailNotice} />
              <button className="add-button" disabled={pendingAction === "email"} type="submit"><TextShuffle text={pendingAction === "email" ? "…" : t("account.updateEmail")} /></button>
            </form>

            <form className="account-setting-card glass-panel" onSubmit={updatePassword}>
              <div>
                <p className="eyebrow">03 / {t("account.passwordChange")}</p>
                <h3>{t("account.passwordTitle")}</h3>
                <p>{t("account.passwordCopy")}</p>
              </div>
              <label>{t("account.currentPassword")}<input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" required autoComplete="current-password" /></label>
              <label>{t("account.newPassword")}<input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" required minLength={8} autoComplete="new-password" /></label>
              <label>{t("account.confirmPassword")}<input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" required minLength={8} autoComplete="new-password" /></label>
              <AccountNotice notice={passwordNotice} />
              <button className="add-button" disabled={pendingAction === "password"} type="submit"><TextShuffle text={pendingAction === "password" ? "…" : t("account.updatePassword")} /></button>
            </form>

            <section className="account-order-card" aria-labelledby="account-orders-heading">
              <div>
                <p className="eyebrow">04 / {t("account.orders")}</p>
                <h3 id="account-orders-heading">{t("account.ordersTitle")}</h3>
                <p>{t("account.ordersCopy")}</p>
              </div>
              {ordersLoading && <p className="account-order-empty">…</p>}
              {!ordersLoading && ordersUnavailable && <p className="account-order-empty" role="status">{t("account.ordersUnavailable")}</p>}
              {!ordersLoading && !ordersUnavailable && orders.length === 0 && <p className="account-order-empty">{t("account.ordersEmpty")}</p>}
              {!ordersLoading && !ordersUnavailable && orders.length > 0 && <ol className="account-order-list">
                {orders.map((order) => <li key={order.id}>
                  <div><strong>{formatOrderTotal(order.amount_total, order.currency, locale)}</strong><span>{order.status}</span></div>
                  <time dateTime={order.paid_at ?? order.created_at}>{formatOrderDate(order.paid_at ?? order.created_at, locale)}</time>
                </li>)}
              </ol>}
            </section>

            <section className="account-danger-card" aria-labelledby="account-danger-heading">
              <div>
                <p className="eyebrow">05 / {t("account.danger")}</p>
                <h3 id="account-danger-heading">{t("account.dangerTitle")}</h3>
                <p>{isAdmin ? t("account.deleteAdmin") : t("account.dangerCopy")}</p>
              </div>
              {isAdmin ? <p className="account-warning" role="status">{t("account.deleteAdmin")}</p> : <form onSubmit={deleteAccount}>
                <label>{t("account.currentPassword")}<input value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} type="password" required autoComplete="current-password" /></label>
                <label>{t("account.deleteConfirm")}<input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} required autoComplete="off" /></label>
                <p className="account-warning">{t("account.deleteWarning")}</p>
                <AccountNotice notice={deleteNotice} />
                <button className="danger-button" disabled={pendingAction === "delete" || deleteConfirmation.trim() !== "DELETE"} type="submit"><TextShuffle text={pendingAction === "delete" ? "…" : t("account.deleteAccount")} /></button>
              </form>}
            </section>
          </div>
        </section>
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
