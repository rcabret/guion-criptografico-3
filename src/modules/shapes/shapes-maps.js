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
} from "./shapes";
import { sineMove, trajectoryMove } from "../trackers";
import * as chroma from "chroma-js";

export const ends = [
  dna_star,
  squares,
  star_pattern,
  paint_shimmer,
  ascii_star,
  blue_star_pattern,
  triangle_sine,
  triangle,
  squares_outlines,
];

export const steps = [blue, glitch, skin_glitch, paint_shimmer, colorStep];

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
  chroma.scale(["yellow", "red", "black"]),
  chroma.scale(["yellow", "navy"]).mode("hsl"),
  chroma.scale(["yellow", "navy"]).mode("lch"),
  chroma.scale(["yellow", "navy"]).mode("lab"),
  chroma.scale("YlGn").gamma(1),
  chroma.scale("RdYlBu").padding(0.3),
  chroma.scale("OrRd").padding([0.2, 0]),
];
