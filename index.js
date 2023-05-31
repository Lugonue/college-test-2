#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from 'fs';
import csv from 'csv-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const fileName = process.argv[2];
const content = fs.readFileSync(path.join(
  __dirname,
  fileName
), 'utf-8');



// BEGIN
let results = [];
fs.createReadStream(path.join(
  __dirname,
  fileName
))
  .pipe(csv({
    separator: '|',
    mapHeaders: ({ header }) => header.trim(),
    mapValues: ({ value }) => value.trim(),
  }))
  .on('data', (data) => {

    results.push(data);
  })
  .on('end', () => {
    console.log(results[0]);
    //
    const countCreatures = results.length;
    //
    const maxPower = Math.max(...results.map(item => item['Сила']));
    const secMaxPower = Math.max(...results.filter(item => item['Сила'] !== maxPower).map(item => item['Сила']));
    //
    const minWeight = Math.min(...results.map(item => item['Средний вес']));
    const maxWeight = Math.max(...results.map(item => item['Средний вес']));
    const [divisionMax] = results.filter(item => Number(item['Средний вес']) === maxWeight);
    const [divisionMin] = results.filter(item => Number(item['Средний вес']) === minWeight);
    //
    const unitRatingByPower = results.reduce((acc, item) => {
      const calc = Number(item['Цена найма']) / Number(item['Сила'])
      if (calc > acc.best.rate) {
        acc.best.rate = calc;
        acc.best.name = item['Существо'];
      }
      if (calc < acc.badest.rate) {
        acc.badest.rate = calc;
        acc.badest.name = item['Существо'];
      }
      return acc;
    }, {
      best: {
        rate: -Infinity,
        name: null,
      }, badest: {
        rate: Infinity,
        name: null,
      }
    })


    const mostPowerfullArmy = results.reduce((acc, i) => {
      const posibleCountCreatures = Math.floor(10000 / Number(i['Цена найма']));
      const posibleCountCreaturesPower = posibleCountCreatures * Number(i['Сила'])
      if (acc.summPower < posibleCountCreaturesPower) {
        acc.summPower = posibleCountCreaturesPower;
        acc.name = i['Существо'];
        acc.summCreatures = posibleCountCreatures;
      }
      return acc;
    }, {
      name: null,
      summCreatures: null,
      summPower: -Infinity
    })


    console.log(`всего существ: ${countCreatures}`)
    console.log(`стоимость найма 10 самых сильных существ и 20 вторых по силе: ${maxPower * 10 + secMaxPower * 20}`)
    console.log(`стоимость отряда самых худых: ${Number(divisionMin['Кол-во человек в отряде']) * Number(divisionMin['Цена найма'])}, а самых толстых: ${Number(divisionMax['Кол-во человек в отряде']) * Number(divisionMax['Цена найма'])}`)
    console.log(`самым невыгодным по соотношению цены и силы является - ${unitRatingByPower.badest.name} , самым выгодным - ${unitRatingByPower.best.name} `)
    console.log(`самая сильная армия за 10000 состоит из существ "${mostPowerfullArmy.name}" в колличестве ${mostPowerfullArmy.summCreatures}, общей силой ${mostPowerfullArmy.summPower}`)

  });




// END