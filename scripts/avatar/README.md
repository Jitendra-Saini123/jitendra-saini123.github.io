# Avatar pipeline (FBX → web GLB)

`public/models/avatar.glb` was produced from the Avaturn FBX export (`avatar/model.fbx`, T-pose, no clips) in two steps.

## 1. FBX → GLB with three.js (headless Chrome)

`export.html` loads the FBX with three's `FBXLoader`, converts the Phong materials to PBR, keeps only the blendshapes the site animates (`eyeBlink*`, `mouthSmile*`) and exports a GLB with `GLTFExporter`. `convert-server.mjs` serves it to a headless Chrome on 127.0.0.1 and writes the result.

```bash
mkdir -p /tmp/avatar-out
node scripts/avatar/convert-server.mjs node_modules/three /path/to/model.fbx /tmp/avatar-out scripts/avatar/export.html
```

(The Chrome path in `convert-server.mjs` is the macOS default; adjust it on other systems.)

## 2. Optimize with glTF-Transform

```bash
npx @gltf-transform/cli@4.5.0 optimize /tmp/avatar-out/avatar-raw.glb public/models/avatar.glb \
  --compress meshopt --texture-compress webp --texture-size 1024 \
  --simplify false --join false --flatten false --instance false --palette false
```

37.7 MB → ~2.4 MB. Meshopt-compressed geometry needs `'wasm-unsafe-eval'` in the CSP (already set in `next.config.ts`).

The runtime animation (relaxed pose, breathing, blinking, gaze, wave) lives in `src/components/three/avatar/avatar-rig.ts` and works on any Mixamo-style rig with the same bone names.
