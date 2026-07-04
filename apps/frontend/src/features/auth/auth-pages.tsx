import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, LogOut, Mail, ShieldCheck, UserPlus } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import {
  getCurrentUser,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
} from "./auth-api.js";

export function RegisterPage(): ReactNode {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const mutation = useMutation({
    mutationFn: registerCustomer,
    onSuccess: async () => navigate({ to: "/account" }),
  });

  return (
    <AuthFrame
      eyebrow="Create account"
      title="Start your Midas Basket profile"
      description="Use one customer account for checkout, wishlist, order history, and future dashboard features."
      icon={<UserPlus size={22} />}
    >
      <form
        className="auth-form"
        onSubmit={(event) => submitForm(event, () => mutation.mutate(form))}
      >
        <label>
          <span>Name</span>
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label>
          <span>Password</span>
          <input
            required
            minLength={8}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Create account
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function LoginPage(): ReactNode {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const mutation = useMutation({
    mutationFn: loginCustomer,
    onSuccess: async () => navigate({ to: "/account" }),
  });

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Log in to continue shopping"
      description="Access your session with rotating refresh cookies and backend-enforced account permissions."
      icon={<ShieldCheck size={22} />}
    >
      <form
        className="auth-form"
        onSubmit={(event) => submitForm(event, () => mutation.mutate(form))}
      >
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label>
          <span>Password</span>
          <input
            required
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Log in
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          <Link to="/forgot-password">Forgot password?</Link> ·{" "}
          <Link to="/register">Create account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage(): ReactNode {
  const [email, setEmail] = useState("");
  const mutation = useMutation({ mutationFn: requestPasswordReset });

  return (
    <AuthFrame
      eyebrow="Password help"
      title="Request a reset link"
      description="If an active account exists, the backend accepts the request without exposing account presence."
      icon={<Mail size={22} />}
    >
      <form
        className="auth-form"
        onSubmit={(event) => submitForm(event, () => mutation.mutate(email))}
      >
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Send reset request
        </Button>
        {mutation.isSuccess ? (
          <p className="form-success">Reset request accepted.</p>
        ) : null}
        <FormStatus error={mutation.error} pending={mutation.isPending} />
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordPage(): ReactNode {
  const [form, setForm] = useState({ token: "", password: "" });
  const mutation = useMutation({ mutationFn: resetPassword });

  return (
    <AuthFrame
      eyebrow="New password"
      title="Reset your password"
      description="Password reset consumes the token and revokes active sessions for the account."
      icon={<KeyRound size={22} />}
    >
      <form
        className="auth-form"
        onSubmit={(event) => submitForm(event, () => mutation.mutate(form))}
      >
        <label>
          <span>Reset token</span>
          <input
            required
            value={form.token}
            onChange={(event) =>
              setForm({ ...form, token: event.target.value })
            }
          />
        </label>
        <label>
          <span>New password</span>
          <input
            required
            minLength={8}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Reset password
        </Button>
        {mutation.isSuccess ? (
          <p className="form-success">Password reset complete.</p>
        ) : null}
        <FormStatus error={mutation.error} pending={mutation.isPending} />
      </form>
    </AuthFrame>
  );
}

export function AccountPage(): ReactNode {
  const navigate = useNavigate();
  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });
  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => navigate({ to: "/login" }),
  });

  return (
    <main className="page-shell account-page">
      <section className="section-heading">
        <span className="eyebrow">Customer session</span>
        <h1>Account dashboard</h1>
      </section>
      <Card className="account-card">
        <CardBody>
          {userQuery.isLoading ? <p>Loading account...</p> : null}
          {userQuery.data ? (
            <div className="account-summary">
              <div>
                <strong>{userQuery.data.name}</strong>
                <span>{userQuery.data.email}</span>
                <small>{userQuery.data.role}</small>
              </div>
              <Button
                tone="secondary"
                startContent={<LogOut size={18} />}
                onClick={() => logoutMutation.mutate()}
              >
                Log out
              </Button>
            </div>
          ) : null}
          {userQuery.error ? (
            <p className="form-error">
              Please log in again to view your account.
            </p>
          ) : null}
        </CardBody>
      </Card>
    </main>
  );
}

function AuthFrame({
  children,
  description,
  eyebrow,
  icon,
  title,
}: Readonly<{
  children: ReactNode;
  description: string;
  eyebrow: string;
  icon: ReactNode;
  title: string;
}>): ReactNode {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="auth-icon">{icon}</span>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Card className="auth-card">
          <CardBody>{children}</CardBody>
        </Card>
      </section>
    </main>
  );
}

function FormStatus({
  error,
  pending,
}: Readonly<{ error: Error | null; pending: boolean }>): ReactNode {
  if (pending) {
    return <p className="form-muted">Working...</p>;
  }

  if (error) {
    return <p className="form-error">{error.message}</p>;
  }

  return null;
}

function submitForm(
  event: FormEvent<HTMLFormElement>,
  action: () => void,
): void {
  event.preventDefault();
  action();
}
