'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Torus, Cylinder, Sphere, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function Beacon3D() {
    const lightRef = useRef<THREE.SpotLight>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const ringRef1 = useRef<THREE.Mesh>(null);
    const ringRef2 = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // Optional: useScroll if wrapped in ScrollControls, but for fixed background we might just use clock or mouse
    // For now, let's keep it simple and just have it rotate. 
    // To make it "connected" to the page, we can use simple scroll listener or just let it be a nice ambient background.
    // The user said "not connected to the whole page", implying they want it to persist or react.
    // Making it a fixed background (as planned in Background3D) solves the persistence.

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Gentle floating for the whole group
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.1;
            groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
        }

        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.5;
        }
        if (ringRef1.current) {
            ringRef1.current.rotation.x = Math.sin(time * 0.2) * 0.5;
            ringRef1.current.rotation.y = time * 0.3;
        }
        if (ringRef2.current) {
            ringRef2.current.rotation.x = Math.cos(time * 0.2) * 0.5;
            ringRef2.current.rotation.y = -time * 0.1;
        }

        // Light house effect
        if (lightRef.current) {
            lightRef.current.position.x = Math.sin(time * 1.5) * 3;
            lightRef.current.position.z = Math.cos(time * 1.5) * 3;
            lightRef.current.target.position.set(0, -5, 0); // Point downwards/outwards
            lightRef.current.target.updateMatrixWorld();
        }
    });

    return (
        <group ref={groupRef} scale={1.2} position={[0, 0, 0]}>
            {/* Ambient glow */}
            <pointLight position={[0, 0, 0]} intensity={2} color="#00ffff" distance={10} />

            {/* The Rotating Light Beam */}
            <spotLight
                ref={lightRef}
                position={[0, 3, 0]}
                angle={0.6}
                penumbra={0.5}
                intensity={100}
                color="#00ffff"
                castShadow
            />

            {/* Core Crystal */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere ref={coreRef} args={[0.8, 64, 64]}>
                    <MeshDistortMaterial
                        color="#00ffff"
                        emissive="#0088ff"
                        emissiveIntensity={2}
                        roughness={0.1}
                        metalness={0.8}
                        distort={0.3}
                        speed={2}
                    />
                </Sphere>
            </Float>

            {/* Outer Rings */}
            <Torus ref={ringRef1} args={[2.2, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.3} />
            </Torus>

            <Torus ref={ringRef2} args={[2.8, 0.01, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
                <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} transparent opacity={0.2} />
            </Torus>

            {/* Particles/Stars around */}
            <group>
                {Array.from({ length: 40 }).map((_, i) => (
                    <Float key={i} speed={0.5 + Math.random()} rotationIntensity={1} floatIntensity={2} position={[
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 15,
                        (Math.random() - 0.5) * 10
                    ]}>
                        <Sphere args={[0.03, 8, 8]}>
                            <meshBasicMaterial color={Math.random() > 0.5 ? "#00ffff" : "#ffffff"} transparent opacity={0.6} />
                        </Sphere>
                    </Float>
                ))}
            </group>
        </group>
    );
}
