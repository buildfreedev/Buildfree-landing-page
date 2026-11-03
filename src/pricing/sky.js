// Real-time skies for the "Your weekend, both ways" cards, drawn with a small WebGL shader:
// soft noise clouds, a moon or sun with glow, stars, and a hazy horizon.
const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const COMMON = `
precision highp float;
uniform vec2 r; uniform float t;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
`;

// Late night: deep blue sky, twinkling stars, a textured moon with halo, thin moonlit clouds,
// and the orange glow of city lights on the horizon.
const NIGHT = COMMON + `
void main(){
  vec2 uv=gl_FragCoord.xy/r; float ar=r.x/r.y; vec2 p=vec2(uv.x*ar,uv.y);
  vec3 col=mix(vec3(.10,.10,.20),vec3(.035,.06,.15),smoothstep(0.,.45,uv.y));
  col=mix(col,vec3(.008,.014,.05),smoothstep(.45,1.,uv.y));
  col+=vec3(.55,.28,.12)*exp(-uv.y*6.)*.32;
  vec2 g=p*150.; vec2 id=floor(g); float h=hash(id);
  if(h>.972){ vec2 o=vec2(hash(id+3.1),hash(id+7.7))-.5; float d=length(fract(g)-.5-o*.6);
    float tw=.55+.45*sin(t*(1.5+h*3.)+h*80.);
    col+=vec3(.9,.95,1.)*smoothstep(.09,0.,d)*tw*smoothstep(.12,.45,uv.y)*(.5+(h-.972)*25.); }
  vec2 m=vec2(ar-.13,.915); float md=length(p-m), mr=.052;
  float surf=.78+.22*fbm((p-m)*26.); float limb=sqrt(max(0.,1.-pow(md/mr,2.)));
  col=mix(col,vec3(.98,.95,.86)*surf*(.75+.25*limb),smoothstep(mr,mr-.003,md));
  col+=vec3(.95,.9,.75)*(.22*exp(-md*10.)+.07*exp(-md*2.6));
  float c=fbm(vec2(p.x*1.6+t*.012,p.y*4.));
  float cl=smoothstep(.52,.8,c)*smoothstep(.18,.6,uv.y);
  col=mix(col,vec3(.13,.15,.25)+vec3(.35,.33,.3)*exp(-md*3.5),cl*.6);
  col+=(hash(gl_FragCoord.xy+t)-.5)*.012;
  gl_FragColor=vec4(col,1.);
}`;

// Clear morning: a deep-to-pale blue gradient, a bright sun with bloom, and drifting
// cumulus clouds shaded from below, fading into a warm haze at the horizon.
const DAY = COMMON + `
void main(){
  vec2 uv=gl_FragCoord.xy/r; float ar=r.x/r.y; vec2 p=vec2(uv.x*ar,uv.y);
  vec3 col=mix(vec3(.80,.89,.97),vec3(.20,.47,.86),pow(clamp(uv.y,0.,1.),.75));
  col=mix(col,vec3(1.,.94,.84),exp(-uv.y*5.)*.55);
  vec2 s=vec2(ar-.12,.92); float sd=length(p-s);
  col+=vec3(1.,.96,.84)*(smoothstep(.045,.037,sd)*1.3+.55*exp(-sd*7.)+.22*exp(-sd*1.9));
  vec2 q=vec2(p.x*1.5+t*.015,p.y*3.4);
  float n=fbm(q), n2=fbm(q+vec2(.05,-.09));
  float cl=smoothstep(.5,.75,n)*smoothstep(.12,.5,uv.y);
  float lit=clamp((n-n2)*5.+.65,0.,1.);
  vec3 cc=mix(vec3(.66,.72,.82),vec3(1.,.99,.97),lit)+vec3(.15,.12,.05)*exp(-sd*2.);
  col=mix(col,cc,cl*.92);
  gl_FragColor=vec4(col,1.);
}`;

export function createSky(canvas, kind) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, kind === 'night' ? NIGHT : DAY));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, 'r'), uT = gl.getUniformLocation(prog, 't');

  let raf = 0;
  const t0 = performance.now();
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, canvas.clientWidth * dpr);
    canvas.height = Math.max(1, canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const frame = () => {
    raf = requestAnimationFrame(frame);
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const once = () => { gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, 0); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  return {
    resize, once,
    start: () => { if (!raf) frame(); },
    stop: () => { cancelAnimationFrame(raf); raf = 0; },
    dispose: () => { cancelAnimationFrame(raf); gl.deleteProgram(prog); gl.deleteBuffer(buf); },
  };
}
