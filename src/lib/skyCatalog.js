// Real constellations used by the Inspiration star map.
//
// Each star is [name, RA hours, RA minutes, declination°], listed in the order
// new items fill them — every star after the first joins one already lit, so a
// half-finished constellation still looks like part of the real figure.
// `lines` are the stick-figure segments, drawn once both ends are lit.
//
// To add one: look up its main stars (RA/Dec) and add an entry here, then put
// its id in a cluster's `constellations` list in src/data/inspiration.js.

export const SKY = {
  pleiades: {
    name: 'Pleiades (Seven Sisters)',
    stars: [
      ['Alcyone', 3, 47.49, 24.105],
      ['Merope', 3, 46.33, 23.948],
      ['Maia', 3, 45.83, 24.368],
      ['Electra', 3, 44.88, 24.113],
      ['Taygeta', 3, 45.21, 24.467],
      ['Celaeno', 3, 44.8, 24.29],
      ['Asterope', 3, 45.91, 24.555],
    ],
    lines: [['Alcyone', 'Merope'], ['Alcyone', 'Maia'], ['Merope', 'Electra'], ['Maia', 'Taygeta'], ['Electra', 'Celaeno'], ['Celaeno', 'Taygeta'], ['Taygeta', 'Asterope']],
  },
  libra: {
    name: 'Libra',
    stars: [
      ['Zubenelgenubi', 14, 50.9, -16.04],
      ['Zubeneschamali', 15, 17.0, -9.38],
      ['Gamma', 15, 35.5, -14.79],
      ['Sigma', 15, 4.1, -25.28],
      ['Upsilon', 15, 37.0, -28.14],
      ['Tau', 15, 38.7, -29.78],
    ],
    lines: [['Zubenelgenubi', 'Zubeneschamali'], ['Zubeneschamali', 'Gamma'], ['Gamma', 'Zubenelgenubi'], ['Zubenelgenubi', 'Sigma'], ['Gamma', 'Upsilon'], ['Upsilon', 'Tau']],
  },
  orion: {
    name: 'Orion',
    stars: [
      ['Betelgeuse', 5, 55.2, 7.41],
      ['Bellatrix', 5, 25.1, 6.35],
      ['Mintaka', 5, 32.0, -0.3],
      ['Alnilam', 5, 36.2, -1.2],
      ['Alnitak', 5, 40.8, -1.94],
      ['Rigel', 5, 14.5, -8.2],
      ['Saiph', 5, 47.8, -9.67],
      ['Meissa', 5, 35.1, 9.93],
    ],
    lines: [['Betelgeuse', 'Bellatrix'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Alnitak', 'Betelgeuse'], ['Mintaka', 'Rigel'], ['Alnitak', 'Saiph'], ['Betelgeuse', 'Meissa'], ['Bellatrix', 'Meissa']],
  },
  perseus: {
    name: 'Perseus',
    stars: [
      ['Mirfak', 3, 24.3, 49.86],
      ['Gamma', 3, 4.8, 53.51],
      ['Delta', 3, 42.9, 47.79],
      ['Kappa', 3, 9.5, 44.86],
      ['Eta', 2, 50.7, 55.9],
      ['Epsilon', 3, 57.9, 40.01],
      ['Algol', 3, 8.2, 40.96],
      ['Zeta', 3, 54.1, 31.88],
      ['Rho', 3, 5.2, 38.84],
    ],
    lines: [['Mirfak', 'Gamma'], ['Mirfak', 'Delta'], ['Mirfak', 'Kappa'], ['Gamma', 'Eta'], ['Delta', 'Epsilon'], ['Kappa', 'Algol'], ['Epsilon', 'Zeta'], ['Algol', 'Rho']],
  },
  gemini: {
    name: 'Gemini',
    stars: [
      ['Castor', 7, 34.6, 31.89],
      ['Pollux', 7, 45.3, 28.03],
      ['Tau', 7, 11.1, 30.24],
      ['Wasat', 7, 20.1, 21.98],
      ['Mebsuta', 6, 43.9, 25.13],
      ['Mekbuda', 7, 4.1, 20.57],
      ['Tejat', 6, 22.9, 22.51],
      ['Alhena', 6, 37.7, 16.4],
    ],
    lines: [['Castor', 'Pollux'], ['Castor', 'Tau'], ['Pollux', 'Wasat'], ['Tau', 'Mebsuta'], ['Wasat', 'Mekbuda'], ['Mebsuta', 'Tejat'], ['Mekbuda', 'Alhena']],
  },
  cassiopeia: {
    name: 'Cassiopeia',
    stars: [
      ['Schedar', 0, 40.5, 56.54],
      ['Caph', 0, 9.2, 59.15],
      ['Navi', 0, 56.7, 60.72],
      ['Ruchbah', 1, 25.8, 60.24],
      ['Segin', 1, 54.4, 63.67],
    ],
    lines: [['Schedar', 'Caph'], ['Schedar', 'Navi'], ['Navi', 'Ruchbah'], ['Ruchbah', 'Segin']],
  },
  'ursa-major': {
    name: 'Big Dipper',
    stars: [
      ['Dubhe', 11, 3.7, 61.75],
      ['Merak', 11, 1.8, 56.38],
      ['Phecda', 11, 53.8, 53.69],
      ['Megrez', 12, 15.4, 57.03],
      ['Alioth', 12, 54.0, 55.96],
      ['Mizar', 13, 23.9, 54.93],
      ['Alkaid', 13, 47.5, 49.31],
    ],
    lines: [['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid']],
  },
  bootes: {
    name: 'Boötes',
    stars: [
      ['Arcturus', 14, 15.7, 19.18],
      ['Epsilon', 14, 45.0, 27.07],
      ['Rho', 14, 31.8, 30.37],
      ['Delta', 15, 15.5, 33.31],
      ['Gamma', 14, 32.1, 38.31],
      ['Nekkar', 15, 1.9, 40.39],
      ['Eta', 13, 54.7, 18.4],
    ],
    lines: [['Arcturus', 'Epsilon'], ['Arcturus', 'Rho'], ['Epsilon', 'Delta'], ['Rho', 'Gamma'], ['Delta', 'Nekkar'], ['Gamma', 'Nekkar'], ['Arcturus', 'Eta']],
  },
  leo: {
    name: 'Leo',
    stars: [
      ['Regulus', 10, 8.4, 11.97],
      ['Eta', 10, 7.3, 16.76],
      ['Algieba', 10, 20.0, 19.84],
      ['Zeta', 10, 16.7, 23.42],
      ['Mu', 9, 52.8, 26.01],
      ['Epsilon', 9, 45.9, 23.77],
      ['Zosma', 11, 14.1, 20.52],
      ['Denebola', 11, 49.0, 14.57],
      ['Chertan', 11, 14.2, 15.43],
    ],
    lines: [['Regulus', 'Eta'], ['Eta', 'Algieba'], ['Algieba', 'Zeta'], ['Zeta', 'Mu'], ['Mu', 'Epsilon'], ['Algieba', 'Zosma'], ['Zosma', 'Denebola'], ['Denebola', 'Chertan'], ['Chertan', 'Regulus']],
  },
  delphinus: {
    name: 'Delphinus',
    stars: [
      ['Epsilon', 20, 33.2, 11.3],
      ['Rotanev', 20, 37.5, 14.6],
      ['Sualocin', 20, 39.6, 15.91],
      ['Gamma', 20, 46.7, 16.12],
      ['Delta', 20, 43.5, 15.07],
    ],
    lines: [['Epsilon', 'Rotanev'], ['Rotanev', 'Sualocin'], ['Sualocin', 'Gamma'], ['Gamma', 'Delta'], ['Delta', 'Rotanev']],
  },
  pegasus: {
    name: 'Pegasus',
    stars: [
      ['Markab', 23, 4.8, 15.21],
      ['Scheat', 23, 3.8, 28.08],
      ['Alpheratz', 0, 8.4, 29.09],
      ['Algenib', 0, 13.2, 15.18],
      ['Homam', 22, 41.5, 10.83],
      ['Biham', 22, 10.2, 6.2],
      ['Enif', 21, 44.2, 9.88],
      ['Matar', 22, 43.0, 30.22],
    ],
    lines: [['Markab', 'Scheat'], ['Scheat', 'Alpheratz'], ['Alpheratz', 'Algenib'], ['Algenib', 'Markab'], ['Markab', 'Homam'], ['Homam', 'Biham'], ['Biham', 'Enif'], ['Scheat', 'Matar']],
  },
  andromeda: {
    name: 'Andromeda',
    stars: [
      ['Alpheratz', 0, 8.4, 29.09],
      ['Delta', 0, 39.3, 30.86],
      ['Mirach', 1, 9.7, 35.62],
      ['Almach', 2, 3.9, 42.33],
      ['Mu', 0, 56.8, 38.5],
      ['Nu', 0, 49.8, 41.08],
    ],
    lines: [['Alpheratz', 'Delta'], ['Delta', 'Mirach'], ['Mirach', 'Almach'], ['Mirach', 'Mu'], ['Mu', 'Nu']],
  },
  cygnus: {
    name: 'Cygnus',
    stars: [
      ['Deneb', 20, 41.4, 45.28],
      ['Sadr', 20, 22.2, 40.26],
      ['Fawaris', 19, 45.0, 45.13],
      ['Aljanah', 20, 46.2, 33.97],
      ['Eta', 19, 56.3, 35.08],
      ['Albireo', 19, 30.7, 27.96],
      ['Zeta', 21, 12.9, 30.23],
    ],
    lines: [['Deneb', 'Sadr'], ['Sadr', 'Fawaris'], ['Sadr', 'Aljanah'], ['Sadr', 'Eta'], ['Eta', 'Albireo'], ['Aljanah', 'Zeta']],
  },
  aquila: {
    name: 'Aquila',
    stars: [
      ['Altair', 19, 50.8, 8.87],
      ['Tarazed', 19, 46.3, 10.61],
      ['Alshain', 19, 55.3, 6.41],
      ['Delta', 19, 25.5, 3.11],
      ['Zeta', 19, 5.4, 13.86],
      ['Lambda', 19, 6.2, -4.88],
      ['Theta', 20, 11.3, -0.82],
    ],
    lines: [['Altair', 'Tarazed'], ['Altair', 'Alshain'], ['Altair', 'Delta'], ['Delta', 'Zeta'], ['Delta', 'Lambda'], ['Alshain', 'Theta']],
  },
  sagittarius: {
    name: 'Sagittarius (Teapot)',
    stars: [
      ['Kaus Media', 18, 21.0, -29.83],
      ['Kaus Australis', 18, 24.2, -34.38],
      ['Alnasl', 18, 5.8, -30.42],
      ['Kaus Borealis', 18, 28.0, -25.42],
      ['Phi', 18, 45.7, -26.99],
      ['Ascella', 19, 2.6, -29.88],
      ['Nunki', 18, 55.3, -26.3],
      ['Tau', 19, 6.9, -27.67],
    ],
    lines: [['Kaus Media', 'Kaus Australis'], ['Kaus Media', 'Alnasl'], ['Alnasl', 'Kaus Australis'], ['Kaus Media', 'Kaus Borealis'], ['Kaus Media', 'Phi'], ['Kaus Borealis', 'Phi'], ['Phi', 'Ascella'], ['Ascella', 'Kaus Australis'], ['Phi', 'Nunki'], ['Nunki', 'Tau'], ['Tau', 'Ascella']],
  },
  lyra: {
    name: 'Lyra',
    stars: [
      ['Vega', 18, 36.9, 38.78],
      ['Zeta', 18, 44.8, 37.61],
      ['Sheliak', 18, 50.1, 33.36],
      ['Sulafat', 18, 59.0, 32.69],
      ['Delta', 18, 54.5, 36.9],
      ['Epsilon', 18, 44.3, 39.61],
    ],
    lines: [['Vega', 'Zeta'], ['Zeta', 'Sheliak'], ['Sheliak', 'Sulafat'], ['Sulafat', 'Delta'], ['Delta', 'Zeta'], ['Vega', 'Epsilon']],
  },
  taurus: {
    name: 'Taurus',
    stars: [
      ['Aldebaran', 4, 35.9, 16.51],
      ['Theta', 4, 28.6, 15.87],
      ['Gamma', 4, 19.8, 15.63],
      ['Delta', 4, 22.9, 17.54],
      ['Epsilon', 4, 28.6, 19.18],
      ['Elnath', 5, 26.3, 28.61],
      ['Tianguan', 5, 37.6, 21.14],
      ['Lambda', 4, 0.7, 12.49],
    ],
    lines: [['Aldebaran', 'Theta'], ['Theta', 'Gamma'], ['Gamma', 'Delta'], ['Delta', 'Epsilon'], ['Epsilon', 'Elnath'], ['Aldebaran', 'Tianguan'], ['Gamma', 'Lambda']],
  },
  scorpius: {
    name: 'Scorpius',
    stars: [
      ['Antares', 16, 29.4, -26.43],
      ['Paikauhale', 16, 35.9, -28.22],
      ['Alniyat', 16, 21.2, -25.59],
      ['Dschubba', 16, 0.3, -22.62],
      ['Acrab', 16, 5.4, -19.81],
      ['Fang', 15, 58.9, -26.11],
      ['Larawag', 16, 50.2, -34.29],
      ['Mu', 16, 51.9, -38.05],
      ['Zeta', 16, 54.0, -42.36],
      ['Eta', 17, 12.2, -43.24],
      ['Sargas', 17, 37.3, -43.0],
      ['Iota', 17, 47.6, -40.13],
      ['Girtab', 17, 42.5, -39.03],
      ['Shaula', 17, 33.6, -37.1],
    ],
    lines: [['Antares', 'Paikauhale'], ['Antares', 'Alniyat'], ['Alniyat', 'Dschubba'], ['Dschubba', 'Acrab'], ['Dschubba', 'Fang'], ['Paikauhale', 'Larawag'], ['Larawag', 'Mu'], ['Mu', 'Zeta'], ['Zeta', 'Eta'], ['Eta', 'Sargas'], ['Sargas', 'Iota'], ['Iota', 'Girtab'], ['Girtab', 'Shaula']],
  },
  'corona-borealis': {
    name: 'Corona Borealis',
    stars: [
      ['Alphecca', 15, 34.7, 26.71],
      ['Nusakan', 15, 27.8, 29.11],
      ['Gamma', 15, 42.7, 26.3],
      ['Theta', 15, 32.9, 31.36],
      ['Delta', 15, 49.6, 26.07],
      ['Epsilon', 15, 57.6, 26.88],
      ['Iota', 16, 1.5, 29.85],
    ],
    lines: [['Alphecca', 'Nusakan'], ['Alphecca', 'Gamma'], ['Nusakan', 'Theta'], ['Gamma', 'Delta'], ['Delta', 'Epsilon'], ['Epsilon', 'Iota']],
  },
  'canis-major': {
    name: 'Canis Major',
    stars: [
      ['Sirius', 6, 45.1, -16.72],
      ['Mirzam', 6, 22.7, -17.96],
      ['Omicron2', 7, 3.0, -23.83],
      ['Wezen', 7, 8.4, -26.39],
      ['Adhara', 6, 58.6, -28.97],
      ['Aludra', 7, 24.1, -29.3],
      ['Furud', 6, 20.3, -30.06],
    ],
    lines: [['Sirius', 'Mirzam'], ['Sirius', 'Omicron2'], ['Omicron2', 'Wezen'], ['Wezen', 'Adhara'], ['Wezen', 'Aludra'], ['Adhara', 'Furud']],
  },
}

// Longest side of a constellation, in map units, and the closest two stars may sit.
const MAX_SIZE = 240
const MIN_SIZE = 120
const TARGET_GAP = 44

// Flat sky projection around the constellation's centre: east is left, north is up.
// Returns { points: [{x, y}] in fill order, edges: [[i, j]] with j the later star }.
function project(constellation) {
  const raw = constellation.stars.map(([, h, m, dec]) => ({ ra: (h + m / 60) * 15, dec }))
  const ra0 = raw[0].ra
  const unwrap = (ra) => ((ra - ra0 + 540) % 360) - 180
  const meanDec = raw.reduce((sum, star) => sum + star.dec, 0) / raw.length
  const squash = Math.cos((meanDec * Math.PI) / 180)
  const flat = raw.map((star) => ({ x: -unwrap(star.ra) * squash, y: -star.dec }))

  const xs = flat.map((p) => p.x)
  const ys = flat.map((p) => p.y)
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1e-6)

  let minGap = Infinity
  flat.forEach((a, i) => flat.slice(i + 1).forEach((b) => { minGap = Math.min(minGap, Math.hypot(a.x - b.x, a.y - b.y)) }))
  // Spread stars far enough apart for their labels, within a sensible size range.
  const scale = Math.min(MAX_SIZE, Math.max(MIN_SIZE, (TARGET_GAP / minGap) * span)) / span

  const index = Object.fromEntries(constellation.stars.map(([name], i) => [name, i]))
  const edges = constellation.lines.map(([a, b]) => {
    const [i, j] = [index[a], index[b]]
    if (i === undefined || j === undefined) throw new Error(`[sky] ${constellation.name}: unknown star in line ${a}–${b}`)
    return i < j ? [i, j] : [j, i]
  })
  const points = flat.map((p) => ({ x: (p.x - cx) * scale, y: (p.y - cy) * scale }))
  spreadApart(points)
  return { points, edges }
}

// Tight knots (Orion's belt, the Hyades) are nudged apart just enough for labels,
// keeping the overall figure.
const MIN_GAP = 34
const ROW_GAP = 18
const ROW_REACH = 100
function spreadApart(points) {
  for (let round = 0; round < 80; round += 1) {
    let moved = false
    points.forEach((a, i) => points.slice(i + 1).forEach((b) => {
      const dx = b.x - a.x
      const dy = b.y - a.y
      const distance = Math.hypot(dx, dy) || 0.01
      // Labels sit to the right of each star, so two stars on nearly the same
      // row need a little vertical room or their names run together.
      if (Math.abs(dy) < ROW_GAP && Math.abs(dx) < ROW_REACH) {
        const nudge = (ROW_GAP - Math.abs(dy)) / 2 * (dy < 0 ? -1 : 1)
        a.y -= nudge; b.y += nudge
        moved = true
      }
      if (distance >= MIN_GAP) return
      const push = (MIN_GAP - distance) / 2 / distance
      a.x -= dx * push; a.y -= dy * push
      b.x += dx * push; b.y += dy * push
      moved = true
    }))
    if (!moved) break
  }
}

const projected = {}
export function skyShape(id) {
  if (!SKY[id]) throw new Error(`[sky] unknown constellation "${id}"`)
  projected[id] ??= project(SKY[id])
  return projected[id]
}
