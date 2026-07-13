"use client";

import { useState } from "react";

// アカウント不要の「役に立った/入れなかった」フィードバック。IPハッシュでの簡易連投防止は
// サーバー側(/api/feedback)で行うため、ここではローカルstateで多重送信だけ防ぐ。
export default function FeedbackButtons({
  shopId,
  shopName,
  initialHelpful = 0,
  initialNotHelpful = 0,
}: {
  shopId: string;
  shopName: string;
  initialHelpful?: number;
  initialNotHelpful?: number;
}) {
  const [helpful, setHelpful] = useState(initialHelpful);
  const [notHelpful, setNotHelpful] = useState(initialNotHelpful);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function vote(isHelpful: boolean) {
    if (voted || busy) return;
    setBusy(true);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, shopName, helpful: isHelpful }),
    });
    setBusy(false);
    if (res.ok) {
      setVoted(true);
      if (isHelpful) setHelpful((v) => v + 1);
      else setNotHelpful((v) => v + 1);
    } else if (res.status === 409) {
      setVoted(true);
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <span className="text-[10px] text-neutral-400">実際に入れましたか？</span>
      <button
        type="button"
        disabled={voted || busy}
        onClick={() => vote(true)}
        className="rounded-full border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 hover:border-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        👍 {helpful}
      </button>
      <button
        type="button"
        disabled={voted || busy}
        onClick={() => vote(false)}
        className="rounded-full border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-600 hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        👎 {notHelpful}
      </button>
    </div>
  );
}
