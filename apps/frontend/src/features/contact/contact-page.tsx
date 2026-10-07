import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import type { ReactNode, SyntheticEvent } from "react";
import { useState } from "react";
import { Input, TextArea } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { toast } from "../../shared/ui/toaster.js";
import { AdminField } from "../admin/admin-form-controls.js";
import {
  submitContactMessage,
  useSiteContact,
  type SiteContact,
} from "./contact-api.js";
import {
  SocialLinkList,
  WhatsAppIcon,
  toTelHref,
  toWhatsAppHref,
} from "./social-platforms.js";

const MESSAGE_MAX_LENGTH = 5000;

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
};

const emptyContactForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export function ContactPage({
  initialContact,
}: Readonly<{ initialContact: SiteContact | null }>): ReactNode {
  const { data: contact } = useSiteContact(initialContact);
  const [form, setForm] = useState<ContactForm>(emptyContactForm);
  const [isSent, setIsSent] = useState(false);

  const submitMutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      setForm(emptyContactForm);
      setIsSent(true);
      toast.success("Message sent", {
        description: "We'll get back to you soon.",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Could not send your message");
    },
  });

  const details = contact?.details;
  const socialLinks = contact?.socialLinks ?? [];

  const channels: { icon: ReactNode; label: string; value: string; href?: string }[] = [];
  if (details?.phone) {
    channels.push({
      icon: <Phone size={18} />,
      label: "Call us",
      value: details.phone,
      href: toTelHref(details.phone),
    });
  }
  if (details?.whatsapp) {
    channels.push({
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
      value: details.whatsapp,
      href: toWhatsAppHref(details.whatsapp),
    });
  }
  if (details?.email) {
    channels.push({
      icon: <Mail size={18} />,
      label: "Email",
      value: details.email,
      href: `mailto:${details.email}`,
    });
  }
  if (details?.address) {
    channels.push({ icon: <MapPin size={18} />, label: "Visit us", value: details.address });
  }
  if (details?.businessHours) {
    channels.push({ icon: <Clock size={18} />, label: "Hours", value: details.businessHours });
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      ...(form.website ? { website: form.website } : {}),
    });
  };

  return (
    <main className="page-shell contact-page">
      <section className="section-heading catalog-heading contact-heading">
        <h1>Contact us</h1>
        <p>
          Questions about an order, a product, or bulk buying? Send us a
          message and our team will reply as soon as possible.
        </p>
      </section>

      <div className="contact-layout">
        <aside className="contact-channels" aria-label="Contact information">
          {channels.length > 0 ? (
            <ul className="contact-channel-list">
              {channels.map((channel) => (
                <li key={channel.label} className="contact-channel">
                  <span className="contact-channel-icon">{channel.icon}</span>
                  <div>
                    <small>{channel.label}</small>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        {...(channel.href.startsWith("https://")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {channel.value}
                      </a>
                    ) : (
                      <p>{channel.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {socialLinks.length > 0 ? (
            <div className="contact-social">
              <h2>Follow us</h2>
              <SocialLinkList links={socialLinks} className="is-light" />
            </div>
          ) : null}
        </aside>

        <Card className="contact-form-card">
          <CardBody>
            {isSent ? (
              <div className="contact-success" role="status">
                <CheckCircle2 size={36} />
                <h2>Thanks, your message is on its way</h2>
                <p>
                  We've received it and will reply to the email address you
                  provided.
                </p>
                <Button
                  tone="secondary"
                  onClick={() => {
                    setIsSent(false);
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="admin-modern-form" onSubmit={handleSubmit}>
                <h2 className="contact-form-title">Send a message</h2>

                <div className="admin-form-grid two">
                  <AdminField label="Your name*">
                    <Input
                      className="admin-heroui-input"
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => {
                        setForm({ ...form, name: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Email*">
                    <Input
                      className="admin-heroui-input"
                      type="email"
                      required
                      maxLength={180}
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => {
                        setForm({ ...form, email: event.target.value });
                      }}
                    />
                  </AdminField>
                </div>

                <div className="admin-form-grid two">
                  <AdminField label="Phone">
                    <Input
                      className="admin-heroui-input"
                      type="tel"
                      maxLength={30}
                      autoComplete="tel"
                      placeholder="Optional"
                      value={form.phone}
                      onChange={(event) => {
                        setForm({ ...form, phone: event.target.value });
                      }}
                    />
                  </AdminField>
                  <AdminField label="Subject*">
                    <Input
                      className="admin-heroui-input"
                      required
                      minLength={2}
                      maxLength={160}
                      value={form.subject}
                      onChange={(event) => {
                        setForm({ ...form, subject: event.target.value });
                      }}
                    />
                  </AdminField>
                </div>

                <AdminField
                  label="Message*"
                  hint={
                    <span className="admin-field-hint">
                      {form.message.length}/{MESSAGE_MAX_LENGTH}
                    </span>
                  }
                >
                  <TextArea
                    className="admin-heroui-textarea contact-message-input"
                    required
                    minLength={10}
                    maxLength={MESSAGE_MAX_LENGTH}
                    placeholder="How can we help?"
                    value={form.message}
                    onChange={(event) => {
                      setForm({ ...form, message: event.target.value });
                    }}
                  />
                </AdminField>

                {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
                <div className="contact-honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => {
                        setForm({ ...form, website: event.target.value });
                      }}
                    />
                  </label>
                </div>

                <Button
                  type="submit"
                  tone="primary"
                  disabled={submitMutation.isPending}
                  startContent={<Send size={16} />}
                >
                  {submitMutation.isPending ? "Sending…" : "Send message"}
                </Button>
                {submitMutation.error ? (
                  <p className="form-error">{submitMutation.error.message}</p>
                ) : null}
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
