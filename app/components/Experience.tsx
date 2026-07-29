"use client";
import { Float, Line, OrbitControls, PerspectiveCamera, useScroll, Text } from "@react-three/drei";
import { Background } from "./Background";
import { Rocketship } from "./Rocketship";
import { Star } from "./Star";
import * as THREE from 'three';
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

const LINE_NB_POINTS = 12000;


export const Experience = () => {
    const starData = useMemo(() => {
        const stars = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                position: [
                    (Math.random() - 0.5) * 30, // X: -15 to 15
                    Math.random() * 120 - 10,   // Y: -10 to 110
                    (Math.random() - 0.5) * 15 - 5 // Z: -12.5 to 2.5 (some slightly in front, most behind)
                ] as [number, number, number],
                scale: [1, 1, 1].map(x => x * (Math.random() * 0.06 + 0.02)) as [number, number, number],
                opacity: Math.random() * 0.6 + 0.2,
                rotationY: Math.random() * Math.PI * 2
            });
        }
        return stars;
    }, []);


    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(-2, 20, 0),
        new THREE.Vector3(-3, 30, 0),
        new THREE.Vector3(5, 40, 0),
        new THREE.Vector3(5, 50, 0),
        new THREE.Vector3(7, 60, 0),
        new THREE.Vector3(5, 70, 0),
        new THREE.Vector3(0, 80, 0),
        new THREE.Vector3(0, 90, 0),
        new THREE.Vector3(0, 100, 0),
    ], false, "catmullrom", 0.5);

    const linePoints = curve.getPoints(LINE_NB_POINTS);
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    const cameraGroup = useRef<THREE.Group>(null);
    const rocketGroup = useRef<THREE.Group>(null);
    const scroll = useScroll();
    useFrame((_state, delta) => {
        const curPointIndex = Math.min(
            Math.round(scroll.offset * linePoints.length),
            linePoints.length - 1
        )
        const curPoint = linePoints[curPointIndex];
        cameraGroup.current!.position.lerp(curPoint, delta * 24)

        // Find the direction (tangent) to the next point
        const forwardIndex = Math.min(curPointIndex + 1, linePoints.length - 1);
        const pointForward = linePoints[forwardIndex];

        let tangent: THREE.Vector3;
        if (curPointIndex === linePoints.length - 1) {
            // If we're at the very end, use the previous point to find the tangent
            const pointBehind = linePoints[Math.max(0, curPointIndex - 1)];
            tangent = curPoint.clone().sub(pointBehind).normalize();
        } else {
            tangent = pointForward.clone().sub(curPoint).normalize();
        }

        // Rotate ONLY the rocket to follow the 2D path on the XY plane
        if (rocketGroup.current) {
            // Calculate angle on the XY plane
            const angle = Math.atan2(tangent.y, tangent.x);

            // Depending on the default orientation of the rocket model, you might need to add an offset 
            // like - Math.PI / 2 to this angle. But we'll align the Z rotation here.
            rocketGroup.current.rotation.z = angle - Math.PI / 2;
        }
    })

    return (
        <>
            {/* <OrbitControls enableZoom={false} /> Removed to prevent fighting with scroll camera rotation */}
            <directionalLight position={[0, 3, 1]}
                intensity={0.1}
            />
            <group ref={cameraGroup}>
                <Background />
                <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
                <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
                    <group ref={rocketGroup}>
                        <Rocketship scale={[0.05, 0.05, 0.05]} position-y={0.1} position-z={0.5} />
                    </group>
                </Float>
            </group>
            <group position={[3, -2, -10]}>

                <Text
                    color="white"
                    anchorX="left"
                    anchorY="middle"
                    fontSize={0.22}
                    maxWidth={2.5}
                >
                    Welcome To GoStore!

                </Text>
            </group>
            <group position={[3, 12, -10]}>

                <Text
                    color="white"
                    anchorX="left"
                    anchorY="middle"
                    fontSize={0.52}
                    maxWidth={2.5}
                >
                    Our Services

                </Text>
                <Text
                    color="white"
                    anchorX="left"
                    anchorY="top"
                    position-y={-0.66}
                    fontSize={0.22}
                    maxWidth={2.5}

                >
                    We build custom software, mobile applications, and websites that help businesses
                    streamline their operations and engage their customers.

                </Text>
            </group>
            <group position-y={-1}>
                <mesh>
                    <extrudeGeometry
                        args={[
                            shape,
                            {
                                steps: LINE_NB_POINTS,
                                bevelEnabled: false,
                                extrudePath: curve
                            }
                        ]}
                    />
                    <meshStandardMaterial color={"white"} opacity={1} transparent />
                </mesh>
            </group>
            {starData.map((star, index) => (
                <Star
                    key={index}
                    opacity={star.opacity}
                    scale={star.scale}
                    position={star.position}
                    rotation-y={star.rotationY}
                />
            ))}


        </>
    );
};