import specJson from './medicine-wheel-spec.json';
import type { Spec } from './types';

export * from './types';

export const spec: Spec = specJson as unknown as Spec;
export default spec;
