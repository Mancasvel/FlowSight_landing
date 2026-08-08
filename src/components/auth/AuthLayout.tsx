import type { ReactNode } from 'react';

type AuthLayoutProps = {
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthLayout({ children, footer }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-teal/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-category-design/10 rounded-full blur-3xl" />
            </div>

            {children}

            {footer}
        </div>
    );
}
