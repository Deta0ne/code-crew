'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    User,
    MapPin,
    Github,
    Linkedin,
    Globe,
    Edit3,
    Anchor,
    Compass,
    Ship,
    Star,
    Calendar,
    CheckCircle,
    XCircle,
} from 'lucide-react';

// Mock data - your actual data will come from useUser hook
const mockUserProfile = {
    id: '1',
    username: 'captain_dev',
    full_name: 'Ahmet Yılmaz',
    bio: 'Full-stack developer passionate about creating scalable web applications. Love working with React, Node.js, and modern web technologies.',
    avatar_url: null,
    github_url: 'https://github.com/captain_dev',
    linkedin_url: 'https://linkedin.com/in/captain_dev',
    portfolio_url: 'https://ahmetyilmaz.dev',
    primary_role_id: 1,
    experience_level: 'intermediate' as const,
    location: 'İstanbul, Türkiye',
    available_for_projects: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z',
};

const roleMap: Record<number, string> = {
    1: 'Frontend Developer',
    2: 'Backend Developer',
    3: 'Full Stack Developer',
    4: 'UI/UX Designer',
    5: 'DevOps Engineer',
    6: 'Mobile Developer',
};

const experienceLevels = {
    beginner: { label: 'Başlangıç', color: 'text-blue-600 bg-blue-50', icon: '⚓' },
    intermediate: { label: 'Orta Seviye', color: 'text-amber-600 bg-amber-50', icon: '🧭' },
    advanced: { label: 'İleri Seviye', color: 'text-emerald-600 bg-emerald-50', icon: '🚢' },
};

type TabType = 'overview' | 'edit';

const ProfileSection = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const userProfile = mockUserProfile; // Replace with your actual data

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
        });
    };

    const getInitials = (name: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const OverviewTab = () => (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Ship className="w-full h-full" />
                </div>

                <div className="flex items-start gap-6 relative z-10">
                    <div className="flex-shrink-0">
                        {userProfile?.avatar_url ? (
                            <img
                                src={userProfile.avatar_url}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-white/20"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center text-2xl font-bold">
                                {getInitials(userProfile?.full_name)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold truncate">
                                {userProfile?.full_name || userProfile?.username}
                            </h1>
                            <div
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                    userProfile?.available_for_projects
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-red-500/20 text-red-300'
                                }`}
                            >
                                {userProfile?.available_for_projects ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Proje Arıyor
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        Müsait Değil
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-blue-200 mb-3">
                            <span className="text-lg">@{userProfile?.username}</span>
                            {userProfile?.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{userProfile.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {userProfile?.primary_role_id && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
                                    <Compass className="w-4 h-4" />
                                    {roleMap[userProfile.primary_role_id]}
                                </div>
                            )}

                            {userProfile?.experience_level && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm">
                                    <span>{experienceLevels[userProfile.experience_level].icon}</span>
                                    {experienceLevels[userProfile.experience_level].label}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            {userProfile?.bio && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Anchor className="w-5 h-5 text-blue-600" />
                        Hakkımda
                    </h2>
                    <p className="text-slate-600 leading-relaxed">{userProfile.bio}</p>
                </div>
            )}

            {/* Links & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Social Links */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Bağlantılar
                    </h3>
                    <div className="space-y-3">
                        {userProfile?.github_url && (
                            <a
                                href={userProfile.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                            >
                                <Github className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                                <span className="text-slate-700 group-hover:text-slate-900">GitHub</span>
                            </a>
                        )}

                        {userProfile?.linkedin_url && (
                            <a
                                href={userProfile.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                            >
                                <Linkedin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                                <span className="text-slate-700 group-hover:text-slate-900">LinkedIn</span>
                            </a>
                        )}

                        {userProfile?.portfolio_url && (
                            <a
                                href={userProfile.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                            >
                                <Globe className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                                <span className="text-slate-700 group-hover:text-slate-900">Portfolio</span>
                            </a>
                        )}

                        {!userProfile?.github_url && !userProfile?.linkedin_url && !userProfile?.portfolio_url && (
                            <p className="text-slate-500 text-sm italic">Henüz bağlantı eklenmemiş</p>
                        )}
                    </div>
                </div>

                {/* Member Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-600" />
                        Üyelik Bilgileri
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <span className="text-slate-600">Katılma Tarihi</span>
                            <span className="text-slate-900 font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(userProfile?.created_at)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-slate-600">Son Güncelleme</span>
                            <span className="text-slate-900 font-medium">{formatDate(userProfile?.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const EditTab = () => (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-blue-600" />
                Profil Düzenle
            </h2>
            <div className="text-center py-12">
                <Ship className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">Düzenleme formu burada olacak</p>
                <p className="text-slate-500 text-sm mt-2">API entegrasyonu sonrası aktif olacak</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Anchor className="w-8 h-8 text-blue-600" />
                        Profilim
                    </h1>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Compass className="w-4 h-4" />
                        Dashboard&apos;a Dön
                    </Link>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Vertical Tabs */}
                <div className="w-64 flex-shrink-0">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${
                                activeTab === 'overview'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Genel Bakış</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-colors ${
                                activeTab === 'edit'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <Edit3 className="w-5 h-5" />
                            <span className="font-medium">Düzenle</span>
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'edit' && <EditTab />}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
