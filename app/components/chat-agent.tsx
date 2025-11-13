/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  PaperAirplaneIcon,
  PhotoIcon
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { enZA } from "date-fns/locale";
import { Loader2, MessageSquare, Sparkles } from "lucide-react";

type Language = "en" | "af";
type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
  language: Language;
  timestamp: number;
  meta?: Record<string, string>;
};

type RepairFormData = {
  vehicleMake: string;
  vehicleModel: string;
  year: string;
  damageDescription: string;
  damageType: string;
  insurance: string;
  photos: File[];
  preferredContact: string;
};

const quickPrompts: { label: string; message: string }[] = [
  { label: "Panel beating", message: "Can you tell me about your collision repair service?" },
  { label: "Insurance help", message: "Do you assist with insurance claims for accident repairs?" },
  { label: "Rust treatment", message: "My car has rust on the door sills. How can you help?" },
  { label: "Turnaround time", message: "How long does a typical repair and respray take?" }
];

const damageTypes = [
  "Collision impact",
  "Hail damage",
  "Parking lot dent",
  "Rust and corrosion",
  "Chassis or frame damage",
  "Paint fade or scratches"
];

const insuranceOptions = ["Not yet contacted", "Claim in progress", "Approved claim", "Paying privately"];

const contactPreferences = ["Phone call", "WhatsApp", "Email"];

const detectLanguage = (message: string): Language => {
  const afrikaansIndicators = [
    "goeie",
    "more",
    "middag",
    "dankie",
    "asseblief",
    "aanhaling",
    "kwotasie",
    "bespreking",
    "motor",
    "kleurwerk",
    "verf",
    "roes",
    "herstel",
    "praat jy afrikaans",
    "afrikan"
  ];

  return afrikaansIndicators.some((word) => message.toLowerCase().includes(word)) ? "af" : "en";
};

const translate = (key: string, language: Language, vars: Record<string, string> = {}) => {
  const strings: Record<string, Record<Language, string>> = {
    welcome: {
      en:
        "Hello! I'm Marli, your digital assistant from De Jongh’s Panelbeating Centre. How can I take care of your vehicle today?",
      af:
        "Hallo! Ek is Marli, jou digitale assistent van De Jongh’s Paneelklop Sentrum. Hoe kan ek vandag met jou voertuig help?"
    },
    promptEstimate: {
      en: "To prepare an estimate I'll need your vehicle make, model, year, and a short note about the damage.",
      af: "Om ’n skatting voor te berei, het ek jou voertuig se maak, model, jaar en ’n kort beskrywing van die skade nodig."
    },
    estimateFollowup: {
      en:
        "If you have photos handy, you can upload them when you book. Our estimators respond within one business day.",
      af:
        "As jy foto's byderhand het, kan jy dit oplaai wanneer jy bespreek. Ons skatteerders antwoord binne een werksdag."
    },
    bookingAssist: {
      en:
        "I can pencil you in. When would you like to drop off your vehicle, and what’s the best way for us to reach you?",
      af:
        "Ek kan jou bespreking vaspen. Wanneer wil jy die voertuig inbring, en wat is die beste manier om jou terug te kontak?"
    },
    insuranceAssist: {
      en:
        "We guide you through the insurance process—assessing the damage, preparing photo evidence, and liaising with assessors.",
      af:
        "Ons help jou deur die versekeringsproses—ons beoordeel die skade, berei fotobewyse voor en skakel saam met assessore."
    },
    turnaround: {
      en:
        "Typical collision repairs take 5-7 working days once approved. Resprays add 2-3 days for curing to ensure a flawless finish.",
      af:
        "Tipiese botsingsherstelwerk neem 5-7 werksdae sodra dit goedgekeur is. Spuitverfwerk voeg 2-3 dae by vir uitharding om ’n foutlose afwerking te verseker."
    },
    tips: {
      en:
        "After we’ve restored your vehicle, keep the finish protected: avoid harsh washes for 14 days, apply a pH-neutral shampoo, and consider a ceramic sealant every 12 months.",
      af:
        "Nadat ons jou voertuig herstel het, beskerm die afwerking: vermy sterk wasmiddels vir 14 dae, gebruik ’n pH-neutrale sjampoe en oorweeg ’n keramiese seël elke 12 maande."
    },
    rust: {
      en:
        "Our rust treatment removes corrosion, neutralises affected panels, and seals the metal before respraying. It’s ideal to address it early before it spreads.",
      af:
        "Ons roesbehandeling verwyder korrosie, neutraliseer die panele en verseël die metaal voordat ons herspuit. Dit is ideaal om dit vroegtydig te hanteer voordat dit versprei."
    },
    panel: {
      en:
        "Panel beating straightens and reshapes damaged bodywork with precision equipment. Our team blends traditional craft with modern chassis measurement tools.",
      af:
        "Paneelklopwerk reguit en hervorm beskadigde karrosserie met presisietoerusting. Ons span kombineer vakmanskap met moderne belyningsgereedskap."
    },
    spray: {
      en:
        "Our spray booth provides dust-free, temperature-controlled resprays. We colour match using manufacturer codes and spectrophotometer scans.",
      af:
        "Ons spuitkamer bied stofvrye, temperatuurbeheerde spuitwerk. Ons kleurpas met vervaardigerkodes en spektrofotometer-skanderings."
    },
    dent: {
      en:
        "We offer both paintless dent repair and traditional reshaping depending on the damage. Small dents are often sorted while you wait.",
      af:
        "Ons bied beide verflose duikherstel en tradisionele hervorming afhangend van die skade. Klein duike word dikwels uitgesorteer terwyl jy wag."
    },
    status: {
      en:
        "Pop me the job card number or registration and I’ll fetch the latest status from the workshop floor.",
      af:
        "Gee my die werkkaartnommer of registrasie en ek kry die nuutste status van die werkswinkelvloer af."
    },
    appointmentSummary: {
      en:
        "Thanks! I’ve captured the details: {{vehicle}} ({{year}}), damage noted as {{damageType}}. Expect a call via {{contact}} to confirm the booking slot.",
      af:
        "Dankie! Ek het die besonderhede aangeteken: {{vehicle}} ({{year}}), skade aangedui as {{damageType}}. Jy kan ’n oproep via {{contact}} verwag om die tyd te bevestig."
    },
    photoReminder: {
      en:
        "You can email supporting photos to estimates@dejonghs-panel.co.za or upload them via WhatsApp on 082 555 0198.",
      af:
        "Jy kan ondersteunende foto's stuur na estimates@dejonghs-panel.co.za of via WhatsApp oplaai na 082 555 0198."
    },
    fallback: {
      en:
        "I’ve noted that. Let me know if you’d like details on services, booking assistance, or post-repair care.",
      af:
        "Ek het daarvan kennis geneem. Laat weet my as jy besonderhede oor dienste, bespreking of naverzorging benodig."
    }
  };

  let template = strings[key]?.[language] ?? strings[key]?.en ?? "";
  Object.entries(vars).forEach(([variable, value]) => {
    template = template.replaceAll(`{{${variable}}}`, value);
  });
  return template;
};

const knowledgeSnippets: Record<string, { keywords: string[]; key: string }> = {
  panel: {
    keywords: ["panel", "collision", "accident", "bodywork", "panelbeating", "panel beating", "impact"],
    key: "panel"
  },
  spray: {
    keywords: ["spray", "paint", "respray", "resprays", "colour", "color", "touch up"],
    key: "spray"
  },
  dent: {
    keywords: ["dent", "ding", "hail", "pdr", "paintless"],
    key: "dent"
  },
  rust: {
    keywords: ["rust", "corrosion", "oxidation", "roes"],
    key: "rust"
  },
  insurance: {
    keywords: ["insurance", "claim", "insurer", "assessor"],
    key: "insuranceAssist"
  },
  turnaround: {
    keywords: ["long", "time", "turnaround", "how long", "duration", "ready"],
    key: "turnaround"
  },
  status: {
    keywords: ["status", "update", "progress", "job", "ready", "collection"],
    key: "status"
  },
  tips: {
    keywords: ["tips", "care", "maintenance", "aftercare", "protect"],
    key: "tips"
  },
  estimate: {
    keywords: ["estimate", "quote", "cost", "pricing", "price", "skatting", "aanhaling"],
    key: "promptEstimate"
  },
  booking: {
    keywords: ["book", "booking", "appointment", "schedule", "bespreking"],
    key: "bookingAssist"
  }
};

const summarizeForm = (data: RepairFormData, language: Language) =>
  translate("appointmentSummary", language, {
    vehicle: `${data.vehicleMake} ${data.vehicleModel}`.trim(),
    year: data.year || "Unknown year",
    damageType: data.damageType || data.damageDescription || "general damage",
    contact: data.preferredContact
  });

export function ChatAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [showEstimateForm, setShowEstimateForm] = useState(false);
  const [formData, setFormData] = useState<RepairFormData>({
    vehicleMake: "",
    vehicleModel: "",
    year: "",
    damageDescription: "",
    damageType: damageTypes[0],
    insurance: insuranceOptions[0],
    photos: [],
    preferredContact: contactPreferences[0]
  });

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: translate("welcome", "en"),
        language: "en",
        timestamp: Date.now()
      },
      {
        id: "welcome_af",
        role: "assistant",
        content:
          "PS: Ek help ook graag in Afrikaans. Vra net, en ek antwoord dadelik in jou taal.",
        language: "af",
        timestamp: Date.now()
      }
    ]);
  }, []);

  const handleSend = (value?: string) => {
    const text = (value ?? input).trim();
    if (!text) return;

    const language = detectLanguage(text) || preferredLanguage;
    setPreferredLanguage(language);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      language,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const reply = generateReply(text, language);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        language,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 600);
  };

  const generateReply = (message: string, language: Language) => {
    const lowerCase = message.toLowerCase();

    for (const snippet of Object.values(knowledgeSnippets)) {
      if (snippet.keywords.some((keyword) => lowerCase.includes(keyword))) {
        const primary = translate(snippet.key, language);
        if (snippet.key === "promptEstimate") {
          return `${primary}\n\n${translate("estimateFollowup", language)}\n${translate("photoReminder", language)}`;
        }
        if (snippet.key === "bookingAssist") {
          return `${primary}\n\n${translate("photoReminder", language)}`;
        }
        if (snippet.key === "insuranceAssist") {
          return `${primary}\n\nWe also coordinate with insurers like Santam, Hollard, and Mutual & Federal to smooth the process.`;
        }
        return primary;
      }
    }

    if (lowerCase.includes("afrikaans") && language === "en") {
      return "Sure thing! I’m fluent in Afrikaans. If you’d prefer the conversation in Afrikaans, let me know and ek help jou dadelik.";
    }

    if (lowerCase.includes("afrikaans") && language === "af") {
      return "Geen probleem nie! Ek antwoord graag in Afrikaans—vra gerus enigiets oor herstelwerk, versekering of naverzorging.";
    }

    if (lowerCase.includes("thank")) {
      return language === "af"
        ? "Plesier! Laat weet gerus as daar nog iets is waarmee ek kan help."
        : "It’s a pleasure! Let me know if there’s anything else I can arrange for you.";
    }

    return translate("fallback", language);
  };

  const handleFormSubmit = () => {
    const language = preferredLanguage;
    const assistantMessage: Message = {
      id: `assistant-form-${Date.now()}`,
      role: "assistant",
      content: `${summarizeForm(formData, language)}\n\n${translate("photoReminder", language)}`,
      language,
      timestamp: Date.now()
    };

    const userMessage: Message = {
      id: `user-form-${Date.now()}`,
      role: "user",
      content: `Estimate request submitted for ${formData.vehicleMake} ${formData.vehicleModel} (${formData.year}).`,
      language,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setShowEstimateForm(false);
    setFormData({
      vehicleMake: "",
      vehicleModel: "",
      year: "",
      damageDescription: "",
      damageType: damageTypes[0],
      insurance: insuranceOptions[0],
      photos: [],
      preferredContact: contactPreferences[0]
    });
  };

  const formattedMessages = useMemo(
    () =>
      messages.map((message) => ({
        ...message,
        displayTimestamp: format(message.timestamp, "EEE HH:mm", { locale: enZA })
      })),
    [messages]
  );

  return (
    <div className="rounded-3xl border border-brand-200 bg-white/90 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-brand-100 px-6 py-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">
            Digital assistant
          </p>
          <h2 className="mt-1 font-serif text-2xl text-brand-800">Marli from De Jongh’s</h2>
          <p className="text-sm text-brand-500">
            Friendly, trusted help in English & Afrikaans
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreferredLanguage("en")}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition",
                preferredLanguage === "en"
                  ? "border-brand-500 bg-brand-500 text-white shadow"
                  : "border-brand-200 text-brand-500 hover:border-brand-400"
              )}
            >
              English
            </button>
            <button
              onClick={() => setPreferredLanguage("af")}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition",
                preferredLanguage === "af"
                  ? "border-brand-500 bg-brand-500 text-white shadow"
                  : "border-brand-200 text-brand-500 hover:border-brand-400"
              )}
              >
              Afrikaans
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap gap-2 border-b border-brand-100 px-6 py-4">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => handleSend(prompt.message)}
              className="flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm text-brand-600 transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow"
            >
              <Sparkles className="h-4 w-4 text-brand-400" />
              {prompt.label}
            </button>
          ))}
          <button
            onClick={() => setShowEstimateForm(true)}
            className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-600"
          >
            <MessageSquare className="h-4 w-4" />
            Request estimate
          </button>
        </div>

        <div className="relative max-h-[520px] min-h-[320px] overflow-y-auto px-6 py-6">
          <AnimatePresence initial={false}>
            {formattedMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "mb-4 flex w-full",
                  message.role === "assistant" ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-4 shadow-sm",
                    message.role === "assistant"
                      ? "bg-brand-50 text-brand-800"
                      : "bg-brand-600 text-white"
                  )}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-xs",
                      message.role === "assistant" ? "text-brand-500" : "text-white/80"
                    )}
                  >
                    {message.displayTimestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex w-full justify-start"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-brand-50 px-5 py-4 text-sm text-brand-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                Marli is typing…
              </div>
            </motion.div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="space-y-3 border-t border-brand-100 bg-white/70 px-6 py-4"
        >
          <div className="flex items-center gap-3 rounded-full border border-brand-200 bg-white px-4 py-2 shadow-sm focus-within:border-brand-400">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={1}
              placeholder={
                preferredLanguage === "af"
                  ? "Tik jou vraag oor herstelwerk of skatting hier…"
                  : "Type any question about repairs, estimates, or updates…"
              }
              className="flex-1 resize-none bg-transparent py-2 text-sm text-brand-700 outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <Transition appear show={showEstimateForm} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowEstimateForm}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-brand-900/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all">
                  <Dialog.Title className="font-serif text-2xl text-brand-900">
                    Request a tailored estimate
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-brand-500">
                    Share a few details and Marli will relay them to our estimations team. We respond within one working day.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Vehicle make</label>
                      <input
                        value={formData.vehicleMake}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, vehicleMake: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                        placeholder="e.g. Toyota"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Vehicle model</label>
                      <input
                        value={formData.vehicleModel}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, vehicleModel: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                        placeholder="e.g. Hilux Double Cab"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Manufacture year</label>
                      <input
                        value={formData.year}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, year: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                        placeholder="e.g. 2021"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Damage type</label>
                      <select
                        value={formData.damageType}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, damageType: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                      >
                        {damageTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-brand-700">Describe the damage</label>
                      <textarea
                        value={formData.damageDescription}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, damageDescription: event.target.value }))
                        }
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                        placeholder="Where is the damage, and how did it happen?"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Insurance status</label>
                      <select
                        value={formData.insurance}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, insurance: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                      >
                        {insuranceOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-brand-700">Preferred contact</label>
                      <select
                        value={formData.preferredContact}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, preferredContact: event.target.value }))
                        }
                        className="mt-2 w-full rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800 outline-none focus:border-brand-500 focus:bg-white"
                      >
                        {contactPreferences.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-brand-700">
                        Upload supporting photos
                      </label>
                      <label className="mt-2 flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50 px-4 text-center text-sm text-brand-500 transition hover:border-brand-400 hover:bg-brand-100/50">
                        <PhotoIcon className="h-8 w-8 text-brand-400" />
                        <span>Attach up to 5 photos (optional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            const files = event.target.files
                              ? Array.from(event.target.files).slice(0, 5)
                              : [];
                            setFormData((prev) => ({ ...prev, photos: files }));
                          }}
                        />
                      </label>
                      {formData.photos.length > 0 && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-brand-500">
                          <CheckCircleIcon className="h-4 w-4 text-brand-400" />
                          Added {formData.photos.length} file(s)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEstimateForm(false)}
                      className="w-full rounded-xl border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-500 transition hover:border-brand-400 hover:text-brand-700 sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="w-full rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-brand-700 sm:w-auto"
                    >
                      Submit details
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
