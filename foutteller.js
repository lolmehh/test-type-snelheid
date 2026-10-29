function maakTypeTest(origineleTekst) {
    const origineel = Array.from(origineleTekst ?? "");
    let vorigeLengte = 0;
    let fouten = 0;
    let totaalGetypt = 0;
    const foutPosities = [];
    
    function telVerschillen(getypt) {
        let aantal = 0;
        for (let i = 0; i < getypt.length; i++) {
            if (getypt[i] !== origineel[i]) aantal++;
        }
    return aantal;
    }

    return {
        update(getypteTekst) {
            const getypt = Array.from(getypteTekst ?? "")

            // alleen nieuwe getypte letter worden gecontroleerd, backspace word niet meegetelt
            for (let i = vorigeLengte; i <getypt.length; i++) {
                totaalGetypt++;
                if (getypt[i] !== origineel [i]) {
                    fouten ++;
                    foutPosities.push(i);
                }
            }
            vorigeLengte = getypt.length;
            return fouten;
        },
        // totaal gemaakte fouten
        get fouten() {
            return fouten;
        },
        get foutPosities() {
            return[...foutPosities];
        },
        // fouten die nog op het moment staan
        huidigeFouten(getypteTekst){
            return telVerschillen(Array.from(getypteTekst ?? ""));
        },
        //nauwkeurigheid
        get nauwkeurigheid() {
            if (totaalGetypt === 0) return 100;
            return ((totaalGetypt - fouten) / totaalGetypt) * 100;
        },
        reset() {
            vorigeLengte = 0;
            fouten = 0;
            totaalGetypt = 0;
            foutPosities.length = 0;
        },
    };
}