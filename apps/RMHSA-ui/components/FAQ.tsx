"use client";

import { useState } from "react";
import { faqSchema, type FaqItem } from "@/lib/seo";

interface FAQProps {
  faqs: FaqItem[];
  title?: string;
}

const FAQ = ({ faqs, title = "Frequently Asked Questions" }: FAQProps) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
        }}
      />
      <div className="faq-section py-8">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button
                className="w-full text-left flex justify-between items-center py-2 hover:text-primary transition-colors"
                onClick={() => toggleItem(index)}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span
                  className={`transform transition-transform ${
                    openItems[index] ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              {openItems[index] && (
                <div className="mt-2 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
