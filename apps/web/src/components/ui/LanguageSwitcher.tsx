'use client';

/**
 * LanguageSwitcher — Arabic only, no switching needed.
 * Returns null since only one language (ar) is supported.
 */
export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    void compact; // unused when only one locale exists
    return null;
}
