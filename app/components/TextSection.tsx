import { Text } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export const TextSection = ({ title, subtitle, anchorX = "left", fontSize = 0.2, maxWidth = 2, ...props }: { title: string, subtitle: string, anchorX?: any, fontSize?: number, maxWidth?: number } & ThreeElements['group']) => {
    return (
        <group {...props}>
            {!!title && (
                <Text
                    color="white"
                    anchorX={anchorX}
                    anchorY="middle"
                    fontSize={fontSize}
                    maxWidth={maxWidth}
                    textAlign={anchorX === "center" ? "center" : "left"}
                >
                    {title}
                </Text>
            )}
            {!!subtitle && (
                <Text
                    color="white"
                    anchorX={anchorX}
                    anchorY="top"
                    position-y={-(fontSize * 1.2)}
                    fontSize={fontSize * 0.55}
                    maxWidth={maxWidth}
                    textAlign={anchorX === "center" ? "center" : "left"}
                >
                    {subtitle}
                </Text>
            )}
        </group>
    );
};