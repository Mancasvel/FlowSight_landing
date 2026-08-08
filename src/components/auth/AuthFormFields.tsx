import type { InputHTMLAttributes } from 'react';

export const authInputClassName =
    'w-full px-4 py-3 bg-dashboard-bg border border-dashboard-border rounded-lg text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-primary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed';

type AuthFieldProps = {
    id: string;
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({ id, label, className, ...props }: AuthFieldProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-dashboard-text">
                {label}
            </label>
            <input
                id={id}
                className={className ? `${authInputClassName} ${className}` : authInputClassName}
                {...props}
            />
        </div>
    );
}

export function AuthDivider({ label = 'or' }: { label?: string }) {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashboard-border" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dashboard-card text-dashboard-muted">{label}</span>
            </div>
        </div>
    );
}

export function AuthErrorBanner({ message }: { message: string }) {
    if (!message) return null;

    return (
        <div className="p-3 bg-accent-red/20 border border-accent-red/30 rounded-lg text-accent-red text-sm">
            {message}
        </div>
    );
}

export function AuthSuccessBanner({ message }: { message: string }) {
    if (!message) return null;

    return (
        <div className="p-3 bg-accent-green/20 border border-accent-green/30 rounded-lg text-accent-green text-sm">
            {message}
        </div>
    );
}
