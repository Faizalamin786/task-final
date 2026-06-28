"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function DropdownSkeleton() {
  return <div className="h-[42px] w-full animate-pulse rounded-lg bg-gray-100" />;
}

type Errors = Partial<Record<string, string>>;

function validate(data: Record<string, unknown>): Errors {
  const errs: Errors = {};

  if (!data.firstName || (data.firstName as string).trim().length < 2)
    errs.firstName = "First name is required";

  if (!data.lastName || (data.lastName as string).trim().length < 2)
    errs.lastName = "Last name is required";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRe.test(data.email as string))
    errs.email = "Enter a valid email address";

  const phoneDigits = (data.phone as string || "").replace(/\D/g, "");
  if (phoneDigits.length !== 10)
    errs.phone = "Phone must be exactly 10 digits";

  const zip = (data.zipCode as string || "").trim();
  if (!/^\d{5}$/.test(zip))
    errs.zipCode = "ZIP code must be 5 digits";

  if (!data.vehicleYear) errs.vehicleYear = "Select a year";
  if (!data.vehicleMake) errs.vehicleMake = "Select a make";
  if (!data.vehicleModel) errs.vehicleModel = "Select a model";

  return errs;
}

export default function LeadForm() {
  const [years, setYears] = useState<number[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const [yearsLoading, setYearsLoading] = useState(true);
  const [makesLoading, setMakesLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    fetch("/api/vehicles/years")
      .then((r) => r.json())
      .then((data) => {
        setYears(data);
        setYearsLoading(false);
      });
  }, []);

  // year change — refetch makes, reset downstream
  useEffect(() => {
    if (!year) return;
    setMakesLoading(true);
    setMake("");
    setModel("");
    setModels([]);
    fetch(`/api/vehicles/makes?year=${year}`)
      .then((r) => r.json())
      .then((data) => {
        setMakes(data);
        setMakesLoading(false);
      });
  }, [year]);

  // make change — refetch models
  useEffect(() => {
    if (!year || !make) return;
    setModelsLoading(true);
    setModel("");
    fetch(`/api/vehicles/models?year=${year}&make=${make}`)
      .then((r) => r.json())
      .then((data) => {
        setModels(data);
        setModelsLoading(false);
      });
  }, [year, make]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: fd.get("firstName") as string,
      lastName: fd.get("lastName") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      zipCode: fd.get("zipCode") as string,
      vehicleYear: Number(year),
      vehicleMake: make,
      vehicleModel: model,
      hasInsurance: fd.get("hasInsurance") === "on",
    };

    // client-side validation first
    const errs = validate(payload);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Done! We'll be in touch within 24 hours.");
        form.reset();
        setYear("");
        setMake("");
        setModel("");
        setMakes([]);
        setModels([]);
        setErrors({});
      } else {
        const data = await res.json();
        toast.error(data?.error || "Something went wrong. Try again.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  const field = (hasError: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 focus:border-amber-400 focus:ring-amber-100"
    }`;

  const ErrorMsg = ({ name }: { name: string }) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
    ) : null;

  return (
    <div className="rounded-3xl bg-white p-7 shadow-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Free Quote</p>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Enter your details</h2>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input name="firstName" placeholder="First name" className={field(!!errors.firstName)} />
            <ErrorMsg name="firstName" />
          </div>
          <div>
            <input name="lastName" placeholder="Last name" className={field(!!errors.lastName)} />
            <ErrorMsg name="lastName" />
          </div>
        </div>

        <div>
          <input name="email" type="email" placeholder="Email address" className={field(!!errors.email)} />
          <ErrorMsg name="email" />
        </div>

        <div>
          <input name="phone" type="tel" placeholder="Phone (10 digits)" className={field(!!errors.phone)} maxLength={10} />
          <ErrorMsg name="phone" />
        </div>

        <div>
          <input name="zipCode" placeholder="ZIP code" maxLength={5} className={field(!!errors.zipCode)} />
          <ErrorMsg name="zipCode" />
        </div>

        {/* year */}
        <div>
          <label htmlFor="year" className="mb-1 block text-xs font-medium text-gray-400">Vehicle Year</label>
          {yearsLoading ? <DropdownSkeleton /> : (
            <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className={field(!!errors.vehicleYear)}>
              <option value="">Select year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          )}
          <ErrorMsg name="vehicleYear" />
        </div>

        {/* make */}
        <div>
          <label htmlFor="make" className="mb-1 block text-xs font-medium text-gray-400">Make</label>
          {makesLoading ? <DropdownSkeleton /> : (
            <select id="make" value={make} onChange={(e) => setMake(e.target.value)} className={field(!!errors.vehicleMake)} disabled={!year}>
              <option value="">{year ? "Select make" : "Select year first"}</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
          <ErrorMsg name="vehicleMake" />
        </div>

        {/* model */}
        <div>
          <label htmlFor="model" className="mb-1 block text-xs font-medium text-gray-400">Model</label>
          {modelsLoading ? <DropdownSkeleton /> : (
            <select id="model" value={model} onChange={(e) => setModel(e.target.value)} className={field(!!errors.vehicleModel)} disabled={!make}>
              <option value="">{make ? "Select model" : "Select make first"}</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          )}
          <ErrorMsg name="vehicleModel" />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-500">
          <input type="checkbox" name="hasInsurance" className="rounded accent-amber-500" />
          I currently have auto insurance
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl py-3 text-sm font-bold transition disabled:opacity-60"
          style={{ background: "#F59E0B", color: "#0A0F1E" }}
        >
          {submitting ? "Submitting..." : "Get My Free Quote →"}
        </button>

        <p className="text-center text-xs text-gray-400">
          No spam · No obligations · 2 minutes
        </p>
      </form>
    </div>
  );
}