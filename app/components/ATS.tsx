import React from 'react';

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
    // Determine background gradient and icon based on score
    let gradientClasses = '';
    let iconSrc = '';
    let iconAlt = '';

    if (score >= 80) {
        gradientClasses = 'from-green-50 to-green-100';
        iconSrc = '/icons/ats-good.svg';
        iconAlt = 'Good ATS Score';
    } else if (score >= 50) {
        gradientClasses = 'from-yellow-50 to-yellow-100';
        iconSrc = '/icons/ats-warning.svg';
        iconAlt = 'Warning ATS Score';
    } else {
        gradientClasses = 'from-red-50 to-red-100';
        iconSrc = '/icons/ats-bad.svg';
        iconAlt = 'Poor ATS Score';
    }

    return (
        <div className={`bg-gradient-to-br ${gradientClasses} rounded-2xl shadow-lg p-6 text-gray-800`}>
            {/* Top Section with Icon and Score */}
            <div className="flex items-center gap-4 mb-6">
                <img 
                    src={iconSrc} 
                    alt={iconAlt} 
                    className="w-12 h-12"
                />
                <div>
                    <h2 className="text-2xl font-bold">ATS Score</h2>
                    <p className="text-3xl font-bold">{score}/100</p>
                </div>
            </div>

            {/* Description Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">How ATS-Friendly is Your Resume?</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Applicant Tracking Systems (ATS) scan resumes for relevant keywords and formatting. 
                    A higher score means your resume is more likely to pass through these systems and reach human recruiters.
                </p>

                {/* Suggestions List */}
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <img 
                                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt={suggestion.type === "good" ? "Good" : "Warning"}
                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                            />
                            <p className="text-sm text-gray-700">
                                {suggestion.tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Encouraging Closing Line */}
            <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                    {score >= 80 
                        ? "Great job! Your resume is well-optimized for ATS systems."
                        : score >= 50
                        ? "You're on the right track! Keep improving to boost your chances."
                        : "Don't worry! With some improvements, your resume can be ATS-friendly too."
                    }
                </p>
            </div>
        </div>
    );
};

export default ATS;
