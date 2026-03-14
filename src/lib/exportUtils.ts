import { secondsToHours, type WorkSession } from '@/lib/supabase/queries';
import { aggregateToMeta } from '@/lib/categories';

export function exportToCSV(
    sessions: WorkSession[],
    teamName: string,
    dateRange: string,
) {
    const rows: string[][] = [
        ['FlowSight Report', teamName, dateRange],
        [],
        ['Date', 'User ID', 'Duration (hours)', 'Summary', 'Categories'],
    ];

    for (const s of sessions) {
        const categories = s.category_breakdown
            ? Object.entries(s.category_breakdown).map(([k, v]) => `${k}: ${secondsToHours(v as number)}h`).join('; ')
            : '';

        rows.push([
            s.session_date,
            s.user_id,
            String(secondsToHours(s.duration_seconds)),
            s.summary || '',
            categories,
        ]);
    }

    // Summary section
    const totalSeconds = sessions.reduce((sum, s) => sum + s.duration_seconds, 0);
    const categoryTotals = sessions.reduce<Record<string, number>>((acc, s) => {
        if (s.category_breakdown) {
            for (const [k, v] of Object.entries(s.category_breakdown)) {
                acc[k] = (acc[k] || 0) + (v as number);
            }
        }
        return acc;
    }, {});
    const metaTotals = aggregateToMeta(categoryTotals);

    rows.push([], ['Summary'], ['Total Hours', String(secondsToHours(totalSeconds))]);
    rows.push(['Category Breakdown:']);
    for (const [cat, sec] of Object.entries(metaTotals)) {
        rows.push(['', cat, `${secondsToHours(sec)}h`]);
    }

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    downloadFile(csvContent, `flowsight-report-${dateRange}.csv`, 'text/csv');
}

export function exportToPrintPDF() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; }
            .no-print { display: none !important; }
            @page { margin: 1cm; }
        }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => style.remove(), 1000);
}

function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
