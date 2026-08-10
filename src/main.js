import "./styles/base.css";
import "./styles/sections.css";
import { initCountdown } from "./sections/countdown.js";
import { initScrollReveal } from "./sections/scrollReveal.js";
import { initForms } from "./sections/formHandler.js";
import { initMusicPlayer } from "./sections/musicPlayer.js";

initCountdown();
initScrollReveal();
initForms();
initMusicPlayer();
