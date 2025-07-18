import { cn } from '~/lib/utils';

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
    let badgeClasses = '';
    let label = '';

    if (score >= 80) {
        badgeClasses = 'bg-green-100 text-green-600 border-green-200';
        label = 'Strong';
    } else if (score >= 50) {
        badgeClasses = 'bg-yellow-100 text-yellow-600 border-yellow-200';
        label = 'Needs Improvement';
    } else {
        badgeClasses = 'bg-red-100 text-red-600 border-red-200';
        label = 'Needs Work';
    }

    return (
        <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", badgeClasses)}>
            <p>{label}</p>
        </div>
    );
};

export default ScoreBadge;
