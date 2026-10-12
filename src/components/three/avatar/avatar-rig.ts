import { type Mesh, type Object3D, Quaternion, Vector3 } from "three";

/**
 * Procedural animation for the Avaturn avatar (a Mixamo-style rig exported in
 * a T-pose with no clips). Everything is computed at runtime:
 * a relaxed stance, breathing, weight shift, blinking, a head and eyes that
 * follow the visitor's pointer, and a wave.
 *
 * Bones are posed by *direction* in the avatar's own space rather than by
 * hard-coded local rotations, so the code doesn't depend on the rig's axes.
 */

export interface RigInput {
  /** Gaze target, -1..1 (right / up positive). */
  lookX: number;
  lookY: number;
  /** False for reduced motion: no idle sway or blinking. */
  idle: boolean;
}

const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
const Z = new Vector3(0, 0, 1);

const _a = new Vector3();
const _b = new Vector3();
const _axis = new Vector3();
const _q = new Quaternion();
const _q2 = new Quaternion();

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** Rotates `bone` so the bone → child direction points along `dir` (world space). */
function aim(bone: Object3D, child: Object3D, dir: Vector3) {
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  const current = _b.sub(_a).normalize();
  const delta = new Quaternion().setFromUnitVectors(current, dir.clone().normalize());
  const boneWorld = bone.getWorldQuaternion(new Quaternion());
  const parentWorld = bone.parent ? bone.parent.getWorldQuaternion(new Quaternion()) : new Quaternion();
  bone.quaternion.copy(parentWorld.invert().multiply(delta.multiply(boneWorld)));
  bone.updateWorldMatrix(false, true);
}

/** Adds a rotation about an axis given in the avatar root's space. */
function turn(bone: Object3D, root: Object3D, axis: Vector3, angle: number) {
  if (angle === 0 || !bone.parent) return;
  root.getWorldQuaternion(_q);
  _axis.copy(axis).applyQuaternion(_q);
  bone.parent.getWorldQuaternion(_q2);
  _axis.applyQuaternion(_q2.invert()).normalize();
  bone.quaternion.premultiply(_q.setFromAxisAngle(_axis, angle));
}

export class AvatarRig {
  private readonly root: Object3D;
  private readonly bones: Record<string, Object3D>;
  private readonly base = new Map<Object3D, Quaternion>();
  private readonly wavePose = new Map<Object3D, Quaternion>();
  private readonly faceMeshes: Mesh[] = [];
  private yaw = 0;
  private pitch = 0;
  private waveStart = -10;
  private nextBlink = 2;
  private blinkStart = -1;
  readonly ok: boolean;

  constructor(root: Object3D) {
    this.root = root;
    const names = [
      "Hips", "Spine", "Spine1", "Spine2", "Neck", "Head", "LeftEye", "RightEye",
      "LeftArm", "LeftForeArm", "LeftHand", "LeftHandMiddle1",
      "RightArm", "RightForeArm", "RightHand", "RightHandMiddle1",
    ];
    this.bones = {};
    // getObjectByName returns the first match in depth-first order: the real
    // bone, not its identically named helper child.
    for (const name of names) {
      const found = root.getObjectByName(name);
      if (found) this.bones[name] = found;
    }
    this.ok = names.every((name) => this.bones[name]);

    root.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary && "eyeBlinkLeft" in mesh.morphTargetDictionary) this.faceMeshes.push(mesh);
    });

    if (this.ok) this.buildPoses();
  }

  private b(name: string): Object3D {
    return this.bones[name]!;
  }

  private buildPoses() {
    const root = this.root;
    root.updateWorldMatrix(true, true);
    // The avatar faces +Z; its left side is +X.
    const relaxed: [string, string, Vector3][] = [
      ["LeftArm", "LeftForeArm", new Vector3(0.2, -1, 0.02)],
      ["LeftForeArm", "LeftHand", new Vector3(0.1, -1, 0.32)],
      ["LeftHand", "LeftHandMiddle1", new Vector3(0.04, -1, 0.2)],
      ["RightArm", "RightForeArm", new Vector3(-0.2, -1, 0.02)],
      ["RightForeArm", "RightHand", new Vector3(-0.1, -1, 0.32)],
      ["RightHand", "RightHandMiddle1", new Vector3(-0.04, -1, 0.2)],
    ];
    for (const [bone, child, dir] of relaxed) aim(this.b(bone), this.b(child), dir);

    const posed = ["Hips", "Spine", "Spine1", "Spine2", "Neck", "Head", "LeftEye", "RightEye", "LeftArm", "LeftForeArm", "LeftHand", "RightArm", "RightForeArm", "RightHand"];
    for (const name of posed) this.base.set(this.b(name), this.b(name).quaternion.clone());

    // Wave pose for the right arm, captured from the relaxed pose, then reset.
    const wave: [string, string, Vector3][] = [
      ["RightArm", "RightForeArm", new Vector3(-0.85, 0.2, 0.32)],
      ["RightForeArm", "RightHand", new Vector3(-0.28, 1, 0.24)],
      ["RightHand", "RightHandMiddle1", new Vector3(-0.2, 1, 0.12)],
    ];
    for (const [bone, child, dir] of wave) aim(this.b(bone), this.b(child), dir);
    for (const [bone] of wave) this.wavePose.set(this.b(bone), this.b(bone).quaternion.clone());
    for (const [bone, q] of this.base) bone.quaternion.copy(q);
    root.updateWorldMatrix(true, true);
  }

  wave(now: number) {
    if (now - this.waveStart > 2.2) this.waveStart = now;
  }

  update(dt: number, t: number, input: RigInput) {
    if (!this.ok) return;
    const root = this.root;
    for (const [bone, q] of this.base) bone.quaternion.copy(q);

    // --- Wave envelope -----------------------------------------------------
    const since = t - this.waveStart;
    const w = since >= 0 && since < 2.6 ? smoothstep(0, 0.45, since) * (1 - smoothstep(2.0, 2.6, since)) : 0;
    if (w > 0) {
      for (const [bone, q] of this.wavePose) bone.quaternion.slerp(q, w);
    }

    // --- Idle: weight shift and breathing ----------------------------------
    if (input.idle) {
      turn(this.b("Hips"), root, Y, Math.sin(t * 0.42) * 0.035);
      turn(this.b("Hips"), root, Z, Math.sin(t * 0.42 + 1.2) * 0.012);
      turn(this.b("Spine1"), root, Z, -Math.sin(t * 0.42 + 1.2) * 0.012);
      const breath = Math.sin(t * 1.55);
      turn(this.b("Spine2"), root, X, breath * -0.016);
      turn(this.b("LeftArm"), root, Z, breath * 0.012 * (1 - w));
      turn(this.b("RightArm"), root, Z, -breath * 0.012 * (1 - w));
    }

    // --- Gaze: neck, head and eyes follow the target ------------------------
    this.yaw = damp(this.yaw, input.lookX * 0.55, 5, dt);
    this.pitch = damp(this.pitch, -input.lookY * 0.28, 5, dt);
    turn(this.b("Neck"), root, Y, this.yaw * 0.4);
    turn(this.b("Neck"), root, X, this.pitch * 0.35);
    turn(this.b("Head"), root, Y, this.yaw * 0.55);
    turn(this.b("Head"), root, X, this.pitch * 0.6);
    turn(this.b("Head"), root, Z, -this.yaw * 0.08);
    for (const eye of ["LeftEye", "RightEye"]) {
      turn(this.b(eye), root, Y, this.yaw * 0.35);
      turn(this.b(eye), root, X, this.pitch * 0.3);
    }

    // --- Wave: forearm oscillation -----------------------------------------
    if (w > 0) {
      turn(this.b("RightForeArm"), root, Z, Math.sin(since * 10) * 0.32 * w);
      turn(this.b("Head"), root, Z, 0.06 * w);
    }

    // --- Face: blink and smile ---------------------------------------------
    let blink = 0;
    if (input.idle) {
      if (t > this.nextBlink && this.blinkStart < 0) this.blinkStart = t;
      if (this.blinkStart >= 0) {
        const p = (t - this.blinkStart) / 0.16;
        blink = p < 1 ? Math.sin(p * Math.PI) : 0;
        if (p >= 1) {
          this.blinkStart = -1;
          this.nextBlink = t + 2.4 + Math.random() * 3.2;
        }
      }
    }
    const smile = 0.16 + 0.45 * w;
    for (const mesh of this.faceMeshes) {
      const dict = mesh.morphTargetDictionary!;
      const inf = mesh.morphTargetInfluences!;
      if (dict.eyeBlinkLeft !== undefined) inf[dict.eyeBlinkLeft] = blink;
      if (dict.eyeBlinkRight !== undefined) inf[dict.eyeBlinkRight] = blink;
      if (dict.mouthSmileLeft !== undefined) inf[dict.mouthSmileLeft] = smile;
      if (dict.mouthSmileRight !== undefined) inf[dict.mouthSmileRight] = smile;
    }
  }
}
