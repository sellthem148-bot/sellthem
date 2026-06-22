'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ReviewForm } from '@/components/ReviewForm';
import { formatPrice } from '@/lib/format';

type Convo = {
  id: string;
  iAmSeller: boolean;
  otherName: string;
  otherAvatar: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  lastMessage: string;
};

type Msg = {
  id: string;
  fromMe: boolean;
  kind: string;
  text: string;
  amount: number | null;
  status: string | null;
  at: string;
};

type Detail = {
  iAmSeller: boolean;
  other: { name: string; avatar: string };
  listing: { id: string; title: string; image: string; price: number };
  messages: Msg[];
};

export default function MessagesPage() {
  const t = useTranslations('messages');
  const locale = useLocale();

  const [me, setMe] = useState<{ id: string } | null | undefined>(undefined);
  const [convos, setConvos] = useState<Convo[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [draft, setDraft] = useState('');
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [showReview, setShowReview] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Auth + liste des conversations
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        setMe(d.user);
        if (d.user) loadConvos();
      })
      .catch(() => setMe(null));
    // sélection initiale via ?c=
    const c = new URLSearchParams(window.location.search).get('c');
    if (c) setActiveId(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadConvos() {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => setConvos(d.conversations || []))
      .catch(() => {});
  }

  const loadDetail = useCallback((id: string) => {
    fetch(`/api/conversations/${id}/messages`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setDetail(d);
      })
      .catch(() => {});
  }, []);

  // Charge + rafraîchit la conversation active
  useEffect(() => {
    if (!activeId) return;
    loadDetail(activeId);
    const i = setInterval(() => loadDetail(activeId), 4000);
    return () => clearInterval(i);
  }, [activeId, loadDetail]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [detail?.messages.length]);

  async function sendText() {
    if (!draft.trim() || !activeId) return;
    const text = draft.trim();
    setDraft('');
    await fetch(`/api/conversations/${activeId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    loadDetail(activeId);
    loadConvos();
  }

  async function sendOffer() {
    const amount = Number(offerAmount);
    if (!amount || amount <= 0 || !activeId) return;
    setOfferOpen(false);
    setOfferAmount('');
    await fetch(`/api/conversations/${activeId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'OFFER', amount })
    });
    loadDetail(activeId);
    loadConvos();
  }

  async function actOffer(messageId: string, action: 'accept' | 'decline') {
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId, action })
    });
    if (activeId) loadDetail(activeId);
  }

  // --- États de page ---
  if (me === undefined) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-gray-400">…</div>;
  }
  if (me === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-4xl">💬</div>
        <p className="mt-4 text-sm text-gray-600">{t('loginRequired')}</p>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          {t('goLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900">{t('title')}</h1>

      {convos.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-4xl">💬</p>
          <p className="mt-3 text-sm text-gray-500">{t('empty')}</p>
        </div>
      ) : (
        <div className="grid h-[70vh] overflow-hidden rounded-2xl border border-gray-100 shadow-card md:grid-cols-[280px_1fr]">
          {/* Liste */}
          <ul className="overflow-y-auto border-e border-gray-100">
            {convos.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-gray-50 p-3 text-start transition hover:bg-gray-50 ${
                    c.id === activeId ? 'bg-brand-50' : ''
                  }`}
                >
                  <Image src={c.otherAvatar} alt={c.otherName} width={40} height={40} className="rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{c.otherName}</p>
                    <p className="truncate text-xs text-gray-500">{c.lastMessage}</p>
                  </div>
                  {c.listingImage && (
                    <Image src={c.listingImage} alt="" width={36} height={36} className="rounded-md object-cover" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Conversation active */}
          {detail && activeId ? (
            <div className="flex flex-col">
              {/* en-tête article */}
              <div className="border-b border-gray-100">
                <div className="flex items-center gap-3 p-3">
                  <Link href={`/items/${detail.listing.id}`} className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-80">
                    <Image src={detail.listing.image} alt="" width={36} height={36} className="rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{detail.listing.title}</p>
                      <p className="text-xs font-bold text-brand-700">{formatPrice(detail.listing.price, locale)}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowReview((s) => !s)}
                    className="shrink-0 text-xs font-semibold text-brand-600 hover:underline"
                  >
                    {t('leaveReview')}
                  </button>
                </div>
                {showReview && (
                  <div className="px-3 pb-3">
                    <ReviewForm conversationId={activeId} onDone={() => setShowReview(false)} />
                  </div>
                )}
              </div>

              {/* messages */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
                {detail.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                    {m.kind === 'OFFER' ? (
                      <div className={`max-w-[80%] rounded-2xl border p-3 ${m.fromMe ? 'border-brand-200 bg-white' : 'border-gray-200 bg-white'}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('offerTitle')}</p>
                        <p className="text-lg font-extrabold text-brand-700">{formatPrice(m.amount || 0, locale)}</p>
                        {m.status === 'PENDING' && !m.fromMe && (
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => actOffer(m.id, 'accept')} className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600">
                              {t('accept')}
                            </button>
                            <button onClick={() => actOffer(m.id, 'decline')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-gray-300">
                              {t('decline')}
                            </button>
                          </div>
                        )}
                        {m.status === 'PENDING' && m.fromMe && (
                          <p className="mt-1 text-xs text-gray-400">{t('statusPending')}</p>
                        )}
                        {m.status === 'ACCEPTED' && <p className="mt-1 text-xs font-semibold text-brand-600">{t('statusAccepted')}</p>}
                        {m.status === 'DECLINED' && <p className="mt-1 text-xs text-gray-400">{t('statusDeclined')}</p>}
                      </div>
                    ) : (
                      <span className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${m.fromMe ? 'bg-brand-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                        {m.text}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              {/* zone de saisie */}
              {offerOpen ? (
                <div className="flex items-center gap-2 border-t border-gray-100 p-3">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
                    <input
                      type="number"
                      min={1}
                      autoFocus
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={t('offerAmount')}
                      className="w-full rounded-full border border-gray-200 py-2.5 ps-8 pe-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  </div>
                  <button onClick={sendOffer} className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                    {t('sendOffer')}
                  </button>
                  <button onClick={() => setOfferOpen(false)} className="rounded-full px-2 text-gray-400 hover:text-gray-600">✕</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 border-t border-gray-100 p-3">
                  <button
                    type="button"
                    onClick={() => setOfferOpen(true)}
                    title={t('makeOffer')}
                    className="shrink-0 rounded-full border border-brand-200 px-3 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
                  >
                    💰
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendText()}
                    placeholder={t('placeholder')}
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                  <button onClick={sendText} className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
                    {t('send')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden place-items-center md:grid">
              <p className="text-sm text-gray-400">{t('selectConversation')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
