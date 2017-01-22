precision mediump float;

#define TAU 6.28318530718
#define MAX_ITER 9
#define MIN_ITER 3

const float alpha = 0.17;

varying vec2      vTextureCoord;
uniform sampler2D uSampler;

uniform float     time;
uniform vec2      resolution;
uniform vec2      mouse;

float col(vec2 p) {
    float tim = time * .25+23.0;
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
    return clamp(pow(abs(c), 8.0),0.,1.);
}

float col2(vec2 p) {
    float tim = time * .25+23.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .005;

    for (int n = 0; n < MIN_ITER; n++)
    {
        float t = tim * (1.0 - (3.5 / float(n+1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
    }

    c /= float(MIN_ITER);
    c = 1.17-pow(c, 1.4);
    return clamp(pow(abs(c), 8.0),0.,1.);
}


void main()
{
    vec2 ti = (1./resolution);
	vec2 uv = vTextureCoord;
	//uv.y = 1. - uv.y;

	vec2 p = mod((uv + vec2(0.15))*TAU*vec2(2.1,1.7), TAU)-250.0;

    vec3 height = vec3(col(p));
    vec2 m = vec2(0);
    vec2 M = vec2(0);

    m.x = col2(p - vec2(ti.x,0));
    M.x = col2(p + vec2(ti.x,0));

    m.y = col2(p - vec2(0,ti.y));
    M.y = col2(p + vec2(0,ti.y));

    vec2 grad = (m - M);

    vec3 N = normalize(vec3(grad, 1.0));

    vec3 refr = refract(N, vec3(0.0, 0.0, 1.0), 1.0 / 1.3);
    vec4 color = texture2D(uSampler, uv + refr.xy);


    gl_FragColor = color + vec4(vec3(height) + vec3(0,0,0.3), 0.) * alpha;
    gl_FragColor.a = 1.;
}