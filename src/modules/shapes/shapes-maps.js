import {
  ascii_star,
  blue,
  blue_star_pattern,
  colorStep,
  dna_star,
  glitch,
  paint_shimmer,
  skin_glitch,
  squares,
  squares_outlines,
  star_pattern,
  triangle,
  triangle_sine,
  nothing,
} from "./shapes";
import { sineMove, trajectoryMove } from "../trackers";
import * as chroma from "chroma-js";

export const ends = [
  dna_star,
  squares,
  star_pattern,
  paint_shimmer,
  ascii_star,
  triangle_sine,
  triangle,
  squares_outlines,
  nothing,
];

export const steps = [
  {
    name: "blue",
    func: blue,
  },
  {
    name: "glitch",
    func: glitch,
  },
  {
    name: "skin_glitch",
    func: skin_glitch,
  },
  {
    name: "paint_shimmer",
    func: paint_shimmer,
  },
  {
    name: "color_step",
    func: colorStep,
  },
];

export const trackers = [sineMove, trajectoryMove];

/**
 * TODO: You can use .domain([0,100]); to specify scale range
 * @type {(*)[]}
 */
export const scales = [
  chroma.scale(),
  chroma.cubehelix().lightness([0, 1]),
  chroma
    .cubehelix()
    .start(200)
    .rotations(-0.5)
    .gamma(0.8)
    .lightness([0.3, 0.8]),
  chroma.scale("Spectral"),
  chroma.cubehelix().rotations(0.5),
  chroma.scale(["yellow", "navy"]).mode("lch"),
  chroma.scale(["yellow", "navy"]).mode("lab"),
  chroma.scale("YlGn").gamma(1),
  chroma.scale("RdYlBu").padding(0.3),
  chroma.scale("OrRd").padding([0.2, 0]),
  chroma.scale(["#efedf5", "#bcbddc", "#756bb1"]).mode("lch"),
  chroma.scale(["#deb6a7", "#49467f"]).mode("hsl"),
  chroma.scale(["#9a695a", "#596470", "#76b1f1"]).mode("lch"),
  chroma.scale(["#8e3b42", "#6d4f6d", "#905146", "#4b5764"]).mode("hsl"),
  chroma
    .scale(["#bab1ae", "#a0a5ab", "#736063", "#3d6f92", "#2f4660"])
    .mode("hsl"),
];
