import React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from './Accordion';
import { cn } from '~/lib/utils';
import ScoreBadge from './ScoreBadge';

// Helper Components

interface CategoryHeaderProps {
    title: string;
    categoryScore: number;
}

const CategoryHeader = ({ title, categoryScore }: CategoryHeaderProps) => {
    return (
        <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="ml-4">
                <ScoreBadge score={categoryScore} />
            </div>
        </div>
    );
};

interface Tip {
    type: "good" | "improve";
    tip: string;
    explanation: string;
}

interface CategoryContentProps {
    tips: Tip[];
}

const CategoryContent = ({ tips }: CategoryContentProps) => {
    return (
        <div className="space-y-6">
            {/* Two Column Grid for Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            alt={tip.type === "good" ? "Good" : "Warning"}
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-700 font-medium">{tip.tip}</p>
                    </div>
                ))}
            </div>

            {/* Explanation Boxes */}
            <div className="space-y-3">
                {tips.map((tip, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            "p-4 rounded-lg border-l-4",
                            tip.type === "good" 
                                ? "bg-green-50 border-green-400 text-green-800" 
                                : "bg-yellow-50 border-yellow-400 text-yellow-800"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <img 
                                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt={tip.type === "good" ? "Good" : "Warning"}
                                className="w-4 h-4 mt-0.5 flex-shrink-0"
                            />
                            <div>
                                <p className="text-sm font-medium mb-1">{tip.tip}</p>
                                <p className="text-sm opacity-90">{tip.explanation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Details Component

interface DetailsProps {
    feedback: Feedback;
}

const Details = ({ feedback }: DetailsProps) => {
    const categories = [
        {
            id: 'tone-style',
            title: 'Tone & Style',
            score: feedback.toneAndStyle.score,
            tips: feedback.toneAndStyle.tips || []
        },
        {
            id: 'content',
            title: 'Content',
            score: feedback.content.score,
            tips: feedback.content.tips || []
        },
        {
            id: 'structure',
            title: 'Structure',
            score: feedback.structure.score,
            tips: feedback.structure.tips || []
        },
        {
            id: 'skills',
            title: 'Skills',
            score: feedback.skills.score,
            tips: feedback.skills.tips || []
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Detailed Feedback</h2>
                <p className="text-gray-600">Explore specific areas for improvement and what you're doing well.</p>
            </div>

            <Accordion allowMultiple={true} className="space-y-4">
                {categories.map((category) => (
                    <AccordionItem key={category.id} id={category.id} className="border border-gray-200 rounded-lg">
                        <AccordionHeader 
                            itemId={category.id}
                            className="hover:bg-gray-50 transition-colors duration-200"
                        >
                            <CategoryHeader 
                                title={category.title} 
                                categoryScore={category.score} 
                            />
                        </AccordionHeader>
                        <AccordionContent itemId={category.id}>
                            <CategoryContent tips={category.tips} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
