import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0">
                {/* Stars */}
                <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
                <div
                    className="absolute top-16 left-40 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
                    style={{ animationDelay: '1s' }}
                ></div>
                <div
                    className="absolute top-8 right-32 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
                    style={{ animationDelay: '2s' }}
                ></div>
                <div
                    className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                ></div>
                <div
                    className="absolute top-32 left-60 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
                    style={{ animationDelay: '1.5s' }}
                ></div>

                {/* Floating Clouds */}
                <div className="absolute top-16 left-10 opacity-20">
                    <div
                        className="w-16 h-6 bg-white rounded-full animate-bounce"
                        style={{ animationDuration: '6s', animationDelay: '0s' }}
                    ></div>
                </div>
                <div className="absolute top-24 right-16 opacity-15">
                    <div
                        className="w-12 h-4 bg-white rounded-full animate-bounce"
                        style={{ animationDuration: '8s', animationDelay: '-2s' }}
                    ></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Ship Illustration */}
                    <div className="relative mb-12">
                        {/* Ocean Waves */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md h-24 bg-gradient-to-t from-blue-800 to-blue-600 rounded-t-full opacity-80"></div>

                        {/* Animated Ship */}
                        <div className="relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                            <svg viewBox="0 0 300 180" className="w-80 h-auto mx-auto drop-shadow-2xl">
                                {/* Ship Body */}
                                <path
                                    d="M60 120 L240 120 L225 140 L75 140 Z"
                                    fill="#8B4513"
                                    stroke="#654321"
                                    strokeWidth="3"
                                />
                                <rect
                                    x="65"
                                    y="105"
                                    width="170"
                                    height="15"
                                    fill="#A0522D"
                                    stroke="#8B4513"
                                    strokeWidth="2"
                                />

                                {/* Mast */}
                                <line x1="150" y1="30" x2="150" y2="120" stroke="#8B4513" strokeWidth="4" />

                                {/* Main Sail */}
                                <path
                                    d="M155 35 Q210 25 220 70 Q210 115 155 110 Z"
                                    fill="#F8F8FF"
                                    stroke="#E0E0E0"
                                    strokeWidth="2"
                                    className="animate-pulse"
                                />

                                {/* Small Sail */}
                                <path
                                    d="M80 45 Q130 35 140 80 Q130 105 80 100 Z"
                                    fill="#E6E6FA"
                                    stroke="#D3D3D3"
                                    strokeWidth="2"
                                    className="animate-pulse"
                                    style={{ animationDelay: '1s' }}
                                />

                                {/* Flag */}
                                <rect
                                    x="150"
                                    y="30"
                                    width="25"
                                    height="15"
                                    fill="#DC143C"
                                    className="animate-pulse"
                                    style={{ animationDelay: '0.5s' }}
                                />

                                {/* Anchor */}
                                <g transform="translate(90, 125)">
                                    <path
                                        d="M0 0 L0 15 M-8 12 L8 12 M-5 18 L0 15 L5 18"
                                        stroke="#708090"
                                        strokeWidth="3"
                                        fill="none"
                                    />
                                </g>

                                {/* Portholes */}
                                <circle cx="110" cy="115" r="4" fill="#4682B4" stroke="#2F4F4F" strokeWidth="2" />
                                <circle cx="140" cy="115" r="4" fill="#4682B4" stroke="#2F4F4F" strokeWidth="2" />
                                <circle cx="170" cy="115" r="4" fill="#4682B4" stroke="#2F4F4F" strokeWidth="2" />
                                <circle cx="200" cy="115" r="4" fill="#4682B4" stroke="#2F4F4F" strokeWidth="2" />

                                {/* Ship Details */}
                                <path d="M75 140 Q150 135 225 140" stroke="#654321" strokeWidth="2" fill="none" />
                            </svg>
                        </div>

                        {/* Compass */}
                        <div className="absolute top-8 right-8 animate-spin" style={{ animationDuration: '10s' }}>
                            <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-70 drop-shadow-lg">
                                <circle cx="40" cy="40" r="38" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <circle cx="40" cy="40" r="30" fill="none" stroke="#60a5fa" strokeWidth="1" />
                                <circle cx="40" cy="40" r="20" fill="none" stroke="#93c5fd" strokeWidth="1" />
                                <path d="M40 8 L48 32 L40 40 L32 32 Z" fill="#dc2626" />
                                <path d="M40 40 L32 48 L40 72 L48 48 Z" fill="#f8fafc" />
                                <text x="40" y="18" textAnchor="middle" className="text-xs fill-white font-bold">
                                    N
                                </text>
                                <text x="62" y="44" textAnchor="middle" className="text-xs fill-white font-bold">
                                    E
                                </text>
                                <text x="40" y="68" textAnchor="middle" className="text-xs fill-white font-bold">
                                    S
                                </text>
                                <text x="18" y="44" textAnchor="middle" className="text-xs fill-white font-bold">
                                    W
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* 404 Text */}
                    <div className="space-y-6">
                        <h1 className="text-8xl md:text-9xl font-bold text-white opacity-90 tracking-wider drop-shadow-2xl">
                            4<span className="text-blue-300 animate-pulse">0</span>4
                        </h1>

                        <div className="max-w-2xl mx-auto space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                                <span className="animate-bounce">🏴‍☠️</span>
                                Lost at Sea!
                                <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>
                                    ⚓
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-blue-100 mb-2">
                                The page you are looking for seems to be lost in the depths of the ocean.
                            </p>
                            <p className="text-base md:text-lg text-blue-200 opacity-90 flex items-center justify-center gap-2">
                                Maybe you are searching for an undiscovered island?
                                <span className="animate-pulse">🗺️</span>
                            </p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                        <Link
                            href="/"
                            className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 min-w-48"
                        >
                            <svg
                                className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Return to Main Port
                        </Link>

                        <Link
                            href="/dashboard"
                            className="group px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 min-w-48"
                        >
                            <svg
                                className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            Dashboard
                        </Link>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-12 max-w-md mx-auto">
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/20 shadow-2xl">
                            <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                                <span className="animate-spin" style={{ animationDuration: '3s' }}>
                                    ⚓
                                </span>
                                Captain&apos;s Tips
                            </h3>
                            <ul className="text-blue-200 text-sm space-y-2 text-left">
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-400">•</span>
                                    Check the URL, maybe there&apos;s a typo?
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-400">•</span>
                                    Try navigating again from the homepage
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-400">•</span>
                                    This page may not have been built yet
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Sea Elements */}
            <div
                className="absolute bottom-20 left-10 animate-bounce"
                style={{ animationDuration: '4s', animationDelay: '-1s' }}
            >
                <div className="text-2xl opacity-60">🐠</div>
            </div>
            <div
                className="absolute bottom-32 right-20 animate-bounce"
                style={{ animationDuration: '5s', animationDelay: '-3s' }}
            >
                <div className="text-xl opacity-50">🐟</div>
            </div>
            <div className="absolute top-1/3 left-20 animate-pulse" style={{ animationDelay: '-2s' }}>
                <div className="text-lg opacity-40">⭐</div>
            </div>
            <div className="absolute top-1/4 right-1/4 animate-pulse" style={{ animationDelay: '-4s' }}>
                <div className="text-sm opacity-30">✨</div>
            </div>
        </div>
    );
}
