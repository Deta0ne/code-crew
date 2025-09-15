import React from 'react';
import { Briefcase, GraduationCap, Code, BookOpen, Lightbulb, Trophy, FileText } from 'lucide-react';

export const getProjectTypeIcon = (type: string) => {
    switch (type) {
        case 'learning':
            return <GraduationCap className="w-5 h-5" />;
        case 'portfolio':
            return <Briefcase className="w-5 h-5" />;
        case 'open_source':
            return <Code className="w-5 h-5" />;
        case 'tutorial':
            return <BookOpen className="w-5 h-5" />;
        case 'hackathon':
            return <Trophy className="w-5 h-5" />;
        case 'research':
            return <FileText className="w-5 h-5" />;
        default:
            return <Lightbulb className="w-5 h-5" />;
    }
};

export const getProjectTypeLabel = (type: string) => {
    switch (type) {
        case 'learning':
            return 'Learning Project';
        case 'portfolio':
            return 'Portfolio Project';
        case 'open_source':
            return 'Open Source Project';
        case 'tutorial':
            return 'Tutorial Project';
        case 'hackathon':
            return 'Hackathon Project';
        case 'research':
            return 'Research Project';
        default:
            return 'Unknown Project';
    }
};

export const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'easy':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'advanced':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
