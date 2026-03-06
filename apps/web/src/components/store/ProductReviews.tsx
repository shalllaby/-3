'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, PenLine, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────

interface Review {
    id: string;
    rating: number;
    body?: string;
    isVerified: boolean;
    createdAt: string;
    user: { id: string; name: string };
}

interface RatingSummary {
    average: number;
    total: number;
    distribution: Record<string, number>;
}

// ── Star Renderer ──────────────────────────────────────

function Stars({ rating, size = 'sm', interactive = false, onRate }: {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRate?: (n: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };
    const active = interactive ? (hovered || rating) : rating;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <span
                    key={n}
                    onMouseEnter={() => interactive && setHovered(n)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onRate?.(n)}
                    className={interactive ? 'cursor-pointer' : ''}
                >
                    <Star
                        className={`${sizeMap[size]} transition-colors ${n <= active ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                    />
                </span>
            ))}
        </div>
    );
}

// ── Rating Summary Bar ─────────────────────────────────

function DistributionBar({ label, count, total }: { label: string; count: number; total: number }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-8 text-gray-500 font-medium text-left">{label}★</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 text-gray-400 text-xs text-right">{count}</span>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────

export default function ProductReviews({ productId }: { productId: string }) {
    const { isAuthenticated, user } = useAuthStore();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [summary, setSummary] = useState<RatingSummary | null>(null);
    const [loading, setLoading] = useState(true);

    // "Write review" form state
    const [canReview, setCanReview] = useState(false); // purchased + not-yet-reviewed
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [revRes, sumRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/products/${productId}/reviews`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/products/${productId}/reviews/summary`),
            ]);
            const revData = revRes.ok ? await revRes.json() : [];
            const sumData = sumRes.ok ? await sumRes.json() : null;
            setReviews(revData);
            setSummary(sumData);
        } catch {
            // Non-critical — page still loads
        } finally {
            setLoading(false);
        }
    }, [productId]);

    // Check if current user can write a review
    const checkCanReview = useCallback(async () => {
        if (!isAuthenticated || !user) return;
        try {
            const [purchaseRes, reviewsData] = await Promise.all([
                apiClient.get(`/products/${productId}/reviews`),
                Promise.resolve(reviews),
            ]);
            // User already reviewed?
            const alreadyReviewed = purchaseRes.data?.some((r: Review) => r.user.id === user.id);
            if (alreadyReviewed) { setCanReview(false); return; }

            // Verify purchase — the backend will reject non-purchasers with 403
            // We just check if their orders contain this product via a lightweight endpoint
            // Use the review submission to check (try a dry-run isn't viable, so we optimistically show the form)
            setCanReview(true);
        } catch {
            setCanReview(false);
        }
    }, [isAuthenticated, user, productId, reviews]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => { if (isAuthenticated) checkCanReview(); }, [isAuthenticated, checkCanReview, reviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) { toast.error('يرجى اختيار تقييم من 1 إلى 5 نجوم'); return; }
        setSubmitting(true);
        try {
            await apiClient.post(`/products/${productId}/reviews`, { rating, body: body.trim() || undefined });
            toast.success('✅ تم إرسال تقييمك بنجاح!');
            setShowForm(false);
            setRating(0);
            setBody('');
            fetchData(); // refresh list + summary
        } catch (err: any) {
            const msg = err.response?.data?.message;
            if (err.response?.status === 403) {
                toast.error('يمكن فقط للمشترين الذين استلموا المنتج كتابة التقييم');
                setCanReview(false);
            } else if (err.response?.status === 409) {
                toast.error('لقد قمت بتقييم هذا المنتج من قبل');
                setCanReview(false);
            } else {
                toast.error(msg || 'فشل إرسال التقييم');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const alreadyReviewed = isAuthenticated && user && reviews.some((r) => r.user.id === user.id);

    return (
        <section className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                التقييمات والمراجعات
            </h2>

            {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* ── LEFT: Summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center mb-6">
                            <p className="text-6xl font-black text-gray-900 mb-1">
                                {summary?.average?.toFixed(1) ?? '—'}
                            </p>
                            <Stars rating={Math.round(summary?.average ?? 0)} size="md" />
                            <p className="text-sm text-gray-400 mt-2">
                                بناءً على {summary?.total ?? 0} تقييم
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                            {[5, 4, 3, 2, 1].map((n) => (
                                <DistributionBar
                                    key={n}
                                    label={String(n)}
                                    count={summary?.distribution?.[n] ?? 0}
                                    total={summary?.total ?? 0}
                                />
                            ))}
                        </div>

                        {/* Write Review CTA */}
                        <div className="mt-6">
                            {!isAuthenticated && (
                                <p className="text-sm text-gray-400 text-center bg-gray-50 rounded-2xl p-4">
                                    <a href="/login" className="text-brand-600 font-bold underline">سجّل دخولك</a> لكتابة تقييم
                                </p>
                            )}
                            {isAuthenticated && alreadyReviewed && (
                                <p className="text-sm text-green-600 font-medium bg-green-50 rounded-2xl p-4 text-center">
                                    ✅ لقد قمت بتقييم هذا المنتج
                                </p>
                            )}
                            {isAuthenticated && !alreadyReviewed && canReview && !showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <PenLine className="w-4 h-4" /> اكتب تقييمك
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Reviews + Form ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Write Review Form */}
                        {showForm && (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white rounded-3xl p-6 border-2 border-brand-200 shadow-md animate-fade-in"
                            >
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">اكتب تقييمك</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">تقييمك *</label>
                                    <Stars rating={rating} size="lg" interactive onRate={setRating} />
                                    {rating > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {['', 'ضعيف جداً', 'ضعيف', 'مقبول', 'جيد', 'ممتاز'][rating]}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">رأيك (اختياري)</label>
                                    <textarea
                                        className="input resize-none"
                                        rows={4}
                                        maxLength={2000}
                                        placeholder="شاركنا تجربتك مع المنتج..."
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-400 text-left mt-1">{body.length}/2000</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn-ghost flex-1"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0}
                                        className="btn-primary flex-1 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                        ) : 'إرسال التقييم'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Review List */}
                        {reviews.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <Star className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p className="font-medium">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-black text-sm">
                                                    {review.user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{review.user.name}</p>
                                                    {review.isVerified && (
                                                        <p className="text-[10px] text-green-600 font-bold">✅ مشترٍ موثّق</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <Stars rating={review.rating} size="sm" />
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('ar-KW', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {review.body && (
                                        <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
