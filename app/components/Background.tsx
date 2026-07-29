import { Environment, Sphere } from "@react-three/drei";
import * as THREE from 'three';
import { Gradient, LayerMaterial } from "lamina";

export const Background = () => {
    return (
        <>
            <Environment preset="sunset" />
            <Sphere scale={[100, 100, 100]} rotation-y={Math.PI / 2}>
                <LayerMaterial
                    lighting="physical"
                    transmission={1}
                    side={THREE.BackSide}
                >
                    <Gradient colorA={"navy"} colorB={"black"} axes="z"
                        start={0} end={-0.5} />

                </LayerMaterial>
            </Sphere>
        </>
    );
};