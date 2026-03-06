'use client';

/**
 * SearchBar — أنهار الديرة
 * Live search with 300ms debounce, floating dropdown results, ESC to close.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Package, Loader2 } from 'lucide-react';
import { formatKwd } from '@/lib/constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface SearchResult {
    id: string;
    nameAr: string;
    nameEn: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    category?: { nameAr: string };
}

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ESC to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setIsOpen(false); setShowInput(false); setQuery(''); }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const search = useCallback(async (q: string) => {
        if (q.trim().length < 2) { setResults([]); setIsOpen(false); return; }
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/products?search=${encodeURIComponent(q)}&limit=6&isActive=true`);
            if (!res.ok) throw new Error();
            const json = await res.json();
            const items: SearchResult[] = json.data ?? json ?? [];
            setResults(items.slice(0, 6));
            setIsOpen(items.length > 0);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(val), 300);
    };

    const handleSelect = (id: string) => {
        setIsOpen(false);
        setShowInput(false);
        setQuery('');
        router.push(`/products/${id}`);
    };

    const handleIconClick = () => {
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Toggle or full input bar */}
            {showInput ? (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-48 sm:w-64 transition-all">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="ابحث عن منتج..."
                        dir="rtl"
                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                    {isLoading
                        ? <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />
                        : query && <button onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                    }
                </div>
            ) : (
                <button
                    aria-label="بحث"
                    onClick={handleIconClick}
                    className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                    <Search className="w-4 h-4" />
                </button>
            )}

            {/* Dropdown results */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full start-0 mt-2 w-64 sm:w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60 z-50 overflow-hidden animate-fade-in">
                    <div className="p-2">
                        {results.map((product) => {
                            const price = product.discountPrice ?? product.price;
                            const img = product.images?.[0];
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => handleSelect(product.id)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-50 transition-colors text-right"
                                >
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {img ? (
                                            <Image src={img} alt={product.nameAr} width={40} height={40} unoptimized className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{product.nameAr}</p>
                                        {product.category && (
                                            <p className="text-[10px] text-brand-500 font-medium truncate">{product.category.nameAr}</p>
                                        )}
                                    </div>
                                    <span className="text-xs font-black text-brand-600 flex-shrink-0">
                                        {formatKwd(price)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="border-t border-gray-50 p-2">
                        <button
                            onClick={() => { router.push(`/products?search=${encodeURIComponent(query)}`); setIsOpen(false); }}
                            className="w-full text-center text-xs font-bold text-brand-500 hover:text-brand-700 py-1.5 transition-colors"
                        >
                            عرض جميع النتائج ←
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
