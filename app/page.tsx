"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
export default function Home() {
  return (
    <main className="h-screen w-full">
      <Canvas camera={{

      }}>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={9} damping={1}>
          <Experience />
        </ScrollControls>

      </Canvas>
    </main>
  );
}
