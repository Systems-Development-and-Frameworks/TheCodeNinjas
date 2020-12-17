import { DataSource } from "apollo-datasource";
import Person from "../entities/person.entity";
import * as uuid from "uuid";
import * as bcrypt from "bcrypt";

export default class PersonDatasource extends DataSource {
  seedPersons: Person[];
  persons: Person[];

  constructor(person: Person[]) {
    super();

    this.persons = person;
    this.seedPersons = person;
  }

  getPersons(): Promise<Person[]> {
    return Promise.resolve(this.persons);
  }

  getPerson(id: string): Promise<Person> {
    return Promise.resolve(this.persons.find((person) => person.id === id));
  }

  getPersonByEmail(email: string): Promise<Person> {
    return Promise.resolve(
      this.persons.find((person) => person.email === email)
    );
  }

  async createPerson(
    person: Partial<Person>,
    password: string
  ): Promise<Person> {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const newPerson: Person = {
      id: uuid.v4(),
      name: person.name,
      email: person.email,
      passwordHash: hash,
      passwordSalt: salt,
    };

    this.persons = [...this.persons, newPerson];

    return Promise.resolve(newPerson);
  }

  reset() {
    this.persons = this.seedPersons;
  }
}
