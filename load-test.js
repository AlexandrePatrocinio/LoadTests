import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem, randomString, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '5s', target: 50 },
    { duration: '5s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 100 },
    { duration: '15s', target: 250 },
    { duration: '15s', target: 250 },
    { duration: '25s', target: 300 },
    { duration: '15s', target: 300 },
    { duration: '25s', target: 350 },
    { duration: '15s', target: 350 },
    { duration: '25s', target: 430 },
    { duration: '15s', target: 430 },
  ],
  thresholds: {
    checks: ['rate>0.90'],
    http_req_duration: ['p(90)<150'],
  },  
};

const stacks = [
  ["C#", "Unity", "Postgres"],
  ["Java", "Spring", "Oracle"],
  ["Node", "Express", "MongoDB"],
  ["Python", "Django", "MySQL"],
  ["Elixir", "Fenix", "MariaDB"],
  ["F#", "MAUI", "CosmosDB"],
  ["Kotlin", "Mobile", "MongoDB"],
];

function randomDate(start = new Date(1980, 0, 1), end = new Date(2005, 0, 1)) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

const personCache = [];
function generateAlias() {
  if (Math.random() < 0.05 && personCache.length > 0) {
    return randomItem(personCache).alias; // 5% duplicados
  }
  const alias = randomString(3);
  return alias;
}

function generatePerson() {
  const person = {
    alias: generateAlias(),
    name: `${randomString(6)} ${randomString(8)}`,
    birthdate: randomDate(),
    stack: randomItem(stacks),
  };

  personCache.push(person);
  if (personCache.length > 25000) personCache.shift(); // mantém o cache limitado

  return person;
}

function generateUpdatePerson() {
  const person = randomItem(personCache);
  if (!person) return null;
  person.name = `${randomString(6)} ${randomString(8)}`;
  person.birthdate = randomDate();
  person.stack = randomItem(stacks);
  return person;
}

export default function () {
  const baseUrl = 'http://apiaddress:9999/persons';

  //60% read operations
  //15% unique create operations
  //5% batch create operations
  //15% unique update operations
  //5% unique delete operations

  if (Math.random() < 0.6) {
    let res;
    const type = randomIntBetween(1, 4);
    switch (type) {
      case 1:
        if (personCache.length === 0) break;
        res = http.get(`${baseUrl}?t=${randomItem(personCache).alias}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'GET /persons/:t=alias valid status': (r) => [200, 404, 400, 422].includes(r.status),
          'GET /persons/:t=alias response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      case 2:
        res = http.get(`${baseUrl}?o=Alias&pg=${randomIntBetween(1, 3)}&sz=${randomIntBetween(3, 10)}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'GET /persons/:o=alias&pg&sz valid status': (r) => [200, 404, 400, 422].includes(r.status),
          'GET /persons/:o=alias&pg&sz response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      case 3:
        res = http.get(`${baseUrl}?t=a&o=Birthdate&pg=1&sz=${randomIntBetween(3, 10)}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'GET /persons/:t=a&o=Birthdate&pg=1&sz valid status': (r) => [200, 404, 400, 422].includes(r.status),
          'GET /persons/:t=a&o=Birthdate&pg=1&sz response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      case 4:
        if (personCache.length === 0) break;
        res = http.get(`${baseUrl}/${randomItem(personCache).id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'GET /persons/:id valid status': (r) => [200, 404, 400, 422].includes(r.status),
          'GET /persons/:id response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
    }
  } else {    
    const type = Math.random();
    let res;
    switch (true) {
      case type < 0.4:
        res = http.post(baseUrl, JSON.stringify(generatePerson()), {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'POST /persons valid status': (r) =>  [201, 404, 400, 422].includes(r.status),
          'POST /persons response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      case type < 0.5:
        const limit = randomIntBetween(5, 25);
        let persons = new Array(limit);
        for (let i=0; i < limit; i++) persons[i] = generatePerson();
        res = http.post(`${baseUrl}/batch`, JSON.stringify(persons), {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, { 
          'POST /persons/batch valid status': (r) => [201, 404, 400, 422].includes(r.status),
          'POST /persons/batch response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      case type < 0.9:
        const person = generateUpdatePerson();
        if (!person) break;
        res = http.put(baseUrl, JSON.stringify(person), {
          headers: { 'Content-Type': 'application/json' },
        });
        check(res, {
          'PUT /persons valid status': (r) => [200, 404, 400, 422].includes(r.status),
          'PUT /persons response time < 150ms': (r) => r.timings.duration < 150
        });
        break;
      default:
        if (personCache.length > 0) {
          const person = personCache.splice(randomIntBetween(0, personCache.length - 1), 1)[0];
          res = http.del(`${baseUrl}/${person.id}`, null, {
            headers: { 'Content-Type': 'application/json' },
          });
          check(res, { 
            'DELETE /persons/:id valid status': (r) => [200, 404, 400, 422].includes(r.status),
            'DELETE /persons/:id response time < 150ms': (r) => r.timings.duration < 150
          });        
        }
        break;
    }    
  }
  sleep(1);
}
