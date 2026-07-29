import { Environment, Sphere } from "@react-three/drei";
import * as THREE from 'three';
import { Gradient, LayerMaterial } from "lamina";

const colorA = "#0923be";
const colorB = "#ffad30";
const start = 0.2;
const end = -0.5;
export const Background = () => {
    return (
        <>
            <Sphere scale={[500, 500, 500]} rotation-x={Math.PI / 2}>
                <LayerMaterial
                    side={THREE.BackSide}
                >
                    <Gradient colorA={colorA} colorB={colorB} axes="z"
                        start={start} end={end} />

                </LayerMaterial>
            </Sphere>
            <Environment resolution={256} >
                <Sphere scale={[500, 500, 500]} rotation-x={Math.PI / 2} rotation-y={Math.PI}>
                    <LayerMaterial
                        side={THREE.BackSide}
                    >
                        <Gradient colorA={colorA} colorB={colorB} axes="z"
                            start={start} end={end} />

                    </LayerMaterial>
                </Sphere>
            </Environment >
        </>
    );
};