import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { House, LogOut } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useState } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { PasswordInput } from "../../shared/ui/password-input.js";
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
    onSuccess: async (data) => {
      if (data.user.role === "admin") {
        await navigate({ to: "/admin" });
      } else {
        await navigate({ to: "/dashboard" });
      }
    },
  });

  return (
    <AuthFrame
      eyebrow="Create account"
      title="Start your Midas Basket profile"
      description="One account for checkout, your wishlist, and order history."
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          submitForm(event, () => {
            mutation.mutate(form);
          });
        }}
      >
        <label>
          <span>Name</span>
          <input
            required
            minLength={2}
            autoComplete="name"
            value={form.name}
            onChange={(event) => {
              setForm({ ...form, name: event.target.value });
            }}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
            }}
          />
        </label>
        <label>
          <span>Password</span>
          <PasswordInput
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => {
              setForm({ ...form, password: event.target.value });
            }}
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Create account
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          Already have an account? <Link to="/login">Log in</Link>
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
    onSuccess: async (data) => {
      if (data.user.role === "admin") {
        await navigate({ to: "/admin" });
      } else {
        await navigate({ to: "/dashboard" });
      }
    },
  });

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Log in to continue shopping"
      description="See your orders, wishlist, and saved addresses."
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          submitForm(event, () => {
            mutation.mutate(form);
          });
        }}
      >
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
            }}
          />
        </label>
        <label>
          <span className="auth-label-row">
            <span>Password</span>
            <Link to="/forgot-password" className="auth-inline-link">
              Forgot password?
            </Link>
          </span>
          <PasswordInput
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(event) => {
              setForm({ ...form, password: event.target.value });
            }}
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Log in
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          New to Midas Basket? <Link to="/register">Create account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage(): ReactNode {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (_data, submittedFor) => {
      setSubmittedEmail(submittedFor);
    },
  });

  if (submittedEmail) {
    return (
      <AuthFrame
        eyebrow="Password help"
        title="Check your email"
        description="We've sent you a link to reset your password."
      >
        <div className="auth-form">
          <p className="form-success">
            If an account exists for <strong>{submittedEmail}</strong>, a
            password reset link is on its way. The link expires in 1 hour.
          </p>
          <p className="form-muted">
            Didn't get it? Check your spam folder, or try again below.
          </p>
          <Button
            tone="secondary"
            onClick={() => {
              setSubmittedEmail(null);
            }}
          >
            Try a different email
          </Button>
          <p className="form-link">
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      eyebrow="Password help"
      title="Request a reset link"
      description="Enter your email and we'll send you a reset link."
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          submitForm(event, () => {
            mutation.mutate(email);
          });
        }}
      >
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </label>
        <Button type="submit" tone="primary" disabled={mutation.isPending}>
          Send reset request
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordPage(): ReactNode {
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" });
  const [form, setForm] = useState({
    token: search.token ?? "",
    password: "",
    confirmPassword: "",
  });
  const [showTokenField, setShowTokenField] = useState(!search.token);
  const [isComplete, setIsComplete] = useState(false);
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setIsComplete(true);
    },
  });

  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  if (isComplete) {
    return (
      <AuthFrame
        eyebrow="New password"
        title="Password updated"
        description="You can now log in with your new password."
      >
        <div className="auth-form">
          <p className="form-success">
            Your password has been changed and every active session was
            signed out.
          </p>
          <Button
            tone="primary"
            onClick={() => {
              void navigate({ to: "/login" });
            }}
          >
            Continue to login
          </Button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      eyebrow="New password"
      title="Reset your password"
      description="Choose a new password. You'll be signed out on other devices."
    >
      <form
        className="auth-form"
        onSubmit={(event) => {
          submitForm(event, () => {
            if (passwordsMismatch) {
              return;
            }
            mutation.mutate({ token: form.token, password: form.password });
          });
        }}
      >
        {showTokenField ? (
          <label>
            <span>Reset token</span>
            <input
              required
              value={form.token}
              onChange={(event) => {
                setForm({ ...form, token: event.target.value });
              }}
            />
          </label>
        ) : (
          <div>
            <p className="form-muted">
              Resetting your password using the link from your email.
            </p>
            <button
              type="button"
              className="form-link-button"
              onClick={() => {
                setShowTokenField(true);
              }}
            >
              Enter a reset token manually instead
            </button>
          </div>
        )}
        <label>
          <span>New password</span>
          <PasswordInput
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => {
              setForm({ ...form, password: event.target.value });
            }}
          />
        </label>
        <label>
          <span>Confirm new password</span>
          <PasswordInput
            required
            minLength={8}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(event) => {
              setForm({ ...form, confirmPassword: event.target.value });
            }}
          />
        </label>
        {passwordsMismatch ? (
          <p className="form-error">Passwords do not match</p>
        ) : null}
        <Button
          type="submit"
          tone="primary"
          disabled={mutation.isPending || passwordsMismatch}
        >
          Reset password
        </Button>
        <FormStatus error={mutation.error} pending={mutation.isPending} />
        <p className="form-link">
          <Link to="/login">Back to login</Link>
        </p>
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
        <h3 style={{ margin: 0 }}>Account dashboard</h3>
      </section>
      <div style={{ marginTop: "1rem" }}>
        <Card className="account-card">
          <CardBody>
            {userQuery.isLoading ? (
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <Skeleton className="h-6 w-1/3 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-1/4 rounded-lg" />
              </div>
            ) : null}
            {userQuery.data ? (
              <div className="account-summary">
                <div>
                  <strong>{userQuery.data.name}</strong>
                  <span>{userQuery.data.email}</span>
                  <small>{userQuery.data.role}</small>
                  <p className="form-link">
                    <Link to="/dashboard">Customer dashboard</Link> ·{" "}
                    <Link to="/admin">Admin dashboard</Link>
                  </p>
                </div>
                <Button
                  tone="secondary"
                  startContent={<LogOut size={18} />}
                  onClick={() => {
                    logoutMutation.mutate();
                  }}
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
      </div>
    </main>
  );
}

function AuthFrame({
  children,
  description,
  eyebrow,
  title,
}: Readonly<{
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}>): ReactNode {
  return (
    <main className="auth-page">
      <nav className="auth-navigation" aria-label="Home navigation">
        <Link
          className="auth-home-link"
          to="/"
          aria-label="Back to home"
          title="Back to home"
        >
          <House size={18} aria-hidden="true" />
        </Link>
        <Link className="auth-logo" to="/" aria-label="Midas Basket home">
          <img src="/logo_v2.png" alt="Midas Basket" />
        </Link>
      </nav>
      <Card className="auth-card">
        <CardBody>
          <header className="auth-card-header">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 className="auth-title">{title}</h1>
            <p className="auth-description">{description}</p>
          </header>
          {children}
        </CardBody>
      </Card>
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
  event: SyntheticEvent<HTMLFormElement>,
  action: () => void,
): void {
  event.preventDefault();
  action();
}
