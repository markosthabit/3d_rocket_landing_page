import { Text } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export const TextSection = ({ title, subtitle, ...props }: { title: string, subtitle: string } & ThreeElements['group']) => {
    return (
        <group {...props}>
            {!!title && (
                <Text
                    color="white"
                    anchorX="left"
                    anchorY="middle"
                    fontSize={0.22}
                    maxWidth={2}
                >
                    {title}

                </Text>
            )}
            {!!subtitle && (
                <Text
                    color="white"
                    anchorX="left"
                    anchorY="top"
                    position-y={-0.26}
                    fontSize={0.12}
                    maxWidth={2}

                >
                    {subtitle}

                </Text>
            )}
        </group>
    );
};