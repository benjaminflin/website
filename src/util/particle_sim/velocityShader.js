export default `
uniform sampler2D var_velocity;

void main() {
    vec2 coord = gl_FragCoord.xy / dimensions.xy;
    vec2 velocity = texture2D(var_velocity, coord).xy;
    velocity += vec2(0.0005, 0.0005);
    gl_FragColor = vec4(velocity, 1.0, 1.0);
}
`;
