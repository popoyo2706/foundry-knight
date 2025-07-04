
export class AspectsNPCDataModel extends foundry.abstract.DataModel {
	static defineSchema() {
    const {NumberField, SchemaField} = foundry.data.fields;
    let data = {};

    for(let a of CONFIG.KNIGHT.LIST.aspects) {
      data[a] = new SchemaField({
        max:new NumberField({ initial: 20, min:0, integer: true, nullable: false }),
        value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
        ae:new SchemaField({
          mineur:new SchemaField({
            value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
            max:new NumberField({ initial: 10, min:0, integer: true, nullable: false }),
          }),
          majeur:new SchemaField({
            value:new NumberField({ initial: 0, min:0, integer: true, nullable: false }),
            max:new NumberField({ initial: 10, min:0, integer: true, nullable: false }),
          }),
        }),
      });
    }

    return data;
  }

  prepareData() {
    for(let a in this) {
      if(this[a].value > this[a].max) {
        Object.defineProperty(this[a], 'value', {
            value: this[a].max,
        });
      }

      if(this[a].ae.mineur.value > this[a].ae.mineur.max) {
        Object.defineProperty(this[a].ae.mineur, 'value', {
            value: this[a].ae.mineur.max,
        });
      }

      if(this[a].ae.majeur.value > this[a].ae.majeur.max) {
        Object.defineProperty(this[a].ae.majeur, 'value', {
            value: this[a].ae.majeur.max,
        });
      }
    }
  }
}


function moitieArrondiSuperieur(entier)
{
  return ((entier - (entier % 2)) / 2) + (entier % 2);
}

export function calculDefense(element) {
  return moitieArrondiSuperieur(element.aspects['bete'].value) + element.aspect.masque.mineur + element.aspect.masque.majeur;
}

export function calculReaction(element) {
  return moitieArrondiSuperieur(element.aspects['machine'].value) + element.aspect.machine.mineur + element.aspect.machine.majeur;
}

export function calculSante(element)
{
  return moitieArrondiSuperieur(element.aspects['chair'].value) * 6 + 10;
}

export function misAJourSante(element)
{
  const sante = calculSante(element);
  if (element.sante.max < sante)
  {
    element.sante.max = sante;
    if (element.sante.value <= 0)
    {
      element.sante.value = element.sante.max;
    }
  }
}
