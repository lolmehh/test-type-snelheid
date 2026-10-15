function telfouten (origtekst, getypetekst) {
let fouten = 0;

for (let = 0; i < getypetekst.length; i++) {
if (getypetekst[i] !== origtekst [i] )  {
    fouten++; 
}
   }




if (getypetekst.length < origtekst.length) {
    fouten+= origtekst.length - getypetekst.length;
}

return fouten;

}

const telfouten = telfouten (orgineletekst, getypetekst);

console.log ("aantalfouten;", fouten);