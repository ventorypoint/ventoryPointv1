"use client";

import { useState, useTransition } from "react";
import { Building2, Globe, Clock, DollarSign, Copy, Check, ShieldAlert, Save } from "lucide-react";
import { updateOrganizationSettings } from "../actions";

interface SettingsClientProps {
  organization: {
    id: string;
    name: string;
    country?: string;
    timezone?: string;
    currency?: string;
    created_at: string;
  };
  userRole: string;
}

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
  "Australia/Sydney",
];

const COMMON_CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR - Euro" },
  { code: "GBP", symbol: "£", label: "GBP - British Pound" },
  { code: "CAD", symbol: "CA$", label: "CAD - Canadian Dollar" },
  { code: "AUD", symbol: "AU$", label: "AUD - Australian Dollar" },
  { code: "JPY", symbol: "¥", label: "JPY - Japanese Yen" },
];

export function SettingsClient({ organization, userRole }: SettingsClientProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const canEdit = ["owner", "admin"].includes(userRole);

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(organization.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canEdit) return;

    const formData = new FormData(e.currentTarget);
    setFeedback(null);

    startTransition(async () => {
      const res = await updateOrganizationSettings(organization.id, formData);
      if (res.ok) {
        setFeedback({ type: "success", message: res.message || "Settings updated successfully." });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update settings." });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Organization Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your 3PL company profile, default operational timezones, and system currencies.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between animate-in fade-in duration-150 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card: General Information */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">General Profile</h2>
                <p className="text-xs text-muted-foreground">Company identity and identifier</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono bg-surface border border-border px-2.5 py-1 rounded-md">
                {organization.id.slice(0, 8)}...
              </span>
              <button
                type="button"
                onClick={handleCopyOrgId}
                className="text-xs flex items-center gap-1 text-brand hover:text-brand/80 px-2 py-1 rounded-md hover:bg-brand/5 border border-transparent hover:border-brand/20 transition-all cursor-pointer"
                title="Copy Full Organization ID"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Organization Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={organization.name}
                required
                disabled={!canEdit || isPending}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                Country Code
              </label>
              <select
                name="country"
                defaultValue={organization.country || "US"}
                disabled={!canEdit || isPending}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
              >
                <option value="US">United States (US)</option>
                <option value="CA">Canada (CA)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="AU">Australia (AU)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="SG">Singapore (SG)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card: Localization & Defaults */}
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Localization & Cutoffs</h2>
              <p className="text-xs text-muted-foreground">Default facility timezone and billing currency</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Default Operational Timezone
              </label>
              <select
                name="timezone"
                defaultValue={organization.timezone || "America/New_York"}
                disabled={!canEdit || isPending}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                Base Currency
              </label>
              <select
                name="currency"
                defaultValue={organization.currency || "USD"}
                disabled={!canEdit || isPending}
                className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 text-xs text-muted-foreground bg-surface border border-border p-3 rounded-lg">
            Created on: {new Date(organization.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}
          </div>
        </div>

        {/* Submit Actions */}
        {canEdit && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand/90 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Organization Settings
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Danger Zone */}
      {userRole === "owner" && (
        <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-red-900 dark:text-red-300">Danger Zone</h2>
              <p className="text-xs text-red-700/70 dark:text-red-400/70">
                Critical actions affecting all members and 3PL operational data
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">Transfer or Delete Organization</div>
              <div className="text-xs text-muted-foreground">
                Permanently purge all warehouse facilities, client allocations, and member accounts.
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("Organization deletion requires multi-factor confirmation and no active client inventory.")}
              className="px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100/70 dark:bg-red-950 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors cursor-pointer"
            >
              Delete Organization
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
