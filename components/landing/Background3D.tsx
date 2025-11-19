'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Stars, ScrollControls, useScroll } from '@react-three/drei';
import Beacon3D from './Beacon3D';
import { Suspense } from 'react';

export default function Background3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Beacon3D />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020817]/80 to-[#020817] z-10" />
        </div>
    );
}
