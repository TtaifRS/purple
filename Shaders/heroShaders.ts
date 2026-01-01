
export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform float uParallaxStrength;
  uniform float uDistortionMultiplier;
  uniform float uGlassStrength;
  uniform float ustripesFrequency;
  uniform float uglassSmoothness;
  uniform float uEdgePadding;
  
  // Animation uniforms
  uniform float uTime;
  uniform float uAnimationSpeed;
  uniform float uProgress; // Smooth continuous progress from TSX

  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);

    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
  }

  float displacement(float x, float num_stripes, float strength) {
    float modulus = 1.0 / num_stripes;
    return mod(x, modulus) * strength;
  }

  float fractalGlass(float x, float glassStrength) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
      d += displacement(x + float(i) * uglassSmoothness, ustripesFrequency, glassStrength);
    }
    d = d / 11.0;
    return x + d;
  }
  
  float smoothEdge(float x, float padding) {
    float edge = padding;
    if (x < edge) {
      return smoothstep(0.0, edge, x);
    } else if (x > 1.0 - edge) {
      return smoothstep(1.0, 1.0 - edge, x);
    }
    return 1.0;
  }

  void main() {
    vec2 uv = vUv;
    
    // Use the smooth progress value from TSX (0 to 1, continuous, no jumps)
    float progress = uProgress;
    
    // Create pulsing effect for glass
    float pulse = 0.5 + 0.5 * sin(uTime * 0.5);
    
    float originalX = uv.x;
    float edgeFactor = smoothEdge(originalX, uEdgePadding);

    // Animate glass effect with pulse
    float animatedGlassStrength = uGlassStrength * (0.8 + 0.2 * pulse);
    float distortedX = fractalGlass(originalX, animatedGlassStrength);

    uv.x = mix(originalX, distortedX, edgeFactor);
    float distortionFactor = uv.x - originalX;

    // ALWAYS use positive direction for left-to-right movement
    // progress goes from 0 to 1, creating smooth left-to-right motion
    float parallaxStrength = progress * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier);
    
    // Apply parallax offset (always positive = left to right)
    vec2 parallaxOffset = vec2(
      parallaxStrength,
      0.0
    );

    parallaxOffset *= edgeFactor;
    uv += parallaxOffset;

    // Add very subtle continuous drift for extra smoothness
    // This uses uTime which increases forever without jumps
    float continuousDrift = uTime * 0.00005;
    uv.x += continuousDrift;

    // Add subtle vertical variation for organic feel
    float verticalVariation = sin(uTime * 0.3 + uv.x * 3.0) * 0.0005;
    uv.y += verticalVariation;

    vec2 coverUV = getCoverUV(uv, uTextureSize);

    if (coverUV.x < 0.0 || coverUV.x > 1.0 || coverUV.y < 0.0 || coverUV.y > 1.0) {
      coverUV = clamp(coverUV, 0.0, 1.0);
    }

    vec4 color = texture2D(uTexture, coverUV);

    gl_FragColor = color;
  }
`

