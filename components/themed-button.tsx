import {
  StyleSheet,
  Pressable,
  Text,
  ImageBackground,
  View,
  Animated,
  type PressableProps,
  type ImageSourcePropType,
  Platform,
} from 'react-native';
import { useRef } from 'react';

export type ThemedButtonProps = PressableProps & {
  title: string;
  backgroundImage: ImageSourcePropType;
};

export function ThemedButton({
  title,
  backgroundImage,
  style,
  ...rest
}: ThemedButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  };

  const handleHoverIn = () => {
    if (Platform.OS === 'web') animateScale(1.05);
  };

  const handleHoverOut = () => {
    if (Platform.OS === 'web') animateScale(1);
  };

  const handlePressIn = () => animateScale(0.95);
  const handlePressOut = () => animateScale(1);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onMouseEnter={handleHoverIn}
          onMouseLeave={handleHoverOut}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
          {...rest}
        >
          <ImageBackground
            source={backgroundImage}
            style={styles.image}
            imageStyle={styles.imageRadius}
            resizeMode="cover"
          >
            <Text style={styles.text}>{title}</Text>
          </ImageBackground>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    width: 100,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  imageRadius: {
    borderRadius: 12,
    borderColor: 'orange',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: 'orange',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});

