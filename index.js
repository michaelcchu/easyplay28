import SoundGenerator from './modules/SoundGenerator.js';
import SheetMusicDisplay from './modules/SheetMusicDisplay.js';

let activePress = null; let press;

function key(e) { 
    function down(e) {
        const strPress = "" + press;
        const badKeys = ["Alt","Arrow","Audio","Enter","Home","Launch","Meta",
            "Play","Tab"];
        const splash = document.querySelector(".splash");
        if (!badKeys.some(badKey => strPress.includes(badKey))
            && !e.repeat && (document.activeElement.nodeName !== 'INPUT') 
            && (press !== activePress) 
            && splash.classList.contains("splash-toggle")) {
                e.preventDefault();

                let chord = SheetMusicDisplay.getCurrentChord();            
                if (chord) {
                    SoundGenerator.stopPlaying(chord);
                }

                SheetMusicDisplay.goToNextChord();
                chord = SheetMusicDisplay.getCurrentChord();            
                if (chord) {
                    SoundGenerator.startPlaying(chord);
                    activePress = press;
                }
        }
        if (document.activeElement.nodeName !== 'INPUT') {
            if (e.key === "ArrowLeft") {
                let chord = SheetMusicDisplay.getCurrentChord();            
                if (chord) {
                    SoundGenerator.stopPlaying(chord);
                }
                SheetMusicDisplay.goToPreviousChord();
            }
            else if (e.key === "ArrowRight") {
                let chord = SheetMusicDisplay.getCurrentChord();            
                if (chord) {
                    SoundGenerator.stopPlaying(chord);
                }
                SheetMusicDisplay.goToNextChord();
            }
        }   
    }
    
    function up() {
        if (press === activePress) {
            const chord = SheetMusicDisplay.getCurrentChord();            
            if (chord) {
                SoundGenerator.stopPlaying(chord);
            }
            activePress = null;
        }
    }

    if (e.type.includes("key")) {press = e.key;} 
    else {press = e.changedTouches[0].identifier;}
    if (["keydown","touchstart"].includes(e.type)) {down(e);} else {up();}
}

const containerEventTypes = ["touchstart","touchend"];
for (const et of containerEventTypes) {main.addEventListener(et, key);}
const docEventTypes = ["keydown","keyup"];
for (const et of docEventTypes) {document.addEventListener(et, key);}

/*
// Turn off default event listeners
const ets = ['focus', 'pointerover', 'pointerenter', 'pointerdown', 
  'touchstart', 'gotpointercapture', 'pointermove', 'touchmove', 'pointerup', 
  'lostpointercapture', 'pointerout', 'pointerleave', 'touchend'];
for (let et of ets) {
  main.addEventListener(et, function(event) {
    event.preventDefault();
    event.stopPropagation();
  }, {passive: false}); 
}
*/