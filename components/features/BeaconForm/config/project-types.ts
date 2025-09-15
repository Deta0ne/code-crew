import { BookOpen, Lightbulb, Code2, Trophy, GraduationCap, GitBranch } from 'lucide-react';
import { ProjectType } from '../types';

interface ProjectTypeOption {
    type: ProjectType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    benefits: string[];
  }
  
export const projectTypes: ProjectTypeOption[] = [
    {
        type: 'learning',
        title: 'Learning Project',
        description: 'Build skills together through collaborative learning',
        icon: GraduationCap,
        benefits: ['Skill Development', 'Peer Learning', 'Guided Progress'],
    },
    {
        type: 'portfolio',
        title: 'Portfolio Project',
        description: 'Create impressive work to showcase your expertise',
        icon: Code2,
        benefits: ['Career Growth', 'Showcase Skills', 'Professional Network'],
    },
    {
        type: 'open_source',
        title: 'Open Source',
        description: 'Contribute to the community with impactful solutions',
        icon: GitBranch,
        benefits: ['Community Impact', 'Public Recognition', 'Long-term Value'],
    },
    {
        type: 'hackathon',
        title: 'Hackathon',
        description: 'Fast-paced innovation with competitive spirit',
        icon: Trophy,
        benefits: ['Quick Results', 'Competition', 'Innovation Sprint'],
    },
    {
        type: 'tutorial',
        title: 'Tutorial',
        description: 'Share knowledge by creating educational content',
        icon: BookOpen,
        benefits: ['Knowledge Sharing', 'Teaching Skills', 'Content Creation'],
    },
    {
        type: 'research',
        title: 'Research',
        description: 'Explore new frontiers and push boundaries',
        icon: Lightbulb,
        benefits: ['Innovation', 'Discovery', 'Academic Impact'],
    },
  ];