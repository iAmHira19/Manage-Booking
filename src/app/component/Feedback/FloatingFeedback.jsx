"use client";
import React, { useState } from "react";
import { Modal, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { FaRegCommentDots } from "react-icons/fa";

const FloatingFeedback = () => {
  const [open, setOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Floating tab on right side (hidden on auth pages to prevent form interference) */}
      {!(pathname?.startsWith("/auth")) && (
        <button
          type="button"
          aria-label="Feedback"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] bg-blue-900 text-white py-3 px-2 rounded-l-md shadow-lg hover:bg-blue-800"
          style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
        >
          <span className="font-gotham text-sm leading-none [writing-mode:vertical-rl] rotate-180 flex items-center gap-1">
            <FaRegCommentDots className="inline" />
            Feedback
          </span>
        </button>
      )}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1024}
        centered
        bodyStyle={{ padding: 24 }}
      >
        <div className="grid grid-cols-3 gap-6 items-stretch">
          {/* Column 1 */}
          <div className="flex flex-col items-center justify-center text-center gap-3 px-4 h-full min-h-[220px]">
            <div className="text-5xl text-blue-900">💬</div>
            <h3 className="text-2xl font-gotham text-blue-900">Leave website<br/>feedback</h3>
            <p className="text-slate-600 text-sm font-gotham">Your opinion is important to us. Help us improve your online experience.</p>
            <button
              type="button"
              className="border border-slate-400 rounded px-4 py-2 font-gotham hover:bg-slate-50 mt-auto"
              onClick={() => setRatingOpen(true)}
            >
              Submit feedback
            </button>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col items-center justify-center text-center gap-3 px-4 h-full min-h-[220px] md:border-l md:border-slate-200">
            <div className="text-5xl text-blue-900">🗨️</div>
            <h3 className="text-2xl font-gotham text-blue-900">Get in <span className="underline">touch</span></h3>
            <p className="text-slate-600 text-sm font-gotham">Need answers? Here are the most convenient ways to contact us.</p>
            <button
              type="button"
              className="border border-slate-400 rounded px-4 py-2 font-gotham hover:bg-slate-50 mt-auto"
              onClick={() => { setOpen(false); setTimeout(() => router.push("/contact_us"), 0); }}
            >
              Contact us
            </button>
          </div>
          {/* Column 3 */}
          <div className="flex flex-col items-center justify-center text-center gap-3 px-4 h-full min-h-[220px] md:border-l md:border-slate-200">
            <div className="text-5xl text-blue-900">📄</div>
            <h3 className="text-2xl font-gotham text-blue-900">Raise a <span className="underline">concern</span></h3>
            <p className="text-slate-600 text-sm font-gotham">If you&apos;ve had a less than satisfying experience, we&apos;d like to hear from you.</p>
            <button
              type="button"
              className="border border-slate-400 rounded px-4 py-2 font-gotham hover:bg-slate-50 mt-auto"
              onClick={() => { setOpen(false); setTimeout(() => router.push("/contact_us"), 0); }}
            >
              Submit a complaint
            </button>
          </div>
        </div>
      </Modal>

      {/* Satisfaction rating popup */}
      <Modal
        open={ratingOpen}
        onCancel={() => setRatingOpen(false)}
        footer={null}
        centered
        width={560}
        bodyStyle={{ padding: 24, textAlign: "center" }}
      >
        <h3 className="text-2xl md:text-3xl font-gotham text-blue-900 mb-6">How satisfied were you with your website experience?</h3>
        <div className="flex items-center justify-center gap-6 md:gap-8">
          {[
            { val: 5, label: "Very satisfied", color: "text-green-600" },
            { val: 4, label: "Satisfied", color: "text-green-500" },
            { val: 3, label: "Neutral", color: "text-yellow-500" },
            { val: 2, label: "Dissatisfied", color: "text-orange-500" },
            { val: 1, label: "Very dissatisfied", color: "text-red-600" },
          ].map((o) => (
            <button
              key={o.val}
              type="button"
              aria-label={o.label}
              className={`text-5xl md:text-6xl ${o.color} hover:opacity-80`}
              onClick={() => {
                setRatingOpen(false);
                setOpen(false);
                message.success("Thanks for your feedback!");
              }}
            >
              {o.val >= 5 ? "😁" : o.val === 4 ? "🙂" : o.val === 3 ? "😐" : o.val === 2 ? "🙁" : "☹️"}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default FloatingFeedback;
