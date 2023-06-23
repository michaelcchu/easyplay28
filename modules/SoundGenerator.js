export default (() => {
    const audioContext = new AudioContext();
    const gainNodes = [];
    const oscNodes = [];

    const dbfs = document.getElementById("dbfs");
    dbfs.addEventListener("change", setGain);

    const tuningBlock = document.getElementById("tuningBlock");
    tuningBlock.addEventListener("change", setTuning);

    let on = false;
    let normalGain;
    let tuning;

    function tuneOscillators() {
        for (let i = 0; i < 128; i++) {
            const freq = tuning.frequency * 2**((i - toMidi(tuning)) / 12);
            oscNodes[i].frequency.setValueAtTime(freq, 
                audioContext.currentTime);
        }
    }

    function initialize() {
        if (!on) {        
            for (let i = 0; i < 128; i++) {            
              const oscillator = new OscillatorNode(audioContext);
              const gainNode = new GainNode(audioContext, {gain: 0});
            
              oscillator.connect(gainNode).connect(audioContext.destination);
              oscillator.start();
  
              gainNodes.push(gainNode);
              oscNodes.push(oscillator);
            }
              
            on = true;
        }

        resetGainNodes();

        setGain();
        setTuning();
        document.activeElement.blur();
    }

    function resetGainNodes() {
        for (let gainNode of gainNodes) {gainNode.gain.value = 0;}
    }

    const start = document.getElementById("start");
    start.addEventListener("click", initialize);

    function setGain() {
        normalGain = 10**(dbfs.value/20);
    }

    function setTuning() {
        const val = {"c":0,"d":2,"e":4,"f":5,"g":7,"a":9,"b":11,"#":1,"&":-1,
            "":0};
        tuning = {
            pitch: val[tuningPitch.value] + val[tuningAccidental.value],
            octave: +tuningOctave.value,
            frequency: +tuningFrequency.value
        }
        tuneOscillators();
    }

    function toMidi(note) {
        return (note.octave + 1) * 12 + note.pitch;
    }

    function toFreq(note) {
        return tuning.frequency * 2**((note.pitch - tuning.pitch)/12 
            + note.octave - tuning.octave)
    }

    function startPlaying(chord) {
        if (on) {
            for (let note of chord) {
                const freq = toFreq(note);
    
                let gain = 0;
                if (freq > 0) {
                    gain = normalGain * (49 / freq);
                }
                gain = 0.015; //normalGain;
        
                gainNodes[toMidi(note)].gain.setTargetAtTime(gain,
                    audioContext.currentTime, 0.015);
            }
        }
    }

    function stopPlaying(chord) {
        for (let note of chord) {
            gainNodes[toMidi(note)].gain.setTargetAtTime(0, audioContext.currentTime, 0.015);
        }
    }

    return {
        startPlaying: startPlaying, 
        stopPlaying: stopPlaying
    };
})();