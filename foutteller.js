function maaktypetest(orginele_Tekst) {
    const orgineel = Array.from(orginele_tekst ?? "");
    let vorige_lengte = 0;
    let fouten = 0;
    const foutposities = [];

    return {
        update(getype_tekst){
            const getypt = Array.from(getype_tekst ?? "");
            //alleen nieuwe getype letters worden gecontroleerd backspace telt niet
                 for (let i = vorige_lengte; i < getypt.length; i++) {
                    if (getypt[i] !== origineel[i]){
                        fouten++;
                        foutposities.push(1);
                    }
                 } 
                 vorige_lengte=getypt.length;
                 return fouten;
        },
        // totaal aantal fouten
        get fouten () {
          return fouten;
        },
        get foutposities() {
            return [...foutposities];
        },
        huidigefouten(getypte_tekst) {
            return tel_fouten(orginele_tekst, getypte_tekst)
        },
    };
}