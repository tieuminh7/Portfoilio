import React, { useEffect, useRef } from "react";

const SakuraEffect = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      alert("WebGL not supported.");
      return;
    }

    // Shader source code as escaped string literals
    const vertexShaderSource =
      "uniform mat4 uProjection;\\n" +
      "uniform mat4 uModelview;\\n" +
      "uniform vec3 uResolution;\\n" +
      "uniform vec3 uOffset;\\n" +
      "uniform vec3 uDOF;\\n" +
      "uniform vec3 uFade;\\n" +
      "\\n" +
      "attribute vec3 aPosition;\\n" +
      "attribute vec3 aEuler;\\n" +
      "attribute vec2 aMisc;\\n" +
      "\\n" +
      "varying vec3 pposition;\\n" +
      "varying float psize;\\n" +
      "varying float palpha;\\n" +
      "varying float pdist;\\n" +
      "\\n" +
      "varying vec3 normX;\\n" +
      "varying vec3 normY;\\n" +
      "varying vec3 normZ;\\n" +
      "varying vec3 normal;\\n" +
      "\\n" +
      "varying float diffuse;\\n" +
      "varying float specular;\\n" +
      "varying float rstop;\\n" +
      "varying float distancefade;\\n" +
      "\\n" +
      "void main(void) {\\n" +
      "  vec4 pos = uModelview * vec4(aPosition + uOffset, 1.0);\\n" +
      "  gl_Position = uProjection * pos;\\n" +
      "  gl_PointSize = aMisc.x * uProjection[1][1] / -pos.z * uResolution.y * 0.5;\\n" +
      "\\n" +
      "  pposition = pos.xyz;\\n" +
      "  psize = aMisc.x;\\n" +
      "  pdist = length(pos.xyz);\\n" +
      "  palpha = smoothstep(0.0, 1.0, (pdist - 0.1) / uFade.z);\\n" +
      "\\n" +
      "  vec3 elrsn = sin(aEuler);\\n" +
      "  vec3 elrcs = cos(aEuler);\\n" +
      "  mat3 rotx = mat3(\\n" +
      "      1.0, 0.0, 0.0,\\n" +
      "      0.0, elrcs.x, elrsn.x,\\n" +
      "      0.0, -elrsn.x, elrcs.x\\n" +
      "  );\\n" +
      "  mat3 roty = mat3(\\n" +
      "      elrcs.y, 0.0, -elrsn.y,\\n" +
      "      0.0, 1.0, 0.0,\\n" +
      "      elrsn.y, 0.0, elrcs.y\\n" +
      "  );\\n" +
      "  mat3 rotz = mat3(\\n" +
      "      elrcs.z, elrsn.z, 0.0,\\n" +
      "      -elrsn.z, elrcs.z, 0.0,\\n" +
      "      0.0, 0.0, 1.0\\n" +
      "  );\\n" +
      "  mat3 rotmat = rotx * roty * rotz;\\n" +
      "  normal = rotmat[2];\\n" +
      "\\n" +
      "  mat3 trrotm = mat3(\\n" +
      "      rotmat[0][0], rotmat[1][0], rotmat[2][0],\\n" +
      "      rotmat[0][1], rotmat[1][1], rotmat[2][1],\\n" +
      "      rotmat[0][2], rotmat[1][2], rotmat[2][2]\\n" +
      "  );\\n" +
      "  normX = trrotm[0];\\n" +
      "  normY = trrotm[1];\\n" +
      "  normZ = trrotm[2];\\n" +
      "\\n" +
      "  const vec3 lit = vec3(0.6917144638660746, 0.6917144638660746, -0.20751433915982237);\\n" +
      "\\n" +
      "  float tmpdfs = dot(lit, normal);\\n" +
      "  if(tmpdfs < 0.0) {\\n" +
      "      normal = -normal;\\n" +
      "      tmpdfs = dot(lit, normal);\\n" +
      "  }\\n" +
      "  diffuse = 0.4 + tmpdfs;\\n" +
      "\\n" +
      "  vec3 eyev = normalize(-pos.xyz);\\n" +
      "  if(dot(eyev, normal) > 0.0) {\\n" +
      "      vec3 hv = normalize(eyev + lit);\\n" +
      "      specular = pow(max(dot(hv, normal), 0.0), 20.0);\\n" +
      "  }\\n" +
      "  else {\\n" +
      "      specular = 0.0;\\n" +
      "  }\\n" +
      "\\n" +
      "  rstop = clamp((abs(pdist - uDOF.x) - uDOF.y) / uDOF.z, 0.0, 1.0);\\n" +
      "  rstop = pow(rstop, 0.5);\\n" +
      "  distancefade = min(1.0, exp((uFade.x - pdist) * 0.69315 / uFade.y));\\n" +
      "}\\n";

    const fragmentShaderSource =
      " #ifdef GL_ES\\n" +
      "precision highp float;\\n" +
      "#endif\\n" +
      "\\n" +
      "uniform vec3 uDOF;\\n" +
      "uniform vec3 uFade;\\n" +
      "\\n" +
      "const vec3 fadeCol = vec3(0.08, 0.03, 0.06);\\n" +
      "\\n" +
      "varying vec3 pposition;\\n" +
      "varying float psize;\\n" +
      "varying float palpha;\\n" +
      "varying float pdist;\\n" +
      "\\n" +
      "varying vec3 normX;\\n" +
      "varying vec3 normY;\\n" +
      "varying vec3 normZ;\\n" +
      "varying vec3 normal;\\n" +
      "\\n" +
      "varying float diffuse;\\n" +
      "varying float specular;\\n" +
      "varying float rstop;\\n" +
      "varying float distancefade;\\n" +
      "\\n" +
      "float ellipse(vec2 p, vec2 o, vec2 r) {\\n" +
      "    vec2 lp = (p - o) / r;\\n" +
      "    return length(lp) - 1.0;\\n" +
      "}\\n" +
      "\\n" +
      "void main(void) {\\n" +
      "    vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;\\n" +
      "    vec3 d = vec3(0.0, 0.0, -1.0);\\n" +
      "    float nd = normZ.z;\\n" +
      "    if(abs(nd) < 0.0001) discard;\\n" +
      "\\n" +
      "    float np = dot(normZ, p);\\n" +
      "    vec3 tp = p + d * np / nd;\\n" +
      "    vec2 coord = vec2(dot(normX, tp), dot(normY, tp));\\n" +
      "\\n" +
      "    const float flwrsn = 0.258819045102521;\\n" +
      "    const float flwrcs = 0.965925826289068;\\n" +
      "    mat2 flwrm = mat2(flwrcs, -flwrsn, flwrsn, flwrcs);\\n" +
      "    vec2 flwrp = vec2(abs(coord.x), coord.y) * flwrm;\\n" +
      "\\n" +
      "    float r;\\n" +
      "    if(flwrp.x < 0.0) {\\n" +
      "        r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.36, 0.96) * 0.5);\\n" +
      "    }\\n" +
      "    else {\\n" +
      "        r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.58, 0.96) * 0.5);\\n" +
      "    }\\n" +
      "\\n" +
      "    if(r > rstop) discard;\\n" +
      "\\n" +
      "    vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), r);\\n" +
      "    float grady = mix(0.0, 1.0, pow(coord.y * 0.5 + 0.5, 0.35));\\n" +
      "    col *= vec3(1.0, grady, grady);\\n" +
      "    col *= mix(0.8, 1.0, pow(abs(coord.x), 0.3));\\n" +
      "    col = col * diffuse + specular;\\n" +
      "\\n" +
      "    col = mix(fadeCol, col, distancefade);\\n" +
      "\\n" +
      "    float alpha = (rstop > 0.001)? (0.5 - r / (rstop * 2.0)) : 1.0;\\n" +
      "    alpha = smoothstep(0.0, 1.0, alpha) * palpha;\\n" +
      "\\n" +
      "    gl_FragColor = vec4(col * 0.5, alpha);\\n" +
      "}\\n";
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default SakuraEffect;
