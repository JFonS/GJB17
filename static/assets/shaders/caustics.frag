precision mediump float;

#define TAU 6.28318530718
#define MAX_ITER 5

varying vec2      vTextureCoord;
uniform sampler2D uSampler;

uniform float     time;
uniform vec2      resolution;
uniform vec2      mouse;


void main()
{
	float tim = time * .25+23.0;
	vec2 uv = vTextureCoord;

	vec2 p = mod(uv*TAU*vec2(2.1,1.7), TAU)-250.0;
	vec2 i = vec2(p);
	float c = 1.0;
	float inten = .005;

	for (int n = 0; n < MAX_ITER; n++)
	{
		float t = tim * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}

	c /= float(MAX_ITER);
	c = 1.17-pow(c, 1.4);
	vec3 colour = vec3(pow(abs(c), 8.0));
    colour = clamp(colour /*+ vec3(0.15, 0.15, 0.15)*/, 0.0, 1.0);

	gl_FragColor = vec4(colour, 0.2);
}