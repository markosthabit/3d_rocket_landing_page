"use client";
import { Float, Line, OrbitControls, PerspectiveCamera, useScroll, Text } from "@react-three/drei";
import gsap from 'gsap';
import { Background } from "./Background";
import { Rocketship } from "./Rocketship";
import { Star } from "./Star";
import * as THREE from 'three';
import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TextSection } from "./TextSection";
const LINE_NB_POINTS = 1000;

export const Experience = () => {
    const { viewport } = useThree();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const curvePoints = [new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(6, 15, 0),
    new THREE.Vector3(10, 30, 0),
    new THREE.Vector3(-2, 45, 0),
    new THREE.Vector3(-12, 60, 0),
    new THREE.Vector3(-5, 75, 0),
    new THREE.Vector3(8, 90, 0),
    new THREE.Vector3(5, 105, 0),
    new THREE.Vector3(0, 120, 0),
    ]
    const curve = new THREE.CatmullRomCurve3(
        curvePoints
        , false, "catmullrom", 0.5);

    const linePoints = curve.getPoints(LINE_NB_POINTS);
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    const cameraGroup = useRef<THREE.Group>(null);
    const rocketGroup = useRef<THREE.Group>(null);
    const scroll = useScroll();

    useEffect(() => {
        if (!scroll.el) return;

        let scrollTimeout: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                // User stopped scrolling. Snap to the nearest page using GSAP!
                const clientHeight = scroll.el.clientHeight;
                const scrollHeight = scroll.el.scrollHeight;
                const maxScroll = scrollHeight - clientHeight;

                // Calculate which page we are closest to (0 to pages - 1)
                const currentPage = Math.round(scroll.el.scrollTop / clientHeight);
                const targetScroll = Math.min(currentPage * clientHeight, maxScroll);

                // Animate smoothly to the target
                gsap.to(scroll.el, {
                    scrollTop: targetScroll,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }, 150); // wait 150ms after the last scroll event to trigger snap
        };

        scroll.el.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            clearTimeout(scrollTimeout);
            scroll.el.removeEventListener('scroll', handleScroll);
        }
    }, [scroll.el]);

    useFrame((_state, delta) => {

        // Clamp the offset to prevent out-of-bounds errors during overscroll (rubber-banding on Mac/iOS)
        const safeOffset = Math.max(0, Math.min(1, scroll.offset));

        // Get the exact point and tangent on the curve based on the smooth scroll offset
        // We use getPoint instead of getPointAt so that parametric t (e.g. 1/8) 
        // maps exactly to curvePoints[i], ensuring perfect alignment with the snap points.
        const curPoint = curve.getPoint(safeOffset);
        const tangent = curve.getTangent(safeOffset);

        // We use copy instead of lerp here because scroll.offset is already smoothed 
        // by the damping prop in ScrollControls, and double-smoothing causes jitter.
        cameraGroup.current!.position.copy(curPoint);

        // Rotate ONLY the rocket to follow the 2D path on the XY plane
        if (rocketGroup.current) {
            // Calculate angle on the XY plane
            const angle = Math.atan2(tangent.y, tangent.x);

            // Depending on the default orientation of the rocket model, you might need to add an offset 
            // like - Math.PI / 2 to this angle. But we'll align the Z rotation here.
            rocketGroup.current.rotation.z = angle - Math.PI / 2;
        }
    })
    const textSections = [
        {
            position: new THREE.Vector3(
                isMobile ? curvePoints[0].x : curvePoints[0].x - 2.3,
                curvePoints[0].y + (isMobile ? 1.0 : 0.7),
                curvePoints[0].z + (isMobile ? .1 : 0),
            ),
            title: "Welcome to GoStore",
            subtitle: "The ultimate destination for custom PCs",
        },
        {
            position: new THREE.Vector3(
                isMobile ? curvePoints[1].x - .7 : curvePoints[1].x - 2.5,
                curvePoints[1].y - (isMobile ? .5 : 1),
                curvePoints[1].z + (isMobile ? -1.3 : 0),
            ),
            title: "Next-Gen Hardware",
            subtitle: "CPUs, GPUs, and Motherboards",
        },
        {
            position: new THREE.Vector3(
                isMobile ? curvePoints[2].x + .2 : curvePoints[2].x - 2.1,
                curvePoints[2].y - (isMobile ? 2.5 : 3),
                curvePoints[2].z + (isMobile ? .1 : 0),
            ),
            title: "Premium Peripherals",
            subtitle: "Mechanical keyboards & gaming mice",
        },
        {
            position: new THREE.Vector3(
                isMobile ? curvePoints[3].x + 4.4 : curvePoints[3].x + 4.5,
                curvePoints[3].y - (isMobile ? 4.5 : 4.5),
                curvePoints[3].z,
            ),
            title: "Custom Builds",
            subtitle: "We build your dream setup",
        },
        {
            position: new THREE.Vector3(
                isMobile ? -8.8 : curvePoints[4].x + 3.5,
                curvePoints[4].y - (isMobile ? 5.5 : 6.5),
                curvePoints[4].z + (isMobile ? -3 : 0),
            ),
            title: "24/7 Tech Support",
            subtitle: "Our experts are always ready to help",
        },
        {
            position: new THREE.Vector3(
                isMobile ? -10.4 : curvePoints[5].x - 7.7,
                curvePoints[5].y - (isMobile ? 7 : 8),
                curvePoints[5].z + (isMobile ? -3 : 0),
            ),
            title: "Secure Checkout",
            subtitle: "Fast and safe payment options",
        },
        {
            position: new THREE.Vector3(
                isMobile ? -.5 : curvePoints[6].x - 10.5,
                curvePoints[6].y - 9.5,
                curvePoints[6].z + (isMobile ? -3 : 0),
            ),
            title: "Top Tier Brands",
            subtitle: "ASUS, NVIDIA, AMD & more",
        },
        {
            position: new THREE.Vector3(
                isMobile ? 8.5 : curvePoints[7].x + 1.4,
                curvePoints[7].y - (isMobile ? 11 : 12),
                curvePoints[7].z + (isMobile ? -1 : 0),
            ),
            title: "Join the Elite",
            subtitle: "Upgrade your battlestation today",
        }
    ]
    return (
        <>
            {/* <OrbitControls /> Removed to prevent fighting with scroll camera rotation */}
            <directionalLight position={[0, 3, 1]}
                intensity={0.1}
            />
            <group ref={cameraGroup}>
                <Background />
                <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
                <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
                    <group ref={rocketGroup}>
                        <Rocketship
                            scale={isMobile ? [0.035, 0.035, 0.035] : [0.05, 0.05, 0.05]}
                            position-y={isMobile ? -0.4 : 0.1}
                            position-z={0.5}
                        />
                    </group>
                </Float>
            </group>
            {/* TEXT */}
            {textSections.map((section, index) => (
                <TextSection
                    {...section}
                    anchorX={isMobile ? "center" : "left"}
                    fontSize={isMobile ? Math.min(0.18, viewport.width * 0.12) : 0.22}
                    maxWidth={isMobile ? Math.min(1.5, viewport.width * 0.9) : 2.5}
                    key={index}
                />
            ))}
            {/* Line */}
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
                    <meshStandardMaterial color={"white"} opacity={1} transparent envMapIntensity={2} />

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