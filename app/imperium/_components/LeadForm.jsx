"use client";
import { useState } from "react";
import { LEAD_ENDPOINT } from "../_data/ventures";

// Lead-formular. POSTer til foundry-order edge function.
// props: { source, fields:[{name,label,type,placeholder,required,options?}], submitLabel, successMsg, note }
// type ∈ "text" | "email" | "select" | "textarea"
export default function LeadForm({
  source,
  fields = [],
  submitLabel = "Send",
  successMsg = "✓ Thanks — we'll be in touch shortly.",
  note,
}) {
  const init = {};
  fields.forEach((f) => {
    init[f.name] = "";
  });
  const [values, setValues] = useState(init);
  const [msg, setMsg] = useState(null); // { text, kind: 'ok'|'err'|'pending' }
  const [busy, setBusy] = useState(false);

  const set = (name) => (e) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg({ text: "Sending…", kind: "pending" });
    try {
      const r = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, source }),
      });
      if (r.ok) {
        setMsg({ text: successMsg, kind: "ok" });
        setValues(init);
        // Lad Track-komponenten på siden logge konverteringen (kender sidens slug).
        try { window.dispatchEvent(new CustomEvent("imperium:lead", { detail: { source } })); } catch (e) {}
      } else {
        setMsg({ text: "Something went wrong — please try again.", kind: "err" });
      }
    } catch {
      setMsg({ text: "Network error — please try again.", kind: "err" });
    } finally {
      setBusy(false);
    }
  };

  // Hvis præcis 2 korte felter (text/email) → ét pe-form-row. Ellers ét felt pr. linje.
  const shortFields = fields.filter(
    (f) => f.type === "text" || f.type === "email"
  );
  const pairRow =
    fields.length === 2 && shortFields.length === 2 ? fields : null;

  const renderField = (f) => {
    const common = {
      id: "lf-" + f.name,
      name: f.name,
      value: values[f.name],
      onChange: set(f.name),
      required: !!f.required,
      placeholder: f.placeholder || "",
    };
    let input;
    if (f.type === "textarea") {
      input = <textarea className="pe-textarea" {...common} />;
    } else if (f.type === "select") {
      input = (
        <select className="pe-select" {...common}>
          <option value="" disabled>
            {f.placeholder || "Select…"}
          </option>
          {(f.options || []).map((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {optLabel}
              </option>
            );
          })}
        </select>
      );
    } else {
      input = <input className="pe-input" type={f.type} {...common} />;
    }
    return (
      <div className="pe-field" key={f.name}>
        <label htmlFor={"lf-" + f.name}>{f.label}</label>
        {input}
      </div>
    );
  };

  return (
    <form className="pe-form" onSubmit={onSubmit} noValidate>
      {pairRow ? (
        <div className="pe-form-row">{pairRow.map(renderField)}</div>
      ) : (
        fields.map(renderField)
      )}

      <button
        type="submit"
        className="pe-btn pe-btn-primary"
        disabled={busy}
        style={{ width: "100%" }}
      >
        {submitLabel}
      </button>

      {msg && (
        <p
          className={
            "pe-form-msg" +
            (msg.kind === "ok" ? " ok" : msg.kind === "err" ? " err" : "")
          }
        >
          {msg.text}
        </p>
      )}

      {note && (
        <p className="pe-hero-fine" style={{ textAlign: "center" }}>
          {note}
        </p>
      )}
    </form>
  );
}
