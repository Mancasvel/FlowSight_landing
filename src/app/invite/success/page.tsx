import { CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';

export default function InviteSuccessPage() {
    return (
        <div className="min-h-screen bg-dashboard-bg flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-teal/20 rounded-full blur-3xl" />
            </div>
            <div className="dashboard-card p-8 max-w-md w-full relative z-10 text-center">
                <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-accent-green" size={48} />
                </div>
                <h1 className="text-2xl font-bold text-dashboard-text mb-2">
                    You&apos;re In!
                </h1>
                <p className="text-dashboard-muted mb-8">
                    You&apos;ve successfully joined the team. Download the FlowSight desktop app to start tracking your productivity.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/#download-windows"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-blue to-primary-teal text-white font-semibold rounded-lg hover:opacity-90"
                    >
                        <Download size={20} />
                        Download for Windows
                    </Link>
                    <Link
                        href="/#download-mac"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-dashboard-card border border-dashboard-border text-dashboard-text font-medium rounded-lg hover:bg-dashboard-border/50"
                    >
                        <Download size={20} />
                        Download for macOS
                    </Link>
                </div>

                <p className="text-sm text-dashboard-muted mt-8">
                    Already have the app?{' '}
                    <Link href="/" className="text-primary-blue hover:underline">
                        Go to Homepage
                    </Link>
                </p>
            </div>
        </div>
    );
}
