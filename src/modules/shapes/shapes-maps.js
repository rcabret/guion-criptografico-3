import {blue, dna_star, glitch, paint_shimmer, skin_glitch, squares, star_pattern} from "./shapes";
import {trajectoryMove} from "../sequences";
import * as chroma from "chroma-js";

export  const ends = [
	dna_star,
	squares,
	star_pattern,
	paint_shimmer,
]

export const steps = [
	blue,
	glitch,
	skin_glitch,
	paint_shimmer,
]

export const trackers = [
	trajectoryMove,
]

export const scales = [
	chroma.cubehelix().lightness([0, 1]),
	chroma.scale(),
	chroma.scale(["yellow", "navy"]).mode("lch"),
	chroma.scale('Spectral'),
	chroma.cubehelix().rotations(0.5),
]
