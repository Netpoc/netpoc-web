/**
 * Illustration build config — see docs/brand/illustrations.md.
 *
 * The source SVGs are flat Figma exports (no named layers), so "parts" are
 * recovered two ways:
 *   1. colour role  — every fill hex maps to a role (skin, cloth, gold…), which
 *      lets CSS recolour a role while keeping its light/dark folds.
 *   2. region rules — paths of given roles whose bounding box falls inside a
 *      region (viewBox units) get a `part-*` class for animation.
 */

/** Role per fill colour. Anything unlisted becomes `fp-other` (never recoloured). */
export const ROLES = {
  skin: [
    '#1F0C08', '#260C07', '#2E110C', '#320E0F', '#33130D', '#3D1E17', '#421911', '#421C14',
    '#451E16', '#4A1F16', '#4D221A', '#51251E', '#52241A', '#57261D', '#5B2C23', '#5E2A21',
    '#612B1F', '#69352A', '#6D3327', '#73392C', '#75372A', '#7A3F31', '#7B3F31', '#7D4033',
    '#874A3D', '#894C3F', '#8F5447', '#945647', '#182538', '#C68561',
  ],
  /** Primary cloth: the reds (wrappers, headwraps, headbands). */
  'cloth-a': ['#E20303', '#C70303', '#C60000', '#DB1F21', '#AA0000', '#AB0000', '#8E0000', '#700000', '#FF1D25', '#AF310B'],
  /** Secondary cloth: oranges and yellows. */
  'cloth-b': ['#DF6E28', '#F78807', '#FCB21E', '#FCCD47', '#FF931E', '#FAB04F'],
  /** Ivory/gold: beads, feathers, collars, clay pots. */
  gold: ['#E0CB9D', '#E2C49C', '#C2A376', '#B5A16D', '#D6B482', '#DDC4A2', '#9E8057', '#8F7F56', '#7A6D4A', '#705D2D', '#E0AA75', '#966114'],
  /** Accent cloth: teal headwrap tie, blue/green dress panels. */
  accent: ['#1FCBDD', '#1BB1C9', '#19A3BA', '#086D77', '#25598E', '#6A8246'],
  /** Metal: earrings, bangles, anklets. */
  metal: ['#737373', '#BDCCD4', '#EADFD3'],
  /** Eye whites, teeth, cowrie shells — kept as-is in every palette except `night`. */
  white: ['#F5F5F5', '#FFFFFF'],
}

/**
 * Part rules per figure. `box` is [x1, y1, x2, y2] in the figure's viewBox;
 * a path matches when its bbox centre lies inside the box and its role is in
 * `roles` (all roles when omitted). `origin` is the rotation pivot (viewBox
 * units) for the part's animation.
 */
export const FIGURES = {
  'woman-waving': {
    component: 'FigWomanWaving',
    // Raised forearm + hand + bangle; pivot at the elbow.
    parts: [{ part: 'wave', roles: ['skin', 'metal'], box: [262, 0, 402, 330], origin: [292, 300] }],
  },
  'man-headdress': {
    component: 'FigManHeaddress',
    // Feather crown; pivot at the headband.
    parts: [{ part: 'feathers', roles: ['gold'], box: [0, 0, 572, 330], origin: [286, 330] }],
  },
  family: {
    component: 'FigFamily',
    parts: [{ part: 'feathers', roles: ['gold'], box: [0, 0, 330, 140], origin: [160, 140] }],
  },
  'man-standing': { component: 'FigManStanding', parts: [] },
  'couple-with-pots': { component: 'FigCoupleWithPots', parts: [] },
}
